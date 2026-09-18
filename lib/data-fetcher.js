import {
  fetchFullCatalog as fetchFullCatalogServer,
  getCategoriesData,
  getProductsData,
  getProductBySlug,
  fetchDocCached,
  getHomeData,
  getServicesData,
  getContactData,
  getDistrictData,
  normalizeProduct,
  isVisibleOnWebsite,
  WEBSITE_ID,
} from "./db-server.js";

export {
  getCategoriesData,
  getProductsData,
  getProductBySlug,
  fetchDocCached,
  getHomeData,
  getServicesData,
  getContactData,
  getDistrictData,
  normalizeProduct,
  isVisibleOnWebsite,
  WEBSITE_ID,
};

/**
 * Fetch full products catalog
 */
export async function fetchFullCatalog() {
  return fetchFullCatalogServer();
}

/**
 * Legacy alias helpers
 */
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
