"use client";

import { motion } from "framer-motion";
import {
  Microscope,
  Hospital,
  ShieldCheck,
  Activity,
  HeartPulse,
  Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";

const serviceIcons = [
  <Microscope size={36} key="microscope" />,
  <Hospital size={36} key="hospital" />,
  <ShieldCheck size={36} key="shield" />,
  <Activity size={36} key="activity" />,
  <HeartPulse size={36} key="pulse" />,
  <Wrench size={36} key="wrench" />,
];

export default function Features({ initialServices = null, city = "India" }) {
  const [services, setServices] = useState(initialServices || []);

  useEffect(() => {
    if (initialServices && initialServices.length > 0) return;
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/site-data?type=services");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const data = json.data.services || (Array.isArray(json.data) ? json.data : []);
            setServices(data);
          }
        }
      } catch (err) {
        console.error("Error loading services for features:", err);
      }
    };

    fetchServices();
  }, [initialServices]);

  const displayServices = services && services.length > 0 ? services : [
    {
      title: "Biomedical Equipment Calibration & AMC / CMC Support",
      desc: "Comprehensive annual maintenance contracts, periodic multi-point calibration, and NABL/ISO-traceable validation to guarantee peak analytical accuracy and uninterrupted equipment uptime.",
    },
    {
      title: "Diagnostic Laboratory Setup & Turnkey Solutions",
      desc: "Complete end-to-end laboratory commissioning, workflow design, instrument installation, and regulatory validation for clinical pathology centers and diagnostic hospitals.",
    },
    {
      title: "Hospital Critical Care & OT Equipment Supply",
      desc: "High-precision patient monitors, ventilators, defibrillators, electrosurgical units, and ICU platforms backed by certified biomedical support across India.",
    },
  ];

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden bg-white">
      {/* Background Subtle Tech Accents */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-violet-100/50 blur-3xl rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-sky-100/50 blur-3xl rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 border border-violet-100 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            Human Biomedicals LLP • Clinical Engineering
          </span>

          <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
            Trusted Diagnostic & Biomedical Solutions in {city}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Delivering premium clinical analyzers, diagnostic test platforms,
            pathology automation, and dedicated biomedical engineering services.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-14 sm:mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayServices.slice(0, 6).map((item, index) => (
            <motion.div
              key={item.title || index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-50/70 hover:bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-sky-500 text-white flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform">
                  {serviceIcons[index % serviceIcons.length]}
                </div>

                <h3 className="mt-6 text-xl sm:text-2xl font-bold text-slate-900 leading-snug group-hover:text-violet-700 transition-colors">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                  {item.desc || item.description}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-200/60 flex items-center gap-2 text-xs font-bold text-violet-700">
                <span>Verified Clinical Standard</span>
                <span className="w-1.5 h-1.5 rounded-full bg-violet-600"></span>
                <span className="text-slate-400 font-medium">Pan-India Support</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}