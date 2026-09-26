"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const [contactInfo, setContactInfo] = useState([]);
  const [categories, setCategories] = useState([]);

  const pathname = usePathname();

  // DISTRICT DETECT
  const pathParts = pathname.split("/");

  const district =
    pathParts[1] &&
    !["about", "items", "services", "contact"].includes(pathParts[1])
      ? pathParts[1]
      : "";

  // DYNAMIC BASE
  const basePath = district ? `/${district}` : "";

  // FETCH DATA FROM SQLITE ADMIN API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Contact Info
        const contactRes = await fetch("/api/site-data?type=contact");
        if (contactRes.ok) {
          const contactJson = await contactRes.json();
          if (contactJson.success && contactJson.data) {
            setContactInfo(contactJson.data.contactInfo || []);
          }
        }

        // Fetch Categories
        const catRes = await fetch("/api/catalog");
        if (catRes.ok) {
          const catJson = await catRes.json();
          if (catJson.success && Array.isArray(catJson.categories)) {
            const fetchedCats = catJson.categories
              .map((c) => (typeof c === "string" ? c : c.name || c.category || c.id))
              .filter(Boolean);
            if (fetchedCats.length > 0) {
              setCategories(fetchedCats);
            }
          }
        }
      } catch (err) {
        console.error("Error loading footer data:", err);
      }
    };

    fetchData();
  }, []);

  // GET VALUE BY LABEL
  const getValue = (...labels) => {
    const found = contactInfo.find((item) =>
      labels.some(
        (label) =>
          item.label?.toLowerCase().trim() === label.toLowerCase().trim()
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

  const originalAddress = getValue("Address", "Office Location");

  const city = district
    ?.replace(/-/g, " ")
    ?.replace(/\b\w/g, (char) => char.toUpperCase());

  const state = getValue("State");

  const finalAddress =
    city && state && city.toLowerCase() !== "jaipur"
      ? `${city}, ${state}, India`
      : originalAddress;

  return (
    <footer className="pt-16 bg-slate-900 text-slate-300">
      {/* Premium Gradient Top Border */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 mb-16">
        <div className="relative h-[2px] w-full bg-gradient-to-r from-transparent via-violet-500 to-sky-400">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-8 bg-violet-500/20 blur-2xl"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-12">
        {/* Main Footer Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-14">
          
          {/* Column 1: Brand Info */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-violet-400 via-sky-400 to-white bg-clip-text text-transparent">
              {getValue("Company", "Company Name") || "Human Biomedicals LLP"}
            </h2>

            {getValue("Description", "About") && (
              <p className="mt-5 text-slate-400 text-sm leading-7">
                {getValue("Description", "About")}
              </p>
            )}

            {/* Social Icons */}
            <div className="flex gap-3.5 mt-6">
              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-400 hover:text-white hover:bg-violet-600 hover:border-violet-500 transition duration-300"
              >
                <Facebook size={18} />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-400 hover:text-white hover:bg-violet-600 hover:border-violet-500 transition duration-300"
              >
                <Instagram size={18} />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-400 hover:text-white hover:bg-violet-600 hover:border-violet-500 transition duration-300"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 pb-2 border-b border-slate-800">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3 text-sm">
              <Link
                href={`${basePath}/`}
                className="text-slate-400 hover:text-sky-400 transition flex items-center gap-1.5"
              >
                <ChevronRight size={14} className="text-violet-400" /> Home
              </Link>

              <Link
                href={`${basePath}/about`}
                className="text-slate-400 hover:text-sky-400 transition flex items-center gap-1.5"
              >
                <ChevronRight size={14} className="text-violet-400" /> About Us
              </Link>

              <Link
                href={`${basePath}/items`}
                className="text-slate-400 hover:text-sky-400 transition flex items-center gap-1.5"
              >
                <ChevronRight size={14} className="text-violet-400" /> Products Catalog
              </Link>

              <Link
                href={`${basePath}/services`}
                className="text-slate-400 hover:text-sky-400 transition flex items-center gap-1.5"
              >
                <ChevronRight size={14} className="text-violet-400" /> Services & AMC
              </Link>

              <Link
                href={`${basePath}/contact`}
                className="text-slate-400 hover:text-sky-400 transition flex items-center gap-1.5"
              >
                <ChevronRight size={14} className="text-violet-400" /> Contact Us
              </Link>
            </div>
          </div>

          {/* Column 3: Product Categories */}
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 pb-2 border-b border-slate-800">
              Product Categories
            </h3>

            <div className="flex flex-col gap-2.5 text-xs sm:text-sm">
              {categories.slice(0, 7).map((catName, idx) => (
                <Link
                  key={idx}
                  href={`${basePath}/items?category=${encodeURIComponent(catName)}`}
                  className="text-slate-400 hover:text-sky-400 transition flex items-start gap-1.5 line-clamp-1 group"
                >
                  <ChevronRight size={14} className="text-violet-400 shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" />
                  <span className="truncate">{catName}</span>
                </Link>
              ))}
              <Link
                href={`${basePath}/items`}
                className="text-sky-400 hover:text-sky-300 font-semibold mt-2 text-xs flex items-center gap-1"
              >
                View All Categories &rarr;
              </Link>
            </div>
          </div>

          {/* Column 4: Contact Info (DYNAMIC ONLY) */}
          {(phoneNumbers.length > 0 || emailAddresses.length > 0 || finalAddress) && (
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 pb-2 border-b border-slate-800">
                Contact Info
              </h3>

              <div className="space-y-4 text-sm">
                {/* Phone Numbers */}
                {phoneNumbers.length > 0 && (
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-lg bg-slate-800 text-violet-400 shrink-0">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-500 font-bold tracking-wider">
                        Phone {phoneNumbers.length > 1 ? "Numbers" : "Number"}
                      </p>
                      <div className="mt-1 space-y-1">
                        {phoneNumbers.map((ph, idx) => {
                          const cleanPh = ph.replace(/[^\d+]/g, "");
                          return (
                            <a
                              key={idx}
                              href={`tel:${cleanPh}`}
                              className="text-white hover:text-sky-400 font-semibold block transition"
                            >
                              {ph}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Email Address */}
                {emailAddresses.length > 0 && (
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-lg bg-slate-800 text-violet-400 shrink-0">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-500 font-bold tracking-wider">
                        Email {emailAddresses.length > 1 ? "Addresses" : "Address"}
                      </p>
                      <div className="mt-1 space-y-1">
                        {emailAddresses.map((em, idx) => (
                          <a
                            key={idx}
                            href={`mailto:${em}`}
                            className="text-slate-300 hover:text-sky-400 font-medium block transition break-all"
                          >
                            {em}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Address */}
                {finalAddress && (
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-lg bg-slate-800 text-violet-400 shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-500 font-bold tracking-wider">Location</p>
                      <p className="text-slate-300 font-medium leading-relaxed mt-0.5">
                        {finalAddress}
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="text-center md:text-left">
            © 2026 {getValue("Company", "Company Name") || "Human Biomedicals LLP"}. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link href={`${basePath}/`} className="hover:text-slate-300 transition">
              Privacy Policy
            </Link>
            <Link href={`${basePath}/`} className="hover:text-slate-300 transition">
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}