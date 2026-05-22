"use client";

import { motion } from "framer-motion";

import {
  Microscope,
  Hospital,
  ShieldCheck,
  Settings,
  Truck,
  Wrench,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import { useEffect, useState } from "react";

import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

// STATIC ICONS
const serviceIcons = [
  <Microscope size={34} />,
  <Hospital size={34} />,
  <ShieldCheck size={34} />,
  <Truck size={34} />,
  <Wrench size={34} />,
  <Settings size={34} />,
];

// STATIC PROCESS
const process = [
  "Requirement Analysis",
  "Product Consultation",
  "Equipment Selection",
  "Installation & Setup",
  "Technical Support",
];

export default function ServicesPage() {

  const [services, setServices] = useState([]);

  // FETCH SERVICES
  useEffect(() => {

    const fetchData = async () => {

      try {

        const snap = await getDoc(
          doc(
            db,
            "websites",
            "humanbiomedicalsorg",
            "pages",
            "services"
          )
        );

        if (snap.exists()) {

          const data = snap.data().services || [];

          setServices(data);

        }

      } catch (err) {

        console.error(err);

      }

    };

    fetchData();

  }, []);

  return (
    <main className="relative overflow-hidden bg-white">

      {/* HERO */}
      <section className="relative pt-32 pb-24 overflow-hidden">

        {/* Blur */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-violet-100 blur-3xl rounded-full"></div>

        <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-100 blur-3xl rounded-full"></div>

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">

          <div className="text-center max-w-5xl mx-auto">

            <span className="inline-flex rounded-full bg-violet-100 px-5 py-2 text-sm font-semibold text-violet-700">
              Rajbiosis Pvt Ltd Services
            </span>

            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mt-8 text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight text-slate-900"
            >
              Healthcare & Laboratory Equipment Services
            </motion.h1>

            <p className="mt-8 text-lg sm:text-xl leading-9 text-slate-600">
              Rajbiosis Pvt Ltd provides premium laboratory
              equipment solutions, hospital machinery,
              diagnostic systems, healthcare technology,
              installation support, and medical infrastructure services.
            </p>

          </div>

        </div>

      </section>

      {/* SERVICES */}
      <section className="pb-24">

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

          {/* Heading */}
          <div className="max-w-3xl">

            <span className="inline-flex rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700">
              Our Expertise
            </span>

            <h2 className="mt-6 text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
              Premium Healthcare Technology Services
            </h2>

          </div>

          {/* Grid */}
          <div className="mt-16 grid sm:grid-cols-2 xl:grid-cols-3 gap-8">

            {services.map((item, index) => (

              <motion.div
                key={index}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                viewport={{ once: true }}
                className="group bg-white rounded-[32px] border border-slate-200 p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-500"
              >

                {/* STATIC ICON */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-violet-600 to-sky-500 text-white flex items-center justify-center shadow-lg">

                  {serviceIcons[index % serviceIcons.length]}

                </div>

                {/* DYNAMIC TITLE */}
                <h3 className="mt-8 text-3xl font-bold text-slate-900 leading-snug">
                  {item.title}
                </h3>

                {/* DYNAMIC DESC */}
                <p className="mt-5 text-slate-600 leading-8">
                  {item.desc}
                </p>

                {/* Button */}
                <button className="mt-8 flex items-center gap-2 text-violet-600 font-semibold hover:gap-4 transition-all duration-300">
                  Learn More
                  <ArrowRight size={18} />
                </button>

              </motion.div>

            ))}

          </div>

        </div>

      </section>

      {/* PROCESS */}
      <section className="pb-24">

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

          <div className="rounded-[40px] border border-slate-200 bg-gradient-to-r from-violet-50 to-sky-50 p-10 lg:p-16">

            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* Left */}
              <div>

                <span className="inline-flex rounded-full bg-white px-5 py-2 text-sm font-semibold text-violet-700 shadow">
                  Working Process
                </span>

                <h2 className="mt-8 text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
                  Professional Healthcare Equipment Workflow
                </h2>

                <p className="mt-8 text-lg leading-9 text-slate-600">
                  We follow a streamlined process to deliver
                  high-quality laboratory instruments,
                  pathology systems, diagnostic equipment,
                  and hospital technology solutions.
                </p>

              </div>

              {/* Right */}
              <div className="space-y-5">

                {process.map((item, index) => (
                  <div
                    key={item}
                    className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-5 shadow-sm"
                  >

                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-600 to-sky-500 text-white font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {item}
                      </h3>
                    </div>

                  </div>
                ))}

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* WHY CHOOSE US */}
      <section className="pb-24">

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Image */}
            <div className="overflow-hidden rounded-[40px] shadow-2xl">

              <img
                src="https://images.unsplash.com/photo-1581595219315-a187dd40c322?q=80&w=1400&auto=format&fit=crop"
                alt="Healthcare Services"
                className="w-full h-[600px] object-cover"
              />

            </div>

            {/* Content */}
            <div>

              <span className="inline-flex rounded-full bg-violet-100 px-5 py-2 text-sm font-semibold text-violet-700">
                Why Choose Us
              </span>

              <h2 className="mt-8 text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
                Trusted Healthcare Equipment Partner
              </h2>

              <p className="mt-8 text-lg leading-9 text-slate-600">
                Rajbiosis Pvt Ltd delivers premium healthcare
                technology solutions with quality assurance,
                reliable support, fast delivery,
                and advanced laboratory equipment expertise.
              </p>

              {/* Points */}
              <div className="mt-10 space-y-5">

                <div className="flex gap-4">
                  <CheckCircle2 className="text-violet-600 shrink-0" />

                  <p className="text-lg text-slate-700">
                    Premium laboratory & hospital equipment
                  </p>
                </div>

                <div className="flex gap-4">
                  <CheckCircle2 className="text-violet-600 shrink-0" />

                  <p className="text-lg text-slate-700">
                    Reliable installation & technical support
                  </p>
                </div>

                <div className="flex gap-4">
                  <CheckCircle2 className="text-violet-600 shrink-0" />

                  <p className="text-lg text-slate-700">
                    Modern diagnostic & pathology solutions
                  </p>
                </div>

                <div className="flex gap-4">
                  <CheckCircle2 className="text-violet-600 shrink-0" />

                  <p className="text-lg text-slate-700">
                    Fast product delivery & customer assistance
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="pb-28">

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

          <div className="rounded-[40px] bg-gradient-to-r from-violet-600 to-sky-500 px-8 py-16 lg:px-20 flex flex-col lg:flex-row items-center justify-between gap-10">

            <div className="max-w-3xl">

              <h2 className="text-4xl sm:text-5xl font-bold leading-tight text-white">
                Need Healthcare Equipment Solutions?
              </h2>

              <p className="mt-6 text-lg leading-9 text-white/90">
                Contact Rajbiosis Pvt Ltd for premium laboratory
                instruments, hospital equipment,
                pathology systems, and diagnostic devices.
              </p>

            </div>

            <button
              onClick={() =>
                (window.location.href = "/contact")
              }
              className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:scale-105 transition duration-300 whitespace-nowrap"
            >
              Contact Us
            </button>

          </div>

        </div>

      </section>

    </main>
  );
}