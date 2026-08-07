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
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

export default function Footer() {
  const [contactInfo, setContactInfo] = useState([]);
  const [categories, setCategories] = useState([
    "Chemiluminescence Immunoassay Analyser (CLIA)",
    "Fully Automated Clinical Chemistry Analyser",
    "Semi Automated Clinical Chemistry Analyser",
    "Electrolyte Analyser",
    "Hematology Analyser",
    "Urine Analyser",
    "Laboratory Instruments",
    "Hospital Equipment",
  ]);

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

  // FETCH FIREBASE DATA & CATEGORIES
  useEffect(() => {
    const fetchData = async () => {
      try {
        const snap = await getDoc(
          doc(db, "websites", "humanbiomedicalsorg", "pages", "contact")
        );

        if (snap.exists()) {
          setContactInfo(snap.data().contactInfo || []);
        }

        // Fetch dynamic categories list
        const catSnap = await getDocs(
          collection(
            db,
            "websites",
            "humanbiomedicalsorg",
            "pages",
            "categoryproducts",
            "categories"
          )
        );

        if (!catSnap.empty) {
          const fetchedCats = catSnap.docs
            .map((doc) => doc.data().category || doc.id)
            .filter(Boolean);
          if (fetchedCats.length > 0) {
            setCategories(fetchedCats);
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

  const originalAddress = getValue("Address", "Office Location");

  const city = district
    ?.replace(/-/g, " ")
    ?.replace(/\b\w/g, (char) => char.toUpperCase());

  const state = getValue("State");

  const finalAddress =
    city && state && city.toLowerCase() !== "jaipur"
      ? `${city}, ${state}, India`
      : originalAddress || "Jaipur, Rajasthan, India";

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

            <p className="mt-5 text-slate-400 text-sm leading-7">
              {getValue("Description", "About") ||
                "Trusted supplier of medical laboratory instruments, hospital equipment, pathology systems, and diagnostic technology across India."}
            </p>

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

          {/* Column 3: Product Categories (CLICKABLE TO ITEM CATEGORY) */}
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

          {/* Column 4: Contact Info (UPDATED NUMBERS) */}
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 pb-2 border-b border-slate-800">
              Contact Info
            </h3>

            <div className="space-y-4 text-sm">
              {/* Phone Numbers */}
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-slate-800 text-violet-400 shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-500 font-bold tracking-wider">Phone Numbers</p>
                  <a
                    href="tel:+919251598228"
                    className="text-white hover:text-sky-400 font-semibold block mt-0.5 transition"
                  >
                    +91 9251598228
                  </a>
                  <a
                    href="tel:+918112279728"
                    className="text-white hover:text-sky-400 font-semibold block mt-0.5 transition"
                  >
                    +91 8112279728
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-slate-800 text-violet-400 shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-500 font-bold tracking-wider">Email Address</p>
                  <a
                    href={`mailto:${getValue("Email", "Email Address") || "info@humanbiomedicals.org"}`}
                    className="text-slate-300 hover:text-sky-400 font-medium block mt-0.5 transition break-all"
                  >
                    {getValue("Email", "Email Address") || "info@humanbiomedicals.org"}
                  </a>
                </div>
              </div>

              {/* Address */}
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

            </div>
          </div>

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