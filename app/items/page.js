import { fetchFullCatalog } from "@/lib/db-server";
import ProductsClient from "./ProductsClient";
import { Suspense } from "react";
import Loader from "@/components/Loader";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProductsPage({ district = null, city = null }) {
  const allProducts = await fetchFullCatalog();

  return (
    <Suspense fallback={<Loader />}>
      <ProductsClient
        initialProducts={allProducts}
        district={district}
        city={city}
      />
    </Suspense>
  );
}