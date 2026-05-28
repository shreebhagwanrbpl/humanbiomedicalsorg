"use client";

import Link from "next/link";

import { motion } from "framer-motion";

import {
  Menu,
  X,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  usePathname,
} from "next/navigation";

export default function Navbar() {

  const [open, setOpen] =
    useState(false);

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

  const navLinks = [
    {
      name: "Home",
      href: `${basePath}/`,
      keyword:
        "premium business website",
    },

    {
      name: "About",
      href: `${basePath}/about`,
      keyword:
        "enterprise business solutions",
    },

    {
      name: "Products",
      href: `${basePath}/items`,
      keyword:
        "premium business products",
    },

    {
      name: "Services",
      href: `${basePath}/services`,
      keyword:
        "seo optimized services",
    },

    {
      name: "Contact",
      href: `${basePath}/contact`,
      keyword:
        "contact premium company",
    },
  ];

  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-200/60">

      <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-6 lg:px-8 py-4">

        {/* Logo */}
        <Link
          href={`${basePath}/`}
          className="text-2xl sm:text-3xl font-bold tracking-tight"
        >

          <span className="bg-gradient-to-r from-violet-600 to-sky-500 bg-clip-text text-transparent">
            Human Biomedical
          </span>

        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">

          {navLinks.map((link) => (

            <Link
              key={link.name}
              href={link.href}
              aria-label={
                link.keyword
              }
              className="text-slate-700 font-medium hover:text-violet-600 transition duration-300"
            >
              {link.name}
            </Link>

          ))}

          {/* CTA Button */}
          <Link
            href={`${basePath}/contact`}
            className="bg-gradient-to-r from-violet-600 to-sky-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition duration-300"
          >
            Get Started
          </Link>

        </div>

        {/* Mobile Button */}
        <button
          onClick={() =>
            setOpen(!open)
          }
          className="md:hidden text-slate-800"
          aria-label="Open Navigation Menu"
        >

          {open
            ? <X size={30} />
            : <Menu size={30} />}

        </button>

      </nav>

      {/* Mobile Menu */}
      {open && (

        <motion.div
          initial={{
            opacity: 0,
            y: -25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
          }}
          className="md:hidden glass border-t border-slate-200/50"
        >

          <div className="flex flex-col px-6 py-6 gap-5">

            {navLinks.map((link) => (

              <Link
                key={link.name}
                href={link.href}
                aria-label={
                  link.keyword
                }
                onClick={() =>
                  setOpen(false)
                }
                className="text-slate-700 text-lg font-medium hover:text-violet-600 transition"
              >
                {link.name}
              </Link>

            ))}

            <Link
              href={`${basePath}/contact`}
              onClick={() =>
                setOpen(false)
              }
              className="bg-gradient-to-r from-violet-600 to-sky-500 text-white text-center py-3 rounded-full font-semibold mt-2"
            >
              Contact Our Team
            </Link>

          </div>

        </motion.div>

      )}

    </header>
  );
}