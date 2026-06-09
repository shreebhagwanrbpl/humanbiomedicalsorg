"use client";

import { motion } from "framer-motion";

import {
  Mail,
  Phone,
  MapPin,
  Clock3,
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";

import { useEffect, useState } from "react";

import { db } from "@/firebase";

import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import toast, { Toaster } from "react-hot-toast";

export default function ContactPage({
  city,
  state,
}) {

  const [contactInfo, setContactInfo] = useState([]);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  // FETCH FIREBASE DATA
  useEffect(() => {

    const fetchData = async () => {

      try {

        const snap = await getDoc(
          doc(
            db,
            "websites",
            "humanbiomedicalsorg",
            "pages",
            "contact"
          )
        );

        if (snap.exists()) {

          setContactInfo(
            snap.data().contactInfo || []
          );

        }

      } catch (err) {

        console.error(err);

      }

    };

    fetchData();

  }, []);

  // GET VALUE BY LABEL
  const getValue = (...labels) => {

    const found = contactInfo.find((item) =>
      labels.some(
        (label) =>
          item.label?.toLowerCase().trim() ===
          label.toLowerCase().trim()
      )
    );

    return found?.value || "";

  };
  const originalAddress =
    getValue(
      "Address",
      "Office Location"
    );

  const finalAddress =
    city &&
      state &&
      city.toLowerCase() !==
      "jaipur"
      ? `${city}, ${state}, India`
      : originalAddress;
  // HANDLE INPUT
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();

    // VALIDATION
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.message
    ) {

      toast.error("Please fill all required fields");

      return;

    }

    try {

      setLoading(true);

      await addDoc(
        collection(
          db,
          "websitesQueries",
          "humanbiomedicalsorg",
          "contactQueries"
        ),
        {
          ...formData,
          createdAt: serverTimestamp(),
        }
      );

      toast.success("Query Sent Successfully");

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

    } catch (err) {

      console.error(err);

      toast.error("Failed To Send Query");

    } finally {

      setLoading(false);

    }

  };

  return (
    <main className="relative overflow-hidden bg-white">

      {/* TOASTER */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "14px",
            padding: "14px 18px",
            fontSize: "15px",
            fontWeight: "600",
          },
        }}
      />

      {/* HERO */}
      <section className="relative pt-32 pb-24 overflow-hidden">

        {/* Background Blur */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-violet-100 blur-3xl rounded-full"></div>

        <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-100 blur-3xl rounded-full"></div>

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">

          <div className="text-center max-w-5xl mx-auto">

            <span className="inline-flex rounded-full bg-violet-100 px-5 py-2 text-sm font-semibold text-violet-700">
              Contact Human Biomedical LLP
            </span>

            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mt-8 text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight text-slate-900"
            >
              Let’s Build Better Healthcare Solutions
            </motion.h1>

            <p className="mt-8 text-lg sm:text-xl leading-9 text-slate-600">
              Contact Human Biomedical LLP for premium laboratory
              instruments, diagnostic systems,
              pathology equipment, and hospital technology solutions.
            </p>

          </div>

        </div>

      </section>

      {/* CONTACT SECTION */}
      <section className="pb-28">

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

          <div className="grid lg:grid-cols-2 gap-14 items-start">

            {/* LEFT */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >

              <span className="inline-flex rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700">
                Contact Information
              </span>

              <h2 className="mt-8 text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
                Get In Touch With Our Team
              </h2>

              <p className="mt-8 text-lg leading-9 text-slate-600">
                We provide advanced healthcare technology,
                laboratory equipment, hospital machines,
                pathology systems, and medical infrastructure solutions.
              </p>

              {/* Contact Cards */}
              <div className="mt-12 space-y-5">

                {/* EMAIL */}
                <div className="flex gap-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">

                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-sky-500 text-white flex items-center justify-center shrink-0">
                    <Mail size={24} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-violet-600">
                      Email Address
                    </p>

                    <h3 className="mt-2 text-xl font-bold text-slate-900">
                      {getValue("Email", "Email Address")}
                    </h3>
                  </div>

                </div>

                {/* PHONE */}
                <div className="flex gap-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">

                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-sky-500 text-white flex items-center justify-center shrink-0">
                    <Phone size={24} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-violet-600">
                      Phone Number
                    </p>

                    <h3 className="mt-2 text-xl font-bold text-slate-900">
                      {getValue("Phone", "Phone Number")}
                    </h3>
                  </div>

                </div>

                {/* ADDRESS */}
                <div className="flex gap-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">

                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-sky-500 text-white flex items-center justify-center shrink-0">
                    <MapPin size={24} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-violet-600">
                      Office Location
                    </p>

                    <h3 className="mt-2 text-xl font-bold text-slate-900">
                      {finalAddress}
                    </h3>
                  </div>

                </div>

                {/* TIMING */}
                <div className="flex gap-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">

                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-sky-500 text-white flex items-center justify-center shrink-0">
                    <Clock3 size={24} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-violet-600">
                      Working Hours
                    </p>

                    <h3 className="mt-2 text-xl font-bold text-slate-900">
                      {getValue("Working Hours", "Timing")}
                    </h3>
                  </div>

                </div>

              </div>

              {/* Social */}
              <div className="mt-10 flex gap-4">

                <button className="w-14 h-14 rounded-2xl border border-slate-200 flex items-center justify-center hover:border-violet-400 hover:text-violet-600 transition">
                  <Facebook />
                </button>

                <button className="w-14 h-14 rounded-2xl border border-slate-200 flex items-center justify-center hover:border-violet-400 hover:text-violet-600 transition">
                  <Instagram />
                </button>

                <button className="w-14 h-14 rounded-2xl border border-slate-200 flex items-center justify-center hover:border-violet-400 hover:text-violet-600 transition">
                  <Linkedin />
                </button>

              </div>

            </motion.div>

            {/* RIGHT FORM */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="rounded-[40px] border border-slate-200 bg-white p-8 lg:p-10 shadow-2xl"
            >

              <span className="inline-flex rounded-full bg-violet-100 px-5 py-2 text-sm font-semibold text-violet-700">
                Send Enquiry
              </span>

              <h2 className="mt-8 text-4xl font-bold text-slate-900">
                Request Product Information
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                Fill out the form below and our team
                will contact you regarding healthcare equipment,
                laboratory instruments, and medical solutions.
              </p>

              {/* FORM */}
              <form
                onSubmit={handleSubmit}
                className="mt-10 space-y-5"
              >

                <div className="grid sm:grid-cols-2 gap-5">

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none focus:border-violet-500"
                  />

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none focus:border-violet-500"
                  />

                </div>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none focus:border-violet-500"
                />

                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Product Requirement"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none focus:border-violet-500"
                />

                <textarea
                  rows="6"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your enquiry..."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none focus:border-violet-500"
                ></textarea>

                {/* Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-violet-600 to-sky-500 text-white py-5 rounded-2xl font-semibold text-lg hover:scale-[1.01] transition duration-300 flex items-center justify-center gap-3 shadow-xl disabled:opacity-70"
                >
                  {loading ? "Sending..." : "Send Message"}

                  {!loading && <ArrowRight size={20} />}
                </button>

              </form>

            </motion.div>

          </div>

        </div>

      </section>

    </main>
  );
}