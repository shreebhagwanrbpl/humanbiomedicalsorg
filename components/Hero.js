"use client";
import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import Link from "next/link";
import Loader from "./Loader";
export default function Hero() {

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDoc(
        doc(db, "websites", "humanbiomedicalsorg", "pages", "home")
      );

      if (snap.exists()) {
        setData(snap.data());
      }
    };

    fetchData();
  }, []);
  if (!data) return <Loader />;
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">

      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-violet-300/30 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-sky-300/30 blur-3xl rounded-full"></div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center py-24 relative z-10">

        {/* LEFT CONTENT */}
        <div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center glass px-5 py-2 rounded-full text-sm font-medium text-slate-700 mb-8"
          >
            Trusted Laboratory & Hospital Equipment Supplier
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight text-slate-900"
          >
            {/* Advanced Laboratory & Hospital Equipment Solutions */}
            {data?.title}
          </motion.h1>

          {/* SEO Content */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mt-8 text-lg sm:text-xl text-slate-600 leading-9 max-w-2xl"
          >
            {/* Rajbiosis Pvt Ltd delivers premium laboratory instruments,
            hospital machines, diagnostic systems, pathology equipment,
            healthcare devices, and medical technology solutions for
            hospitals, laboratories, research centers, and healthcare
            institutions across India. */}
            {data?.description}
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="mt-12 flex flex-col sm:flex-row gap-5"
          >
            <Link
              href="/products"
              className="bg-gradient-to-r from-violet-600 to-sky-500 text-white px-8 py-4 rounded-full font-semibold text-center shadow-xl hover:scale-105 transition duration-300"
            >
              {data?.button1Text}
            </Link>

            <Link
              href="/contact"
              className="glass border border-slate-200 px-8 py-4 rounded-full font-semibold text-slate-800 text-center hover:border-violet-400 transition duration-300"
            >
              {data?.button2Text}
            </Link>
          </motion.div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-3xl font-bold text-slate-900">
                500+
              </h3>
              <p className="text-slate-600 mt-2">
                Medical Equipment Deliveries
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-slate-900">
                100+
              </h3>
              <p className="text-slate-600 mt-2">
                Hospitals Served
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-slate-900">
                24/7
              </h3>
              <p className="text-slate-600 mt-2">
                Technical Support
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <div className="glass rounded-[40px] p-5 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop"
              alt="Advanced laboratory and hospital equipment by Rajbiosis Pvt Ltd"
              className="w-full h-[350px] sm:h-[450px] lg:h-[600px] object-cover rounded-[30px]"
            />
          </div>

          {/* Floating Card */}
          <div className="absolute -bottom-6 sm:-bottom-8 left-4 sm:-left-8 glass p-5 sm:p-6 rounded-3xl shadow-xl max-w-xs">
            <h4 className="text-lg sm:text-xl font-bold text-slate-900">
              Premium Healthcare Technology
            </h4>

            <p className="mt-3 text-slate-600 leading-7 text-sm sm:text-base">
              Trusted supplier of laboratory machines, diagnostic systems,
              pathology devices, and hospital equipment solutions.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}