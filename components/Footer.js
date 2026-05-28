"use client";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  usePathname,
} from "next/navigation";

import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Footer() {

  const [contactInfo, setContactInfo] = useState([]);
  const pathname =
    usePathname();

  // DISTRICT DETECT
  const pathParts =
    pathname.split("/");

  const district =
    pathParts[1] &&
      ![
        "about",
        "items",
        "services",
        "contact",
      ].includes(pathParts[1])
      ? pathParts[1]
      : "";

  // DYNAMIC BASE
  const basePath =
    district
      ? `/${district}`
      : "";
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

  const city = district
    ?.replace(/-/g, " ")
    ?.replace(
      /\b\w/g,
      (char) =>
        char.toUpperCase()
    );

  const state =
    getValue("State");

  const finalAddress =
    city &&
      state &&
      city.toLowerCase() !==
      "jaipur"
      ? `${city}, ${state}, India`
      : originalAddress;
  return (
    <footer className="pt-10">

      {/* Premium Divider */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 mb-20">

        <div className="relative h-[1px] w-full bg-gradient-to-r from-transparent via-violet-400 to-transparent">

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-6 bg-violet-300/30 blur-2xl"></div>

        </div>

      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        {/* Main Footer Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-14">

          {/* Brand */}
          <div>

            <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-sky-500 bg-clip-text text-transparent">
              {getValue("Company", "Company Name") || "Human Biosis Pvt Ltd"}
            </h2>

            <p className="mt-6 text-slate-600 leading-8">
              {getValue("Description", "About") ||
                "Trusted supplier of laboratory instruments, hospital equipment, pathology systems, and healthcare technology solutions."}
            </p>

            {/* STATIC SOCIAL ICONS */}
            <div className="flex gap-4 mt-8">

              <div className="w-11 h-11 rounded-xl glass flex items-center justify-center text-slate-700 hover:text-violet-600 transition cursor-pointer">
                <Facebook size={20} />
              </div>

              <div className="w-11 h-11 rounded-xl glass flex items-center justify-center text-slate-700 hover:text-violet-600 transition cursor-pointer">
                <Instagram size={20} />
              </div>

              <div className="w-11 h-11 rounded-xl glass flex items-center justify-center text-slate-700 hover:text-violet-600 transition cursor-pointer">
                <Linkedin size={20} />
              </div>

            </div>

          </div>

          {/* Quick Links */}
          <div>

            <h3 className="text-xl font-bold text-slate-900">
              Quick Links
            </h3>

            <div className="mt-6 flex flex-col gap-4">

              <Link
                href={`${basePath}/`}
                className="text-slate-600 hover:text-violet-600 transition"
              >
                Home
              </Link>

              <Link
                href={`${basePath}/about`}
                className="text-slate-600 hover:text-violet-600 transition"
              >
                About Us
              </Link>

              <Link
                href={`${basePath}/items`}
                className="text-slate-600 hover:text-violet-600 transition"
              >
                Products
              </Link>

              <Link
                href={`${basePath}/services`}
                className="text-slate-600 hover:text-violet-600 transition"
              >
                Services
              </Link>

              <Link
                href={`${basePath}/contact`}
                className="text-slate-600 hover:text-violet-600 transition"
              >
                Contact
              </Link>

            </div>

          </div>

          {/* Products */}
          <div>

            <h3 className="text-xl font-bold text-slate-900">
              Our Products
            </h3>

            <div className="mt-6 flex flex-col gap-4 text-slate-600">

              <p>
                {getValue("Product 1") || "Laboratory Instruments"}
              </p>

              <p>
                {getValue("Product 2") || "Diagnostic Systems"}
              </p>

              <p>
                {getValue("Product 3") || "Hospital Equipment"}
              </p>

              <p>
                {getValue("Product 4") || "Healthcare Devices"}
              </p>

              <p>
                {getValue("Product 5") || "Pathology Lab Machines"}
              </p>

            </div>

          </div>

          {/* Contact Info */}
          <div>

            <h3 className="text-xl font-bold text-slate-900">
              Contact Info
            </h3>

            <div className="mt-6 space-y-5">

              {/* STATIC ICON */}
              <div className="flex items-start gap-4">

                <Mail
                  className="text-violet-600 mt-1"
                  size={18}
                />

                {/* DYNAMIC */}
                <p className="text-slate-600">
                  {getValue("Email", "Email Address")}
                </p>

              </div>

              {/* STATIC ICON */}
              <div className="flex items-start gap-4">

                <Phone
                  className="text-violet-600 mt-1"
                  size={18}
                />

                {/* DYNAMIC */}
                <p className="text-slate-600">
                  {getValue("Phone", "Phone Number")}
                </p>

              </div>

              {/* STATIC ICON */}
              <div className="flex items-start gap-4">

                <MapPin
                  className="text-violet-600 mt-1"
                  size={18}
                />

                {/* DYNAMIC */}
                <p className="text-slate-600 leading-7">
                  {finalAddress}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Bottom Footer */}
        <div className="mt-16 py-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-5">

          <p className="text-slate-500 text-sm text-center md:text-left">
            © 2026 {getValue("Company", "Company Name") || "Human Biosis Pvt Ltd"}.
            All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm">

            <Link
              href="/"
              className="text-slate-500 hover:text-violet-600 transition"
            >
              Privacy Policy
            </Link>

            <Link
              href="/"
              className="text-slate-500 hover:text-violet-600 transition"
            >
              Terms & Conditions
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
}