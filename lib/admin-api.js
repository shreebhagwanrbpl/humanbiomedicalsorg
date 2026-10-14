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

import {
  getSiteDataFromMongo,
  getMasterCatalogFromMongo,
  getProductBySlugFromMongo,
  insertQueryToMongo,
} from "./mongodb.js";

/**
 * Fetch raw site-data for a specific page/type from MongoDB directly or client API
 */
export async function fetchSiteDataFromAdmin(type = "all", websiteId = WEBSITE_ID) {
  try {
    const isClient = typeof window !== "undefined";

    // 1. Server-side: Query MongoDB directly (fast in-memory cached)
    if (!isClient) {
      const data = await getSiteDataFromMongo(type, websiteId);
      if (data) return data;
    }

    // 2. Client-side or Fallback via HTTP API
    const companyId = detectCompanyId(websiteId);
    const url = isClient
      ? `/api/site-data?websiteId=${encodeURIComponent(websiteId)}&type=${encodeURIComponent(type)}`
      : `${ADMIN_API_BASE_URL}/api/site-data?websiteId=${encodeURIComponent(websiteId)}&companyId=${encodeURIComponent(companyId)}&type=${encodeURIComponent(type)}`;

    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
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

/**
 * Fetch raw catalog from MongoDB with cascading visibility and instant caching
 */
export async function fetchRawCatalogData(websiteId = WEBSITE_ID) {
  const isClient = typeof window !== "undefined";

  if (isClient) {
    try {
      const res = await fetch(`/api/catalog?websiteId=${encodeURIComponent(websiteId)}`, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
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

  // Server-side: Query MongoDB database directly
  return await getMasterCatalogFromMongo(websiteId);
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
  const isClient = typeof window !== "undefined";
  if (!isClient) {
    return await getProductBySlugFromMongo(slug, WEBSITE_ID);
  }
  const data = await fetchRawCatalogData();
  const targetSlug = String(slug).toLowerCase().trim();
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
  const found = (districts || []).find(
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
