export const dynamic = "force-dynamic";
export const revalidate = 0;

import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Products from "@/components/Products";
import Testimonials from "@/components/Testimonials";
import { getHomeData, getServicesData, getProductsData } from "@/lib/admin-api";

export default async function HomePage({
  city = "India",
  district = null,
}) {
  const [homeData, servicesData, productsData] = await Promise.all([
    getHomeData().catch(() => null),
    getServicesData().catch(() => null),
    getProductsData().catch(() => []),
  ]);

  return (
    <main>
      <Hero city={city} district={district} initialData={homeData} />
      <Features city={city} initialServices={servicesData?.services || (Array.isArray(servicesData) ? servicesData : null)} />
      <Products city={city} district={district} initialProducts={productsData} />
      <Testimonials city={city} />
    </main>
  );
}
