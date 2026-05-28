"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Amit Sharma",
    role: "Pathology Lab Owner",
    review:
      "Human Biosis Pvt Ltd provided high-quality laboratory equipment with excellent technical support and fast delivery service.",
  },
  {
    name: "Dr. Neha Verma",
    role: "Hospital Administrator",
    review:
      "Professional healthcare equipment supplier with reliable products and outstanding customer service for hospitals.",
  },
  {
    name: "Rahul Mehta",
    role: "Diagnostic Center Director",
    review:
      "Premium diagnostic systems and modern medical devices that improved our laboratory efficiency and workflow.",
  },
];

export default function Testimonials() {
  return (
    <section className="relative py-24 overflow-hidden">

      {/* Background Blur */}
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
            Client Testimonials
          </span>

          <h2 className="mt-8 text-4xl sm:text-5xl font-bold text-slate-900">
            Trusted By Healthcare Professionals
          </h2>

          <p className="mt-6 text-lg text-slate-600 leading-8">
            Hospitals, laboratories, and healthcare institutions trust
            Human Biosis Pvt Ltd for premium medical equipment and reliable support.
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="glass rounded-[30px] p-8 shadow-xl hover:-translate-y-2 transition duration-300"
            >

              {/* Stars */}
              <div className="flex gap-1 text-yellow-500">
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
              </div>

              {/* Review */}
              <p className="mt-6 text-slate-600 leading-8">
                “{item.review}”
              </p>

              {/* User */}
              <div className="mt-8">
                <h3 className="text-xl font-bold text-slate-900">
                  {item.name}
                </h3>

                <p className="text-slate-500 mt-1">
                  {item.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}