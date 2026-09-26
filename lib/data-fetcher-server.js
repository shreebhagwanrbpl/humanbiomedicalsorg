import {
  fetchFullCatalog as fetchFullCatalogDb,
  getCategoriesData as getCategoriesDataDb,
  getProductsData as getProductsDataDb,
  getProductBySlug as getProductBySlugDb,
} from "./admin-api.js";

export const fetchFullCatalog = fetchFullCatalogDb;
export const getCategoriesData = getCategoriesDataDb;
export const getProductsData = getProductsDataDb;
export const getProductBySlug = getProductBySlugDb;
