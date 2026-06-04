"use client";

import { useEffect, useState } from "react";

import { db } from "@/firebase";

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

  const [data, setData] =
    useState(null);

    
  useEffect(() => {
    const fetchData =
      async () => {

        const snap =
          await getDoc(
            doc(
              db,
              "websites",
              "humanbiomedicalsorg",
              "pages",
              "home"
            )
          );

        if (snap.exists()) {

          setData(
            snap.data()
          );

        }

      };

    fetchData();

  }, []);

  if (!data)
    return <Loader />;
  const basePath =
    district
      ? `/${district}`
      : "";
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">

      <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context":
        "https://schema.org",
      "@type":
        "MedicalEquipmentSupplier",
      name:
        "Human Biomedicals",
      url:
        "https://humanbiomedicals.org",
      areaServed:
        city,
      description:
        `Biomedical, pathology and hospital equipment supplier in ${city}`,
      address: {
        "@type":
          "PostalAddress",
        addressLocality:
          city,
        addressCountry:
          "India"
      }
    })
  }}
/>
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-violet-300/30 blur-3xl rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-72 h-72 bg-sky-300/30 blur-3xl rounded-full"></div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center py-24 relative z-10">

        {/* LEFT CONTENT */}
        <div>

          {/* Badge */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            className="inline-flex items-center glass px-5 py-2 rounded-full text-sm font-medium text-slate-700 mb-8"
          >
            Trusted Laboratory &
            Hospital Equipment
            Supplier in {city}
          </motion.div>

          {/* Heading */}
     <motion.h1
        initial={{
          opacity: 0,
          y: 35,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
        }}
        className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight text-slate-900"
      >
        Buy Biomedical Equipment in {city}
      <span className="block text-violet-600">
        Pathology, Laboratory & Hospital Equipment Supplier
      </span>
      </motion.h1>

          {/* SEO Content */}
          <motion.p
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1,
            }}
            className="mt-8 text-lg sm:text-xl text-slate-600 leading-9 max-w-2xl"
          >
            Leading biomedical equipment supplier in {city},
            offering pathology lab equipment,
            hospital machines,
            diagnostic instruments,
            ICU equipment,
            OT setup,
            laboratory solutions,
            and medical devices.


            {" "}

            Trusted pathology,
            laboratory and hospital
            equipment supplier in {city}.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1.2,
            }}
            className="mt-12 flex flex-col sm:flex-row gap-5"
          >

            <Link
              href={`${basePath}/items`}
              className="bg-gradient-to-r from-violet-600 to-sky-500 text-white px-8 py-4 rounded-full font-semibold text-center shadow-xl hover:scale-105 transition duration-300"
            >
              {data?.button1Text}
            </Link>

            <Link
              href={`${basePath}/contact`}
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
                Medical Equipment
                Deliveries
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
          initial={{
            opacity: 0,
            scale: 0.92,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 1,
          }}
          className="relative"
        >

          <div className="glass rounded-[40px] p-5 shadow-2xl">
            <img
              src="/images/biomedical-equipment.webp"
              alt={`Biomedical laboratory and hospital equipment supplier in ${city}`}
              loading="lazy"
              width="1200"
              height="800"
              className="w-full h-[350px] sm:h-[450px] lg:h-[600px] object-cover rounded-[30px]"
            />

          </div>

        </motion.div>

      </div>

    </section>
  );
}