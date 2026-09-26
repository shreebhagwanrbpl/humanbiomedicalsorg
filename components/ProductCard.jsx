import React from "react";
import Link from "next/link";
import { getProductMainImage, resolveImageUrl } from "@/lib/generateBrochurePDF";

const ProductCard = React.memo(function ProductCard({ product, district }) {
  const mainImage = resolveImageUrl(product.images?.[0]) || resolveImageUrl(product.image) || getProductMainImage(product);

  return (
    <div
      id={product.slug}
      className="bg-white rounded-[30px] border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 p-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_180px] gap-5 lg:gap-8 items-center">
        {/* Image */}
        <div className="relative h-[180px] sm:h-[220px] rounded-2xl lg:rounded-3xl overflow-hidden bg-slate-100 flex items-center justify-center p-4">
          <img
            src={mainImage}
            alt={product.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80";
            }}
          />
        </div>

        {/* Content */}
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {(product.categoryProductId || product.productId) && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-100">
                ID: {product.categoryProductId || product.productId}
              </span>
            )}
            {product.category && product.category !== "Other Products" && (
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
                {product.category} {product.subCategory && product.subCategory !== product.category ? `› ${product.subCategory}` : ""}
              </span>
            )}
          </div>

          <h3 className="text-2xl font-bold text-slate-900 hover:text-sky-700 transition">
            <Link
              href={
                district
                  ? `/${district}/items/${product.slug}`
                  : `/items/${product.slug}`
              }
            >
              {product.title}
            </Link>
          </h3>

          <p className="mt-3 text-slate-600 leading-7 line-clamp-2">
            {product.description ||
              product.desc ||
              "Premium biomedical equipment designed for laboratories, hospitals and diagnostic centres."}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
            <div className="bg-slate-50 rounded-xl p-2.5">
              <p className="text-[10px] uppercase font-bold text-slate-400">Brand</p>
              <p className="font-semibold text-xs text-slate-800 mt-0.5 truncate">{product.brand || "Human Biomedicals"}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-2.5">
              <p className="text-[10px] uppercase font-bold text-slate-400">Model</p>
              <p className="font-semibold text-xs text-slate-800 mt-0.5 truncate">{product.model || "Standard"}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-2.5">
              <p className="text-[10px] uppercase font-bold text-slate-400">Instrument</p>
              <p className="font-semibold text-xs text-slate-800 mt-0.5 truncate">{product.instrument || "Diagnostic"}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-2.5">
              <p className="text-[10px] uppercase font-bold text-slate-400">Automation</p>
              <p className="font-semibold text-xs text-slate-800 mt-0.5 truncate">{product.automation || product.capacity || "Available"}</p>
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="flex justify-center lg:justify-end">
          <Link
            href={
              district
                ? `/${district}/items/${product.slug}`
                : `/items/${product.slug}`
            }
            className="px-8 py-4 rounded-2xl bg-sky-700 !text-white font-semibold hover:bg-sky-800 transition shadow-md hover:shadow-lg text-center w-full sm:w-auto"
          >
            Get Quote
          </Link>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
