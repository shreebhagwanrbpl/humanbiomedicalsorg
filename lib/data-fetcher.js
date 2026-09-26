import {
  normalizeProduct,
  isVisibleOnWebsite,
  isItemVisibleOnWebsite,
  WEBSITE_ID,
  normalizeDomainId,
  detectCompanyId,
  PRIMARY_COMPANY,
  ALL_COMPANIES,
  makeSlug,
  ADMIN_API_BASE_URL,
} from "./catalog-utils.js";

export {
  normalizeProduct,
  isVisibleOnWebsite,
  isItemVisibleOnWebsite,
  WEBSITE_ID,
  normalizeDomainId,
  detectCompanyId,
  PRIMARY_COMPANY,
  ALL_COMPANIES,
  makeSlug,
  ADMIN_API_BASE_URL,
};

/**
 * Client-safe catalog fetcher
 */
export async function fetchFullCatalog() {
  try {
    const isClient = typeof window !== "undefined";
    const url = isClient ? "/api/catalog" : `${ADMIN_API_BASE_URL}/api/catalog?websiteId=${WEBSITE_ID}`;
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Pragma": "no-cache",
      },
    });
    if (res.ok) {
      const json = await res.json();
      return json.products || [];
    }
  } catch (err) {
    console.error("fetchFullCatalog client error:", err);
  }
  return [];
}

export async function getProductsData() {
  return fetchFullCatalog();
}

export async function getCategoriesData() {
  try {
    const isClient = typeof window !== "undefined";
    const url = isClient ? "/api/catalog" : `${ADMIN_API_BASE_URL}/api/catalog?websiteId=${WEBSITE_ID}`;
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Pragma": "no-cache",
      },
    });
    if (res.ok) {
      const json = await res.json();
      return {
        categoryList: json.categories || [],
        categoryProducts: json.products || [],
      };
    }
  } catch (err) {
    console.error("getCategoriesData client error:", err);
  }
  return { categoryList: [], categoryProducts: [] };
}

export async function getProductBySlug(slug) {
  const products = await fetchFullCatalog();
  const target = String(slug || "").toLowerCase().trim();
  return (
    products.find(
      (p) =>
        p.slug.toLowerCase() === target ||
        String(p.id).toLowerCase() === target ||
        String(p.productId).toLowerCase() === target ||
        String(p.categoryProductId).toLowerCase() === target
    ) || null
  );
}

export async function fetchSiteData(type = "all") {
  try {
    const isClient = typeof window !== "undefined";
    const url = isClient
      ? `/api/site-data?type=${encodeURIComponent(type)}`
      : `${ADMIN_API_BASE_URL}/api/site-data?websiteId=${WEBSITE_ID}&type=${encodeURIComponent(type)}`;
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Pragma": "no-cache",
      },
    });
    if (res.ok) {
      const json = await res.json();
      return json.data || null;
    }
  } catch (err) {
    console.error(`fetchSiteData error for ${type}:`, err);
  }
  return null;
}

export async function getHomeData() {
  return fetchSiteData("home");
}

export async function getServicesData() {
  return fetchSiteData("services");
}

export async function getContactData() {
  return fetchSiteData("contact");
}

export async function getAboutData() {
  return fetchSiteData("about");
}

export async function getDistrictsData() {
  const data = await fetchSiteData("districts");
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
  return fetchSiteData(`district-${districtSlug}`);
}

export async function fetchHomeData() {
  return getHomeData();
}

export async function fetchContactData() {
  return getContactData();
}

export async function fetchServicesData() {
  return getServicesData();
}

export async function fetchDistrictData(district) {
  return getDistrictData(district);
}
