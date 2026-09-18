import { fetchFullCatalog } from "@/lib/db-server";
import ProductsClient from "./ProductsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProductsPage({ district = null, city = null }) {
  const allProducts = await fetchFullCatalog();

  return (
    <ProductsClient
      initialProducts={allProducts}
      district={district}
      city={city}
    />
  );
}