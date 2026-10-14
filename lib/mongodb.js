import { MongoClient } from "mongodb";
import dns from "node:dns";
import {
  isItemVisibleOnWebsite,
  normalizeProduct,
  makeSlug,
  WEBSITE_ID,
  detectCompanyId,
  ALL_COMPANIES,
} from "./catalog-utils.js";

// Ensure DNS resolution for SRV records
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch {
  // Ignore DNS config warning
}

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://rajbiosis15_db_user:R7jmlgZ3RfeB0MEz@superadminrbpl.aneatej.mongodb.net/company_master_cms?retryWrites=true&w=majority";

const MONGODB_DB = process.env.MONGODB_DB || "company_master_cms";

let cachedClient = global._mongoClient || null;
let cachedDb = global._mongoDb || null;
let cachedClientPromise = global._mongoClientPromise || null;

// High-speed in-memory cache to guarantee instant page loads
const memoryCache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

function getCached(key) {
  const item = memoryCache.get(key);
  if (item && Date.now() - item.time < CACHE_TTL_MS) {
    return item.data;
  }
  return null;
}

function setCached(key, data) {
  memoryCache.set(key, { data, time: Date.now() });
}

export function invalidateCache(keyPrefix = "") {
  if (!keyPrefix) {
    memoryCache.clear();
  } else {
    for (const key of memoryCache.keys()) {
      if (key.startsWith(keyPrefix)) {
        memoryCache.delete(key);
      }
    }
  }
}

/**
 * Connect to MongoDB Atlas with connection pooling
 */
export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!cachedClientPromise) {
    const options = {
      maxPoolSize: 25,
      minPoolSize: 2,
      maxIdleTimeMS: 60000,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      tls: true,
      readPreference: "primaryPreferred",
    };

    cachedClientPromise = MongoClient.connect(MONGODB_URI, options)
      .then((client) => {
        const db = client.db(MONGODB_DB);
        cachedClient = client;
        cachedDb = db;
        global._mongoClient = client;
        global._mongoDb = db;
        return { client, db };
      })
      .catch((err) => {
        cachedClientPromise = null;
        global._mongoClientPromise = null;
        console.error("[MongoDB] Connection error:", err.message);
        throw err;
      });

    global._mongoClientPromise = cachedClientPromise;
  }

  return cachedClientPromise;
}

export async function getDb() {
  const { db } = await connectToDatabase();
  return db;
}

/**
 * Fetch dynamic site data (home, services, contact, about, districts) directly from MongoDB
 */
export async function getSiteDataFromMongo(type = "all", websiteId = WEBSITE_ID) {
  const cacheKey = `site-data:${websiteId}:${type}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const db = await getDb();

    if (type === "all") {
      const [home, services, contact, aboutDoc] = await Promise.all([
        db.collection("home").findOne({ _id: websiteId }),
        db.collection("services").findOne({ _id: websiteId }),
        db.collection("contact").findOne({ _id: websiteId }),
        db.collection("pages").findOne({
          $or: [{ _id: `${websiteId}_about` }, { websiteId, page: "about" }],
        }),
      ]);

      const data = {
        home: home ? stripId(home) : null,
        services: services ? stripId(services) : null,
        contact: contact ? stripId(contact) : null,
        about: aboutDoc ? stripId(aboutDoc) : null,
      };

      setCached(cacheKey, data);
      return data;
    }

    if (type === "home") {
      const doc = await db.collection("home").findOne({ _id: websiteId });
      const res = doc ? stripId(doc) : null;
      setCached(cacheKey, res);
      return res;
    }

    if (type === "services") {
      const doc = await db.collection("services").findOne({ _id: websiteId });
      const res = doc ? stripId(doc) : null;
      setCached(cacheKey, res);
      return res;
    }

    if (type === "contact") {
      const doc = await db.collection("contact").findOne({ _id: websiteId });
      const res = doc ? stripId(doc) : null;
      setCached(cacheKey, res);
      return res;
    }

    if (type === "about") {
      const doc = await db.collection("pages").findOne({
        $or: [{ _id: `${websiteId}_about` }, { websiteId, page: "about" }],
      });
      const res = doc ? stripId(doc) : null;
      setCached(cacheKey, res);
      return res;
    }

    if (type === "districts") {
      const docs = await db
        .collection("districts")
        .find({ websiteId })
        .toArray();
      const res = docs.map(stripId);
      setCached(cacheKey, res);
      return res;
    }

    if (type.startsWith("district-")) {
      const slug = type.replace(/^district-/, "");
      const doc = await db.collection("districts").findOne({
        $or: [{ _id: `${websiteId}_${slug}` }, { websiteId, slug }],
      });
      const res = doc ? stripId(doc) : null;
      setCached(cacheKey, res);
      return res;
    }

    // Generic fallback for any other page
    const pageDoc = await db.collection("pages").findOne({
      $or: [{ _id: `${websiteId}_${type}` }, { websiteId, page: type }],
    });
    const res = pageDoc ? stripId(pageDoc) : null;
    setCached(cacheKey, res);
    return res;
  } catch (err) {
    console.error(`[MongoDB] getSiteDataFromMongo error for ${type}:`, err.message);
    return null;
  }
}

function stripId(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return rest;
}

/**
 * Fetch complete dynamic catalog directly from MongoDB with cascading visibility
 */
export async function getMasterCatalogFromMongo(websiteId = WEBSITE_ID) {
  const cacheKey = `catalog:${websiteId}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const productsMap = new Map();
  const categoryTree = new Map();

  try {
    const db = await getDb();
    const primaryCompany = detectCompanyId(websiteId);

    // Primary company collection first (e.g. human_products), then fallbacks
    const collectionsToScan = [
      `${primaryCompany}_products`,
      "human_products",
      "rbpl_products",
      "global_products",
    ];

    const uniqueCollections = [...new Set(collectionsToScan)];

    for (const colName of uniqueCollections) {
      try {
        const catDocs = await db.collection(colName).find({}).toArray();

        for (const catData of catDocs) {
          if (!isItemVisibleOnWebsite(catData, websiteId)) continue;

          const catName = catData.name || catData.category || catData.id || "Medical Products";
          const catSlug = catData.slug || catData.id || makeSlug(catName);

          if (!categoryTree.has(catSlug)) {
            categoryTree.set(catSlug, {
              id: catData.id || catSlug,
              name: catName,
              category: catName,
              slug: catSlug,
              subcategories: new Map(),
            });
          }

          const catObj = categoryTree.get(catSlug);
          const subcategories = Array.isArray(catData.subcategories) ? catData.subcategories : [];

          for (const subData of subcategories) {
            if (!isItemVisibleOnWebsite(subData, websiteId)) continue;

            const subName = subData.name || subData.subCategory || subData.id || catName;
            const subSlug = subData.slug || subData.id || makeSlug(subName);

            if (!catObj.subcategories.has(subSlug)) {
              catObj.subcategories.set(subSlug, {
                id: subData.id || subSlug,
                name: subName,
                subCategory: subName,
                slug: subSlug,
                products: [],
              });
            }

            const subObj = catObj.subcategories.get(subSlug);
            const prods = Array.isArray(subData.products) ? subData.products : [];

            prods.forEach((p, idx) => {
              if (!isItemVisibleOnWebsite(p, websiteId)) return;

              const norm = normalizeProduct(
                {
                  ...p,
                  category: catName,
                  subCategory: subName,
                  categoryId: catSlug,
                  subcategoryId: subSlug,
                },
                catName,
                subName,
                idx
              );

              if (!productsMap.has(norm.slug)) {
                productsMap.set(norm.slug, norm);
                subObj.products.push(norm);
              }
            });
          }
        }
      } catch (colErr) {
        // Continue to next collection
      }
    }

    // Direct products collection check if any
    try {
      const directProds = await db.collection("products").find({}).toArray();
      directProds.forEach((p, idx) => {
        if (!isItemVisibleOnWebsite(p, websiteId)) return;
        const catName = p.category || "Diagnostic Equipment";
        const subName = p.subCategory || p.subcategory || catName;
        const catSlug = p.categoryId || makeSlug(catName);
        const subSlug = p.subcategoryId || makeSlug(subName);

        const norm = normalizeProduct(p, catName, subName, idx);
        if (!productsMap.has(norm.slug)) {
          productsMap.set(norm.slug, norm);

          if (!categoryTree.has(catSlug)) {
            categoryTree.set(catSlug, {
              id: catSlug,
              name: catName,
              category: catName,
              slug: catSlug,
              subcategories: new Map(),
            });
          }
          const catObj = categoryTree.get(catSlug);
          if (!catObj.subcategories.has(subSlug)) {
            catObj.subcategories.set(subSlug, {
              id: subSlug,
              name: subName,
              subCategory: subName,
              slug: subSlug,
              products: [],
            });
          }
          catObj.subcategories.get(subSlug).products.push(norm);
        }
      });
    } catch {
      // Ignore
    }

    const allProducts = Array.from(productsMap.values());
    const categoryList = Array.from(categoryTree.values())
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
        category: cat.name,
        slug: cat.slug,
        subcategories: Array.from(cat.subcategories.values()),
      }))
      .filter((cat) => cat.subcategories.some((s) => (s.products || []).length > 0));

    const result = {
      categoryList,
      categoryProducts: allProducts,
      totalCount: allProducts.length,
    };

    setCached(cacheKey, result);
    return result;
  } catch (err) {
    console.error("[MongoDB] getMasterCatalogFromMongo error:", err.message);
    return {
      categoryList: [],
      categoryProducts: [],
      totalCount: 0,
    };
  }
}

/**
 * Fetch a single product by slug or id directly from MongoDB
 */
export async function getProductBySlugFromMongo(slug, websiteId = WEBSITE_ID) {
  if (!slug) return null;
  const target = String(slug).toLowerCase().trim();
  const catalog = await getMasterCatalogFromMongo(websiteId);
  return (
    catalog.categoryProducts.find(
      (p) =>
        p.slug.toLowerCase() === target ||
        String(p.id).toLowerCase() === target ||
        String(p.productId).toLowerCase() === target ||
        String(p.categoryProductId).toLowerCase() === target
    ) || null
  );
}

/**
 * Save user enquiry into MongoDB queries collection for SuperAdmin
 */
export async function insertQueryToMongo({
  type = "contact",
  name,
  email,
  phone,
  message = "",
  subject = "",
  productName = "",
  productSlug = "",
  brand = "",
  model = "",
  district = "",
  websiteId = WEBSITE_ID,
}) {
  try {
    const db = await getDb();
    const queryId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const docId = `${websiteId}_${queryId}`;
    const now = new Date().toISOString();

    const doc = {
      _id: docId,
      queryId,
      websiteId,
      type,
      status: "unread",
      name: (name || "").trim(),
      email: (email || "").trim(),
      phone: (phone || "").trim(),
      message: (message || "").trim(),
      subject: (subject || "").trim(),
      createdAt: now,
      data: {
        id: queryId,
        queryId,
        websiteId,
        type,
        name: (name || "").trim(),
        email: (email || "").trim(),
        phone: (phone || "").trim(),
        subject: (subject || "").trim(),
        message: (message || "").trim(),
        productName: (productName || "").trim(),
        productSlug: (productSlug || "").trim(),
        brand: (brand || "").trim(),
        model: (model || "").trim(),
        district: (district || "").trim(),
        createdAt: now,
        source: "website",
      },
    };

    await db.collection("queries").insertOne(doc);
    return { success: true, queryId, docId };
  } catch (err) {
    console.error("[MongoDB] insertQueryToMongo error:", err.message);
    throw err;
  }
}
