"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

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
    let isMounted = true;
    const fetchData = async () => {
      try {
        const res = await fetch("/api/site-data?type=home", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate",
            "Pragma": "no-cache",
          },
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && isMounted) {
            setData(json.data);
          }
        }
      } catch (err) {
        console.error("Error fetching hero home data:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    window.addEventListener("focus", fetchData);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener("focus", fetchData);
    };
  }, []);

  const displayCity = city || "India";

  const btn1Text =
    data?.button1Text ||
    data?.buttonText1 ||
    data?.btn1Text ||
    data?.btnText1 ||
    data?.buttonText ||
    data?.btnText ||
    data?.primaryButtonText ||
    data?.btnPrimaryText ||
    (typeof data?.button1 === "string" ? data.button1 : data?.button1?.text) ||
    "";

  const btn2Text =
    data?.button2Text ||
    data?.buttonText2 ||
    data?.btn2Text ||
    data?.btnText2 ||
    data?.secondaryButtonText ||
    data?.btnSecondaryText ||
    (typeof data?.button2 === "string" ? data.button2 : data?.button2?.text) ||
    "";

  return (
    <section className="relative overflow-hidden flex items-center bg-gradient-to-b from-slate-50 via-white to-sky-50/40">

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
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-violet-400/20 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-sky-400/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center py-10 sm:py-16 relative z-10">

        {/* LEFT CONTENT */}
        <div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-100 to-sky-100 border border-violet-200/60 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-violet-900 shadow-sm mb-5"
          >
            <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse"></span>
            Trusted Laboratory & Hospital Equipment Supplier in {displayCity}
          </motion.div>

          {/* Dynamic Title (No Static Fallback Text) */}
          {data?.title && (
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.2] text-slate-900 tracking-tight"
            >
              {data.title.replaceAll("{city}", displayCity)}
            </motion.h1>
          )}

          {/* Dynamic Description (No Static Fallback Text) */}
          {data?.description && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal"
            >
              {data.description.replaceAll("{city}", displayCity)}
            </motion.p>
          )}

          {/* Action Buttons (Static Links, 100% Dynamic Text from Admin) */}
          {(btn1Text || btn2Text) && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0 }}
              className="mt-8 flex flex-col sm:flex-row gap-4"
            >
              {btn1Text && (
                <Link
                  href={`${basePath}/items`}
                  className="bg-gradient-to-r from-violet-600 to-sky-500 hover:from-violet-700 hover:to-sky-600 text-white px-7 py-3.5 rounded-full font-bold text-center shadow-lg hover:shadow-xl hover:scale-[1.02] transition duration-300 text-sm sm:text-base"
                >
                  {btn1Text}
                </Link>
              )}

              {btn2Text && (
                <Link
                  href={`${basePath}/contact`}
                  className="bg-white border border-slate-300 hover:border-violet-500 text-slate-800 hover:text-violet-600 px-7 py-3.5 rounded-full font-bold text-center hover:bg-slate-50 transition duration-300 text-sm sm:text-base shadow-sm"
                >
                  {btn2Text}
                </Link>
              )}
            </motion.div>
          )}

          {/* Key Stats Grid */}
          <div className="mt-10 pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-5 sm:gap-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                500+
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 font-medium">
                Equipment Deliveries
              </p>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                100+
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 font-medium">
                Hospitals Served
              </p>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                24/7
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 font-medium">
                Technical Support
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT HERO IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="relative rounded-[28px] p-3 sm:p-3.5 bg-gradient-to-tr from-violet-200 via-sky-100 to-white shadow-xl border border-slate-200/80">
            <img
              src={data?.image || data?.imageUrl || "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200&q=80"}
              alt={`Biomedical laboratory and hospital equipment supplier in ${displayCity}`}
              loading="eager"
              width="1200"
              height="800"
              className="w-full h-[260px] sm:h-[340px] lg:h-[400px] object-cover rounded-[22px] shadow-inner"
            />

            {/* Floating Quality Badge */}
            <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-lg">
                ✓
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quality Assured</p>
                <p className="text-xs sm:text-sm font-extrabold text-slate-900">ISO Certified Products</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

    </section>
  );
}