export * from "./catalog-utils.js";
import {
  ADMIN_API_BASE_URL,
  normalizeDomainId,
  RAW_WEBSITE_ID,
  WEBSITE_ID,
  detectCompanyId,
  PRIMARY_COMPANY,
  ALL_COMPANIES,
  makeSlug,
  isItemVisibleOnWebsite,
  isVisibleOnWebsite,
  normalizeProduct,
} from "./catalog-utils.js";

/**
 * Fetch raw site-data for a specific page/type from Admin API
 */
export async function fetchSiteDataFromAdmin(type = "all", websiteId = WEBSITE_ID) {
  try {
    const isClient = typeof window !== "undefined";
    const companyId = detectCompanyId(websiteId);
    const url = isClient
      ? `/api/site-data?websiteId=${encodeURIComponent(websiteId)}&type=${encodeURIComponent(type)}`
      : `${ADMIN_API_BASE_URL}/api/site-data?websiteId=${encodeURIComponent(websiteId)}&companyId=${encodeURIComponent(companyId)}&type=${encodeURIComponent(type)}`;

    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Pragma": "no-cache",
      },
    });

    if (!res.ok) {
      return null;
    }

    const json = await res.json();
    if (json.success && json.data !== undefined) {
      return json.data;
    }
    return json.data || null;
  } catch (error) {
    return null;
  }
}

import { getDocFromSqlite, getCollectionFromSqlite } from "./sqliteDb.js";

/**
 * Fetch catalog directly from Master Catalog & Company Collections in SQLite:
 * 1. companies/{companyId}/categories/{categoryId}/subcategories/{subcategoryId}/products
 * 2. companies/{companyId}/products (Without-Category & Master Products)
 * 3. websites/{websiteId}/products (Direct website synced products)
 * Enforces strict cascading visibility across all company collections.
 */
async function fetchMasterCatalogFromSqlite(websiteId = WEBSITE_ID) {
  const productsMap = new Map();
  const categoryTree = new Map();
  const categoryVisibilityMap = new Map();
  const subcategoryVisibilityMap = new Map();

  // Companies to scan: primary detected company first, then all companies
  const primaryComp = detectCompanyId(websiteId);
  const companiesToScan = [primaryComp, ...ALL_COMPANIES.filter((c) => c !== primaryComp)];

  try {
    for (const companyId of companiesToScan) {
      // -------------------------------------------------------------
      // Step 1: Fetch Master Categories and Subcategories Tree
      // -------------------------------------------------------------
      const cats = getCollectionFromSqlite(`companies/${companyId}/categories`);

      for (const catData of cats) {
        const isCatVisible = isItemVisibleOnWebsite(catData, websiteId);

        const catName = catData.name || catData.category || catData.id;
        const catSlug = catData.slug || catData.id;

        categoryVisibilityMap.set(catData.id, isCatVisible);
        categoryVisibilityMap.set(catSlug, isCatVisible);
        if (catName) {
          categoryVisibilityMap.set(catName.toLowerCase(), isCatVisible);
          categoryVisibilityMap.set(makeSlug(catName), isCatVisible);
        }

        if (!isCatVisible) continue; // Cascading hide

        if (!categoryTree.has(catSlug)) {
          categoryTree.set(catSlug, {
            id: catData.id,
            name: catName,
            category: catName,
            slug: catSlug,
            subcategories: new Map(),
          });
        }

        const subs = getCollectionFromSqlite(`companies/${companyId}/categories/${catData.id}/subcategories`);

        for (const subData of subs) {
          const isSubVisible = isCatVisible && isItemVisibleOnWebsite(subData, websiteId);

          const subName = subData.name || subData.subCategory || subData.id;
          const subSlug = subData.slug || subData.id;

          const subKey = `${catSlug}:::${subSlug}`;
          const subKeyId = `${catData.id}:::${subData.id}`;
          subcategoryVisibilityMap.set(subKey, isSubVisible);
          subcategoryVisibilityMap.set(subKeyId, isSubVisible);
          if (subName) {
            subcategoryVisibilityMap.set(`${catSlug}:::${subName.toLowerCase()}`, isSubVisible);
          }

          if (!isSubVisible) continue; // Cascading hide

          const catObj = categoryTree.get(catSlug);
          if (!catObj.subcategories.has(subSlug)) {
            catObj.subcategories.set(subSlug, {
              id: subData.id,
              name: subName,
              subCategory: subName,
              slug: subSlug,
              products: [],
            });
          }

          // Collect products embedded in subdoc and subcollection
          const allProds = Array.isArray(subData.products) ? [...subData.products] : [];
          const subColProds = getCollectionFromSqlite(
            `companies/${companyId}/categories/${catData.id}/subcategories/${subData.id}/products`
          );
          allProds.push(...subColProds);

          allProds.forEach((p, idx) => {
            if (!isItemVisibleOnWebsite(p, websiteId)) return;

            const norm = normalizeProduct(p, catName, subName, idx);
            if (!productsMap.has(norm.slug)) {
              productsMap.set(norm.slug, norm);
              catObj.subcategories.get(subSlug).products.push(norm);
            }
          });
        }
      }

      // -------------------------------------------------------------
      // Step 2: Fetch Company Master Products (Without Category & All Products)
      // -------------------------------------------------------------
      const masterProds = getCollectionFromSqlite(`companies/${companyId}/products`);

      masterProds.forEach((p, idx) => {
        // 1. Check Product-Level Visibility
        if (!isItemVisibleOnWebsite(p, websiteId)) {
          return;
        }

        const catName = p.category || (p.type === "normal" ? "Other Products" : "General");
        const subName = p.subCategory || p.subcategory || (catName === "Other Products" ? "Other Products" : "General");
        const catSlug = p.categoryId || makeSlug(catName);
        const subSlug = p.subcategoryId || makeSlug(subName);

        // 2. Check Category-Level Cascading Visibility
        if (p.categoryId || p.category) {
          const isCatAllowed =
            categoryVisibilityMap.get(p.categoryId) ??
            categoryVisibilityMap.get(catSlug) ??
            categoryVisibilityMap.get(catName.toLowerCase()) ??
            categoryVisibilityMap.get(makeSlug(catName));

          if (isCatAllowed === false) {
            return;
          }
        }

        // 3. Check Subcategory-Level Cascading Visibility
        if (p.subcategoryId || p.subCategory) {
          const subKey = `${catSlug}:::${subSlug}`;
          const subKeyId = `${p.categoryId}:::${p.subcategoryId}`;
          const isSubAllowed =
            subcategoryVisibilityMap.get(subKey) ??
            subcategoryVisibilityMap.get(subKeyId) ??
            subcategoryVisibilityMap.get(`${catSlug}:::${subName.toLowerCase()}`);

          if (isSubAllowed === false) {
            return;
          }
        }

        const norm = normalizeProduct(p, catName, subName, idx);

        if (!productsMap.has(norm.slug)) {
          productsMap.set(norm.slug, norm);

          if (!categoryTree.has(catSlug)) {
            categoryTree.set(catSlug, {
              id: p.categoryId || catSlug,
              name: catName,
              category: catName,
              slug: catSlug,
              subcategories: new Map(),
            });
          }

          const catObj = categoryTree.get(catSlug);
          if (!catObj.subcategories.has(subSlug)) {
            catObj.subcategories.set(subSlug, {
              id: p.subcategoryId || subSlug,
              name: subName,
              subCategory: subName,
              slug: subSlug,
              products: [],
            });
          }

          const subObj = catObj.subcategories.get(subSlug);
          if (!subObj.products.some((existing) => existing.slug === norm.slug)) {
            subObj.products.push(norm);
          }
        }
      });
    }

    // -------------------------------------------------------------
    // Step 3: Fetch Website-Specific Products Collection (if any)
    // -------------------------------------------------------------
    const webProds = getCollectionFromSqlite(`websites/${websiteId}/products`);

    webProds.forEach((p, idx) => {
      if (!isItemVisibleOnWebsite(p, websiteId)) return;

      const catName = p.category || "Other Products";
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
        const subObj = catObj.subcategories.get(subSlug);
        if (!subObj.products.some((existing) => existing.slug === norm.slug)) {
          subObj.products.push(norm);
        }
      }
    });
  } catch (err) {
    console.error("[SQLite] Master Catalog fetch error:", err.message);
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

  return {
    categoryList,
    categoryProducts: allProducts,
    totalCount: allProducts.length,
  };
}

/**
 * Fetch raw catalog from SQLite with strict cascading visibility and instant sync
 */
export async function fetchRawCatalogData(websiteId = WEBSITE_ID) {
  const isClient = typeof window !== "undefined";

  if (isClient) {
    try {
      const res = await fetch(`/api/catalog`, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "Pragma": "no-cache",
        },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          return {
            categoryList: json.categories || [],
            categoryProducts: json.products || [],
            totalCount: (json.products || []).length,
          };
        }
      }
    } catch (err) {
      console.error("Error fetching catalog from client API:", err.message);
    }
    return {
      categoryList: [],
      categoryProducts: [],
      totalCount: 0,
    };
  }

  // Server-side: Query SQLite database directly (instantly synchronized with SuperAdmin)
  const sqliteData = await fetchMasterCatalogFromSqlite(websiteId);
  return sqliteData;
}

export async function fetchFullCatalog() {
  const data = await fetchRawCatalogData();
  return data.categoryProducts || [];
}

export async function getCategoriesData() {
  const data = await fetchRawCatalogData();
  return {
    categoryList: data.categoryList,
    categoryProducts: data.categoryProducts,
  };
}

export async function getProductsData() {
  const data = await fetchRawCatalogData();
  return data.categoryProducts || [];
}

export async function getProductBySlug(slug) {
  if (!slug) return null;
  const targetSlug = String(slug).toLowerCase().trim();
  const data = await fetchRawCatalogData();
  return (
    data.categoryProducts.find(
      (p) =>
        p.slug.toLowerCase() === targetSlug ||
        String(p.id).toLowerCase() === targetSlug ||
        String(p.productId).toLowerCase() === targetSlug ||
        String(p.categoryProductId).toLowerCase() === targetSlug
    ) || null
  );
}

export async function getHomeData() {
  return fetchSiteDataFromAdmin("home");
}

export async function getServicesData() {
  return fetchSiteDataFromAdmin("services");
}

export async function getContactData() {
  return fetchSiteDataFromAdmin("contact");
}

export async function getAboutData() {
  return fetchSiteDataFromAdmin("about");
}

export async function getDistrictsData() {
  const data = await fetchSiteDataFromAdmin("districts");
  if (Array.isArray(data)) return data;
  if (data?.districts && Array.isArray(data.districts)) return data.districts;
  return [];
}

export async function getDistrictData(districtSlug) {
  if (!districtSlug || districtSlug.toLowerCase() === "jaipur") {
    return null;
  }
  const districts = await getDistrictsData();
  const found = districts.find(
    (d) =>
      d.slug === districtSlug ||
      d.id === districtSlug ||
      (d.district && makeSlug(d.district) === districtSlug)
  );
  if (found) return found;
  return fetchSiteDataFromAdmin(`district-${districtSlug}`);
}

export async function submitContactQuery(formData) {
  const isClient = typeof window !== "undefined";
  const url = isClient ? "/api/contact-query" : `${ADMIN_API_BASE_URL}/api/contact-query`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        websiteId: WEBSITE_ID,
      }),
    });
    return res;
  } catch (err) {
    console.error("submitContactQuery error:", err);
    throw err;
  }
}

export async function submitProductQuery(formData) {
  const isClient = typeof window !== "undefined";
  const url = isClient ? "/api/product-query" : `${ADMIN_API_BASE_URL}/api/product-query`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        websiteId: WEBSITE_ID,
      }),
    });
    return res;
  } catch (err) {
    console.error("submitProductQuery error:", err);
    throw err;
  }
}
