"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Activity,
  Truck,
  Wrench,
  Sparkles,
  CheckCircle2,
  FileText,
  PhoneCall,
} from "lucide-react";

export default function Hero({
  city,
  district,
  initialData = null,
}) {
  const [data] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const pathParts = pathname.split("/");
  const slug = pathParts[1];

  const basePath =
    slug && !["about", "items", "services", "contact"].includes(slug)
      ? `/${slug}`
      : "";

  const displayCity = city || "India";

  const rawTitle =
    data?.title ||
    "Cutting-Edge Biomedical Technology, Laboratory Instrumentation & Clinical Supplies";
  const displayTitle = rawTitle.replaceAll("{city}", displayCity);

  const rawDesc =
    data?.description ||
    "Setting benchmarks in clinical diagnostic precision. Human Biomedicals supplies top-tier laboratory automation, multi-parameter testing platforms, clinical reagents, and end-to-end biomedical engineering services.";
  const displayDesc = rawDesc.replaceAll("{city}", displayCity);

  const btn1Text =
    data?.button1Text ||
    data?.buttonText1 ||
    data?.btn1Text ||
    data?.primaryButtonText ||
    "Explore Instruments";

  const btn2Text =
    data?.button2Text ||
    data?.buttonText2 ||
    data?.btn2Text ||
    data?.secondaryButtonText ||
    "Request Technical Consultation";

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`${basePath}/items?search=${encodeURIComponent(q)}`);
    } else {
      router.push(`${basePath}/items`);
    }
  };

  const quickCategories = [
    { label: "Test Strips", query: "test strips" },
    { label: "Biochemistry", query: "biochemistry" },
    { label: "Hematology / CBC", query: "hematology" },
    { label: "Diagnostic Analyzers", query: "analyzer" },
    { label: "Sterilization & Lab Supplies", query: "strips" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white pt-16 pb-24 lg:pt-20 lg:pb-32">
      {/* Dynamic SEO MedicalEquipmentSupplier JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalEquipmentSupplier",
            name: "Human Biomedicals LLP",
            url: "https://humanbiomedicals.org",
            areaServed: displayCity,
            description: displayDesc,
            telephone: "+91-9251616952",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Unit S-1, 2nd Floor, Pn 16, D Block, Tagore Nagar, Vaishali Nagar",
              addressLocality: "Jaipur",
              addressRegion: "Rajasthan",
              postalCode: "302021",
              addressCountry: "India",
            },
          }),
        }}
      />

      {/* Futuristic Ambient Lighting & Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none"></div>
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-violet-600/30 via-sky-500/25 to-emerald-400/20 blur-[130px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[350px] bg-sky-500/15 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 bg-slate-800/80 backdrop-blur-md border border-slate-700/80 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium text-slate-200 shadow-xl mb-7"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-violet-300 font-semibold">Human Biomedicals LLP</span>
          <span className="text-slate-500">•</span>
          <span>ISO 13485 Certified Equipment Supplier in {displayCity}</span>
        </motion.div>

        {/* Dynamic Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white max-w-5xl mx-auto"
        >
          {displayTitle}
        </motion.h1>

        {/* Dynamic Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal"
        >
          {displayDesc}
        </motion.p>

        {/* Interactive Live Biomedical Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-9 max-w-2xl mx-auto"
        >
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-2 shadow-2xl focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-400/20 transition-all duration-300"
          >
            <div className="pl-3.5 pr-2 text-slate-400">
              <Search size={20} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search diagnostic analyzers, test strips, reagents, instruments..."
              className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 hover:from-violet-500 hover:to-sky-400 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl transition duration-200 flex items-center gap-1.5 shadow-lg shadow-violet-600/30"
            >
              <span>Search</span>
              <ArrowRight size={15} />
            </button>
          </form>

          {/* Quick Category Chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Sparkles size={13} className="text-sky-400" /> Popular:
            </span>
            {quickCategories.map((cat) => (
              <Link
                key={cat.label}
                href={`${basePath}/items?search=${encodeURIComponent(cat.query)}`}
                className="bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition duration-200"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Dual Primary Action CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {btn1Text && (
            <Link
              href={`${basePath}/items`}
              className="w-full sm:w-auto bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 hover:from-violet-500 hover:to-sky-400 text-white px-8 py-3.5 rounded-full font-bold shadow-xl shadow-violet-500/25 hover:shadow-2xl hover:scale-[1.03] transition duration-300 text-sm sm:text-base flex items-center justify-center gap-2"
            >
              <span>{btn1Text}</span>
              <ArrowRight size={17} />
            </Link>
          )}

          {btn2Text && (
            <Link
              href={`${basePath}/contact`}
              className="w-full sm:w-auto bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600/80 text-white hover:text-sky-300 px-8 py-3.5 rounded-full font-bold shadow-md hover:scale-[1.02] transition duration-300 text-sm sm:text-base flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <PhoneCall size={16} className="text-sky-400" />
              <span>{btn2Text}</span>
            </Link>
          )}
        </motion.div>

        {/* High-Tech Biomedical Telemetry Cards (Replaces standard stats & boring image) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-14 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 text-left"
        >
          {/* Card 1 */}
          <div className="bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/70 p-4 sm:p-5 rounded-2xl backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-500/10 group">
            <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Truck size={20} />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">500+</div>
            <p className="text-xs sm:text-sm font-semibold text-slate-300 mt-1">Equipment Deliveries</p>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">PAN-India hospital & lab supply network</p>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/70 p-4 sm:p-5 rounded-2xl backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/50 hover:shadow-xl hover:shadow-sky-500/10 group">
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Activity size={20} />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">100+</div>
            <p className="text-xs sm:text-sm font-semibold text-slate-300 mt-1">Hospitals Served</p>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">Diagnostic pathology centers & clinics</p>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/70 p-4 sm:p-5 rounded-2xl backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ShieldCheck size={20} />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">ISO 13485</div>
            <p className="text-xs sm:text-sm font-semibold text-slate-300 mt-1">Certified Standards</p>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">NABL & international compliance</p>
          </div>

          {/* Card 4 */}
          <div className="bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/70 p-4 sm:p-5 rounded-2xl backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/10 group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Wrench size={20} />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">24/7 Support</div>
            <p className="text-xs sm:text-sm font-semibold text-slate-300 mt-1">Biomedical AMC & Service</p>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">Calibration, installation & engineers</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}