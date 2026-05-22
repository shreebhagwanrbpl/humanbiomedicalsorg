"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Loader from "./Loader";
const products = [
  {
    image:
      "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=1200&auto=format&fit=crop",
    name: "Biochemistry Analyzer",
    brand: "Rajbiosis Pvt Ltd",
  },
  {
    image:
      "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1200&auto=format&fit=crop",
    name: "Digital X-Ray Machine",
    brand: "Rajbiosis Pvt Ltd",
  },
  {
    image:
      "https://images.unsplash.com/photo-1581595219315-a187dd40c322?q=80&w=1200&auto=format&fit=crop",
    name: "Laboratory Microscope",
    brand: "Rajbiosis Pvt Ltd",
  },
];

export default function Products() {
  if (!products?.length) return <Loader />;
  return (
    <section className="relative py-24 overflow-hidden">

      {/* Background Blur */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-violet-200/40 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-sky-200/40 blur-3xl rounded-full"></div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">

        {/* Heading */}
        <div className="max-w-3xl">
          <span className="glass px-5 py-2 rounded-full text-sm font-medium text-slate-700 inline-block">
            Our Premium Products
          </span>

          <h2 className="mt-8 text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
            Laboratory & Hospital Equipment
          </h2>

          <p className="mt-6 text-lg text-slate-600 leading-8">
            Explore advanced healthcare equipment, laboratory instruments,
            hospital devices, and diagnostic systems by Rajbiosis Pvt Ltd.
          </p>
        </div>

        {/* Product Grid */}
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="glass rounded-[32px] overflow-hidden shadow-xl hover:-translate-y-2 transition duration-300"
            >

              {/* Product Image */}
              <div className="overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-[260px] object-cover hover:scale-105 transition duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-7">

                {/* Product Name */}
                <h3 className="text-2xl font-bold text-slate-900">
                  {product.name}
                </h3>

                {/* Brand */}
                <p className="mt-2 text-slate-500">
                  Brand: {product.brand}
                </p>

                {/* Button */}
                <Link
                  href="/products"
                  className="mt-6 inline-flex items-center justify-center bg-gradient-to-r from-violet-600 to-sky-500 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition duration-300"
                >
                  View Product
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}