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

  // FETCH CONTACT DATA FROM SQLITE ADMIN API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/site-data?type=contact");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setContactInfo(json.data.contactInfo || []);
          }
        }
      } catch (err) {
        console.error("Error loading contact data:", err);
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

  // EXTRACT DYNAMIC PHONE NUMBERS (SUPPORTS MULTIPLE)
  const getPhoneNumbers = () => {
    const phoneItems = contactInfo.filter((item) =>
      ["phone", "mobile", "contact", "call", "tel", "phone number", "phone numbers", "contact number", "mobile number"].some(
        (label) => item.label?.toLowerCase().trim().includes(label)
      )
    );

    const phones = [];
    phoneItems.forEach((item) => {
      if (item.value) {
        const parts = String(item.value)
          .split(/[,/\n;]+/)
          .map((p) => p.trim())
          .filter(Boolean);
        phones.push(...parts);
      }
    });

    return [...new Set(phones)];
  };

  // EXTRACT DYNAMIC EMAILS (SUPPORTS MULTIPLE)
  const getEmails = () => {
    const emailItems = contactInfo.filter((item) =>
      ["email", "mail", "email address"].some(
        (label) => item.label?.toLowerCase().trim().includes(label)
      )
    );

    const emails = [];
    emailItems.forEach((item) => {
      if (item.value) {
        const parts = String(item.value)
          .split(/[,/\n;]+/)
          .map((e) => e.trim())
          .filter(Boolean);
        emails.push(...parts);
      }
    });

    return [...new Set(emails)];
  };

  const phoneNumbers = getPhoneNumbers();
  const emailAddresses = getEmails();

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
    let { name, value } = e.target;

    if (name === "phone") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDATION
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (formData.name.trim().length < 3) {
      toast.error("Name must be at least 3 characters");
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email");
      return;
    }

    const phoneRegex =
      /^[6-9]\d{9}$/;

    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }

    if (!phoneRegex.test(formData.phone)) {
      toast.error("Enter a valid 10 digit mobile number");
      return;
    }

    if (!formData.subject.trim()) {
      toast.error("Please enter product requirement");
      return;
    }

    if (formData.subject.trim().length < 3) {
      toast.error("Product requirement is too short");
      return;
    }

    if (!formData.message.trim()) {
      toast.error("Please enter your enquiry");
      return;
    }

    if (formData.message.trim().length < 10) {
      toast.error("Enquiry must be at least 10 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/contact-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          websiteId: "humanbiomedicalsorg",
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed To Send Query");
      }

      toast.success(
        "Query Sent Successfully"
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

    } catch (err) {
      console.error(err);
      toast.error(
        err.message || "Failed To Send Query"
      );
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
      <section className="relative pt-24 pb-16 overflow-hidden">

        {/* Background Blur */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-violet-100 blur-3xl rounded-full"></div>

        <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-100 blur-3xl rounded-full"></div>

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">

          <div className="text-center max-w-4xl mx-auto">

            <span className="inline-flex rounded-full bg-violet-100 px-5 py-2 text-sm font-semibold text-violet-700">
              Contact Human Biomedicals LLP
            </span>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-slate-900"
            >
              Let’s Build Better Healthcare Solutions
            </motion.h1>

            <p className="mt-6 text-base sm:text-lg leading-relaxed text-slate-600">
              Contact Human Biomedicals LLP for premium laboratory
              instruments, diagnostic systems,
              pathology equipment, and hospital technology solutions.
            </p>

          </div>

        </div>

      </section>

      {/* CONTACT SECTION */}
      <section className="pb-24">

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">

            {/* LEFT */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
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

              <h2 className="mt-6 text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                Get In Touch With Our Team
              </h2>

              <p className="mt-5 text-base leading-relaxed text-slate-600">
                We provide advanced healthcare technology,
                laboratory equipment, hospital machines,
                pathology systems, and medical infrastructure solutions.
              </p>

              {/* Contact Cards (DYNAMIC ONLY) */}
              <div className="mt-10 space-y-5">

                {/* EMAIL */}
                {emailAddresses.length > 0 && (
                  <div className="flex gap-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">

                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-sky-500 text-white flex items-center justify-center shrink-0">
                      <Mail size={24} />
                    </div>

                    <div>
                      <p className="text-xs uppercase font-bold tracking-widest text-violet-600">
                        Email {emailAddresses.length > 1 ? "Addresses" : "Address"}
                      </p>

                      <div className="mt-2 space-y-1">
                        {emailAddresses.map((em, idx) => (
                          <a
                            key={idx}
                            href={`mailto:${em}`}
                            className="text-base sm:text-lg font-bold text-slate-900 hover:text-violet-600 transition block break-all"
                          >
                            {em}
                          </a>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* PHONE */}
                {phoneNumbers.length > 0 && (
                  <div className="flex gap-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">

                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-sky-500 text-white flex items-center justify-center shrink-0">
                      <Phone size={24} />
                    </div>

                    <div>
                      <p className="text-xs uppercase font-bold tracking-widest text-violet-600">
                        Phone {phoneNumbers.length > 1 ? "Numbers" : "Number"}
                      </p>

                      <div className="mt-2 space-y-1">
                        {phoneNumbers.map((ph, idx) => {
                          const cleanPh = ph.replace(/[^\d+]/g, "");
                          return (
                            <a
                              key={idx}
                              href={`tel:${cleanPh}`}
                              className="text-lg sm:text-xl font-bold text-slate-900 hover:text-violet-600 transition block"
                            >
                              {ph}
                            </a>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                )}

                {/* ADDRESS */}
                {finalAddress && (
                  <div className="flex gap-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">

                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-sky-500 text-white flex items-center justify-center shrink-0">
                      <MapPin size={24} />
                    </div>

                    <div>
                      <p className="text-xs uppercase font-bold tracking-widest text-violet-600">
                        Office Location
                      </p>

                      <h3 className="mt-2 text-lg sm:text-xl font-bold text-slate-900">
                        {finalAddress}
                      </h3>
                    </div>

                  </div>
                )}

                {/* TIMING */}
                {getValue("Working Hours", "Timing") && (
                  <div className="flex gap-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">

                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-sky-500 text-white flex items-center justify-center shrink-0">
                      <Clock3 size={24} />
                    </div>

                    <div>
                      <p className="text-xs uppercase font-bold tracking-widest text-violet-600">
                        Working Hours
                      </p>

                      <h3 className="mt-2 text-lg sm:text-xl font-bold text-slate-900">
                        {getValue("Working Hours", "Timing")}
                      </h3>
                    </div>

                  </div>
                )}

              </div>

              {/* Social */}
              <div className="mt-8 flex gap-4">

                <button className="w-12 h-12 rounded-xl border border-slate-200 flex items-center justify-center hover:border-violet-400 hover:text-violet-600 transition">
                  <Facebook size={20} />
                </button>

                <button className="w-12 h-12 rounded-xl border border-slate-200 flex items-center justify-center hover:border-violet-400 hover:text-violet-600 transition">
                  <Instagram size={20} />
                </button>

                <button className="w-12 h-12 rounded-xl border border-slate-200 flex items-center justify-center hover:border-violet-400 hover:text-violet-600 transition">
                  <Linkedin size={20} />
                </button>

              </div>

            </motion.div>

            {/* RIGHT FORM */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="rounded-[30px] lg:rounded-[40px] border border-slate-200 bg-white p-5 sm:p-6 lg:p-10 shadow-2xl"
            >

              <span className="inline-flex rounded-full bg-violet-100 px-5 py-2 text-sm font-semibold text-violet-700">
                Send Enquiry
              </span>

              <h2 className="mt-6 text-3xl sm:text-4xl font-bold text-slate-900">
                Request Product Information
              </h2>

              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Fill out the form below and our team
                will contact you regarding healthcare equipment,
                laboratory instruments, and medical solutions.
              </p>

              {/* FORM */}
              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-4"
              >

                <div className="grid sm:grid-cols-2 gap-4">

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    maxLength={50}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 outline-none focus:border-violet-500 text-sm sm:text-base"
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    maxLength={10}
                    pattern="[6-9]{1}[0-9]{9}"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 outline-none focus:border-violet-500 text-sm sm:text-base"
                  />

                </div>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 outline-none focus:border-violet-500 text-sm sm:text-base"
                />

                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Product Requirement"
                  maxLength={100}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 outline-none focus:border-violet-500 text-sm sm:text-base"
                />

                <textarea
                  rows="5"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your enquiry..."
                  minLength={10}
                  maxLength={1000}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 outline-none focus:border-violet-500 text-sm sm:text-base"
                />

                {/* Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-violet-600 to-sky-500 text-white py-4 rounded-2xl font-semibold text-base hover:scale-[1.01] transition duration-300 flex items-center justify-center gap-3 shadow-xl disabled:opacity-70"
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