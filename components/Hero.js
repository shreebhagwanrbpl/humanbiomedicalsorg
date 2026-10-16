"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Activity,
  Truck,
  Wrench,
  Sparkles,
  PhoneCall,
  Microscope,
  CheckCircle2,
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
    <section className="relative bg-gradient-to-b from-sky-50/60 via-slate-50/40 to-white pt-4 pb-12 sm:pt-6 sm:pb-16 overflow-hidden">
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

      {/* Subtle Ambient Background Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:28px_28px] opacity-35 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ========================================================================= */}
        {/* HERO IMAGE BANNER (Starts directly below navbar as the main centerpiece)  */}
        {/* ========================================================================= */}
        <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-2xl border border-slate-200/90 bg-slate-950">
          {/* Background Laboratory Image */}
          <div className="absolute inset-0">
            <Image
              src="/hero-banner.jpg"
              alt={`Biomedical laboratory instrumentation and clinical diagnostics equipment in ${displayCity}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1280px"
              className="object-cover object-right lg:object-center"
            />
            {/* Cinematic Gradient Overlays for Crystal-Clear Text Legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/20 lg:to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/30"></div>
          </div>

          {/* Banner Content Layout */}
          <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-14 md:px-12 md:py-16 lg:px-16 lg:py-20 max-w-3xl">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 bg-white/15 backdrop-blur-md border border-white/20 px-3.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-white shadow-lg mb-5"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-violet-300 font-bold">Human Biomedicals LLP</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-200">ISO 13485 Certified Supplier</span>
            </motion.div>

            {/* Dynamic Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-2xl sm:text-4xl md:text-5xl lg:text-[42px] font-black tracking-tight leading-[1.2] text-white"
            >
              {displayTitle}
            </motion.h1>

            {/* Dynamic Description */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed font-normal max-w-2xl"
            >
              {displayDesc}
            </motion.p>

            {/* Integrated Live Biomedical Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 max-w-xl"
            >
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center bg-white/95 backdrop-blur-xl border border-white/40 rounded-2xl p-1.5 shadow-2xl focus-within:ring-2 focus-within:ring-violet-400 transition-all duration-300"
              >
                <div className="pl-3 pr-2 text-slate-400">
                  <Search size={19} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search diagnostic analyzers, test strips, reagents..."
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="shrink-0 bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 hover:from-violet-500 hover:to-sky-400 text-white font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl transition duration-200 flex items-center gap-1 shadow-md shadow-violet-600/30 cursor-pointer"
                >
                  <span>Search</span>
                  <ArrowRight size={14} />
                </button>
              </form>

              {/* Quick Category Chips */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-300 font-medium mr-1 flex items-center gap-1 text-[11px] sm:text-xs">
                  <Sparkles size={12} className="text-sky-300" /> Popular:
                </span>
                {quickCategories.map((cat) => (
                  <Link
                    key={cat.label}
                    href={`${basePath}/items?search=${encodeURIComponent(cat.query)}`}
                    className="bg-white/10 hover:bg-white/25 border border-white/20 text-slate-200 hover:text-white px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-medium backdrop-blur-sm transition duration-200"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Dual Action CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 flex flex-wrap items-center gap-3 sm:gap-4"
            >
              {btn1Text && (
                <Link
                  href={`${basePath}/items`}
                  className="bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 hover:from-violet-500 hover:to-sky-400 text-white px-6 sm:px-7 py-3 rounded-full font-bold shadow-lg shadow-violet-600/30 hover:scale-[1.02] transition duration-300 text-xs sm:text-sm flex items-center gap-2"
                >
                  <span>{btn1Text}</span>
                  <ArrowRight size={15} />
                </Link>
              )}

              {btn2Text && (
                <Link
                  href={`${basePath}/contact`}
                  className="bg-white/10 hover:bg-white/20 border border-white/25 text-white hover:text-sky-200 px-6 sm:px-7 py-3 rounded-full font-semibold backdrop-blur-md hover:scale-[1.02] transition duration-300 text-xs sm:text-sm flex items-center gap-2"
                >
                  <PhoneCall size={15} className="text-sky-300" />
                  <span>{btn2Text}</span>
                </Link>
              )}
            </motion.div>
          </div>

          {/* Floating Badges on the Visible Image Area (Desktop) */}
          <div className="hidden lg:block absolute top-6 right-6 z-20">
            <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <Microscope size={15} className="text-sky-300" />
              <span>Clinical Diagnostics & Automation</span>
            </div>
          </div>

          <div className="hidden lg:block absolute bottom-6 right-6 z-20">
            <div className="bg-slate-900/85 backdrop-blur-md border border-slate-700/80 p-3.5 rounded-2xl text-white shadow-2xl max-w-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-violet-600/30 border border-violet-500/40 text-violet-300 flex items-center justify-center shrink-0">
                  <Activity size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Diagnostic Precision</h4>
                  <p className="text-[11px] text-slate-300">Biochemistry, Hematology & Electrolytes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* HIGH-TECH BIOMEDICAL TELEMETRY CARDS (Right below the banner)             */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-6 sm:mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-left"
        >
          {/* Card 1 */}
          <div className="bg-white hover:bg-slate-50/80 border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-violet-300 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white transition-all">
              <Truck size={20} />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">500+</div>
            <p className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">Equipment Deliveries</p>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">PAN-India hospital & lab supply network</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white hover:bg-slate-50/80 border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-sky-300 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all">
              <Activity size={20} />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">100+</div>
            <p className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">Hospitals Served</p>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Diagnostic pathology centers & clinics</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white hover:bg-slate-50/80 border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-emerald-300 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <ShieldCheck size={20} />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">ISO 13485</div>
            <p className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">Certified Standards</p>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">NABL & international compliance</p>
          </div>

          {/* Card 4 */}
          <div className="bg-white hover:bg-slate-50/80 border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-amber-300 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all">
              <Wrench size={20} />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">24/7 Support</div>
            <p className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">Biomedical AMC & Service</p>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Calibration, installation & engineers</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}