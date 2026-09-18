"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchFullCatalog } from "@/lib/data-fetcher";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Products({ city, district }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const pathParts = pathname.split("/");
  const slug = pathParts[1];

  const basePath =
    slug && !["about", "items", "services", "contact"].includes(slug)
      ? `/${slug}`
      : "";

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setLoading(true);
        const catalog = await fetchFullCatalog();

        if (catalog && catalog.length > 0) {
          // Take top 6 published products
          const published = catalog
            .filter((item) => item.isPublished !== false)
            .slice(0, 6);
          setProducts(published);
        }
      } catch (err) {
        console.error("Error fetching featured products for home:", err);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden bg-slate-50/60">
      {/* Background Blur Accents */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-violet-200/40 blur-3xl rounded-full pointer-events-none"></div>
      <div className="absolute bottom-10 left-0 w-80 h-80 bg-sky-200/40 blur-3xl rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex
             items-center gap-2 bg-violet-100 text-violet-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles size={14} /> Featured Medical Equipment
            </span>

            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
              Laboratory & Diagnostic Systems
            </h2>

            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Explore advanced healthcare equipment, pathology analyzers, diagnostic instruments, and hospital solutions from Human Biomedicals LLP.
            </p>
          </div>

          <Link
            href={`${basePath}/items`}
            className="inline-flex items-center gap-2 text-violet-700 hover:text-violet-800 font-bold text-base group shrink-0"
          >
            Browse Full Catalog
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="mt-12 sm:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {loading ? (
            // Skeleton Loader
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-[28px] border border-slate-200 p-5 animate-pulse">
                <div className="h-52 bg-slate-100 rounded-2xl mb-5" />
                <div className="h-6 bg-slate-200 rounded-lg w-3/4 mb-3" />
                <div className="h-4 bg-slate-100 rounded-lg w-1/2 mb-5" />
                <div className="h-10 bg-slate-200 rounded-xl w-full" />
              </div>
            ))
          ) : (
            products.map((product, index) => (
              <motion.div
                key={product.uid ? `${product.uid}-${index}` : `${product.id || product.slug || "featured"}-${index}`}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-[28px] border border-slate-200/90 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Image Container */}
                <div className="relative h-56 bg-slate-50 p-6 overflow-hidden flex items-center justify-center border-b border-slate-100">
                  <img
                    src={product.images?.[0] || product.image || "/placeholder.jpg"}
                    alt={product.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.jpg";
                    }}
                  />
                  {product.category && (
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-700 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                      {product.category}
                    </span>
                  )}
                </div>

                {/* Content Details */}
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-violet-700 transition line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 line-clamp-2 leading-relaxed">
                      {product.desc || product.description || "High-precision diagnostic and biomedical equipment for laboratory applications."}
                    </p>
                  </div>

                  {/* Product Specs Pill */}
                  <div className="mt-5 grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 font-medium block">Brand</span>
                      <span className="font-bold text-slate-800 line-clamp-1">{product.brand || "Human Biomedicals"}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Instrument</span>
                      <span className="font-bold text-slate-800 line-clamp-1">{product.instrument || "Automatic"}</span>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <Link
                    href={`${basePath}/items/${product.slug}`}
                    className="mt-6 w-full text-center bg-gradient-to-r from-violet-600 to-sky-600 hover:from-violet-700 hover:to-sky-700 text-white font-semibold py-3 px-5 rounded-xl shadow-md hover:shadow-lg transition duration-200 flex items-center justify-center gap-2 text-sm"
                  >
                    View Product Details
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Bottom CTA Bar */}
        <div className="mt-16 text-center">
          <Link
            href={`${basePath}/items`}
            className="inline-flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-full font-bold shadow-xl hover:scale-105 transition duration-300 text-base"
          >
            Explore All Medical & Diagnostic Products
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </section>
  );
}