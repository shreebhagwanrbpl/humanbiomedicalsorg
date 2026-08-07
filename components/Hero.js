"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { db } from "@/lib/firebase";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { motion } from "framer-motion";
import Link from "next/link";
import Loader from "./Loader";

export default function Hero({
  city,
  district,
}) {

  const [data, setData] = useState(null);
  const pathname = usePathname();
  const pathParts = pathname.split("/");
  const slug = pathParts[1];

  const basePath =
    slug &&
      !["about", "items", "services", "contact"].includes(slug)
      ? `/${slug}`
      : "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snap = await getDoc(
          doc(
            db,
            "websites",
            "humanbiomedicalsorg",
            "pages",
            "home"
          )
        );

        if (snap.exists()) {
          setData(snap.data());
        }
      } catch (err) {
        console.error("Error fetching hero home data:", err);
      }
    };

    fetchData();
  }, []);

  const displayCity = city || "India";

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center bg-gradient-to-b from-slate-50 via-white to-sky-50/40">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalEquipmentSupplier",
            name: "Human Biomedicals",
            url: "https://humanbiomedicals.org",
            areaServed: displayCity,
            description: `Biomedical, pathology and hospital equipment supplier in ${displayCity}`,
            address: {
              "@type": "PostalAddress",
              addressLocality: displayCity,
              addressCountry: "India"
            }
          })
        }}
      />

      {/* Background Decorative Blurs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-violet-400/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/2 right-0 w-[30rem] h-[30rem] bg-sky-400/20 blur-[140px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-16 sm:py-24 relative z-10">

        {/* LEFT CONTENT */}
        <div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-100 to-sky-100 border border-violet-200/60 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-violet-900 shadow-sm mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse"></span>
            Trusted Laboratory & Hospital Equipment Supplier in {displayCity}
          </motion.div>

          {/* Single Clean Title */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] text-slate-900 tracking-tight"
          >
            {data?.title ? (
              data.title.replaceAll("{city}", displayCity)
            ) : (
              <>
                Buy Biomedical Equipment in <span className="text-slate-900">{displayCity}</span>
              </>
            )}
            <span className="block mt-3 bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
              Pathology, Laboratory & Hospital Equipment Supplier
            </span>
          </motion.h1>

          {/* Single Clean Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="mt-6 text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl font-normal"
          >
            {data?.description ? (
              data.description.replaceAll("{city}", displayCity)
            ) : (
              `Leading biomedical equipment supplier in ${displayCity}, offering high-precision pathology lab instruments, clinical chemistry analyzers, hospital equipment, ICU systems, and diagnostic medical solutions.`
            )}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-5"
          >
            <Link
              href={`${basePath}/items`}
              className="bg-gradient-to-r from-violet-600 to-sky-500 hover:from-violet-700 hover:to-sky-600 text-white px-8 py-4 rounded-full font-bold text-center shadow-xl hover:shadow-2xl hover:scale-[1.03] transition duration-300 text-base"
            >
              {data?.button1Text || "Explore Equipment Catalog"}
            </Link>

            <Link
              href={`${basePath}/contact`}
              className="bg-white border border-slate-300 hover:border-violet-500 text-slate-800 hover:text-violet-600 px-8 py-4 rounded-full font-bold text-center hover:bg-slate-50 transition duration-300 text-base shadow-sm"
            >
              {data?.button2Text || "Contact Our Team"}
            </Link>
          </motion.div>

          {/* Key Stats Grid */}
          <div className="mt-14 pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-6 sm:gap-8">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                500+
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                Equipment Deliveries
              </p>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                100+
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                Hospitals Served
              </p>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                24/7
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                Technical Support
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT HERO IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9 }}
          className="relative"
        >
          <div className="relative rounded-[36px] p-3 sm:p-4 bg-gradient-to-tr from-violet-200 via-sky-100 to-white shadow-2xl border border-slate-200/80">
            <img
              src="https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200&q=80"
              alt={`Biomedical laboratory and hospital equipment supplier in ${displayCity}`}
              loading="eager"
              width="1200"
              height="800"
              className="w-full h-[320px] sm:h-[420px] lg:h-[520px] object-cover rounded-[28px] shadow-inner"
            />

            {/* Floating Quality Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-xl">
                ✓
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quality Assured</p>
                <p className="text-sm font-extrabold text-slate-900">ISO Certified Products</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

    </section>
  );
}