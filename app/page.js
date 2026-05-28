import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Products from "@/components/Products";
import Testimonials from "@/components/Testimonials";

export default function HomePage({
  city = "India",
}) {

  return (
    <main>

      <Hero city={city} />

      <Features city={city} />

      <Products city={city} />

      <Testimonials city={city} />

    </main>
  );
}