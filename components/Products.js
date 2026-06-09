"use client";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

import { useEffect, useState } from "react";

import { db } from "@/firebase";

import {
  doc,
  getDoc,
} from "firebase/firestore";

export default function Products({ city,
  district, }) {

  const [products, setProducts] = useState([]);

  const [loading, setLoading] =
    useState(true);
  const pathname = usePathname();

  const pathParts = pathname.split("/");

  const slug = pathParts[1];

  const basePath =
    slug &&
      !["about", "items", "services", "contact"].includes(slug)
      ? `/${slug}`
      : "";
  // FETCH PRODUCTS
  useEffect(() => {

    const fetchProducts = async () => {

      try {

        const snap = await getDoc(
          doc(
            db,
            "websites",
            "humanbiomedicalsorg",
            "pages",
            "products"
          )
        );

        if (snap.exists()) {

          const data =
            snap.data().products || [];

          const publishedProducts =
            data.filter(
              (item) => item.isPublished
            );

          setProducts(
            publishedProducts.slice(0, 3)
          );

        }

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

      }

    };

    fetchProducts();

  }, []);

  if (loading) return null;

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
            hospital devices, and diagnostic systems by Human Biomedicals LLP.
          </p>

        </div>

        {/* Product Grid */}
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {products.map((product, index) => (

            <motion.div
              key={product.id || index}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
              }}
              viewport={{ once: true }}
              className="glass rounded-[32px] overflow-hidden shadow-xl hover:-translate-y-2 transition duration-300"
            >

              {/* Product Image */}
              <div className="overflow-hidden">

                <img
                  src={
                    product.image ||
                    "/placeholder.jpg"
                  }
                  alt={product.title}
                  className="w-full h-[260px] object-cover hover:scale-105 transition duration-500"
                />

              </div>

              {/* Content */}
              <div className="p-7">

                {/* Product Name */}
                <h3 className="text-2xl font-bold text-slate-900">
                  {product.title}
                </h3>

                {/* Instrument */}
                <p className="mt-2 text-slate-500">
                  {product.instrument ||
                    "Medical Equipment"}
                </p>

                {/* Button */}
                <Link href={`${basePath}/items`}
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