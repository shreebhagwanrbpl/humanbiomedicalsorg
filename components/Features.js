"use client";

import { motion } from "framer-motion";

import {
  Microscope,
  Hospital,
  ShieldCheck,
} from "lucide-react";

import { useEffect, useState } from "react";

import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

// STATIC ICONS
const serviceIcons = [
  <Microscope size={38} />,
  <Hospital size={38} />,
  <ShieldCheck size={38} />,
];

export default function Features() {

  const [services, setServices] = useState([]);

  // FETCH SERVICES FROM FIREBASE
  useEffect(() => {

    const fetchServices = async () => {

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

    fetchServices();

  }, []);

  return (
    <section className="relative py-24 overflow-hidden">

      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-violet-200/40 blur-3xl rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-72 h-72 bg-sky-200/40 blur-3xl rounded-full"></div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >

          <span className="glass px-5 py-2 rounded-full text-sm font-medium text-slate-700 inline-block">
            Human Biosis Pvt Ltd
          </span>

          <h2 className="mt-8 text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
            Trusted Laboratory & Hospital Equipment Supplier
          </h2>

          <p className="mt-6 text-lg text-slate-600 leading-8">
            Delivering premium medical equipment, diagnostic systems,
            pathology machines, and healthcare technology solutions.
          </p>

        </motion.div>

        {/* Feature Cards */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {services.slice(0, 3).map((item, index) => (

            <motion.div
              key={item.title || index}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="glass rounded-[30px] p-8 shadow-xl hover:-translate-y-2 transition duration-300"
            >

              {/* STATIC ICON */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-sky-500 text-white flex items-center justify-center">

                {serviceIcons[index % serviceIcons.length]}

              </div>

              {/* DYNAMIC TITLE */}
              <h3 className="mt-7 text-2xl font-bold text-slate-900">
                {item.title}
              </h3>

              {/* DYNAMIC DESCRIPTION */}
              <p className="mt-4 text-slate-600 leading-8">
                {item.desc}
              </p>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
}