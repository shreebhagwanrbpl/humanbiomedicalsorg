"use client";

import toast, { Toaster } from "react-hot-toast";
import { useRouter, usePathname } from "next/navigation";
import { ChevronUp } from "lucide-react";

import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { motion } from "framer-motion";

import {
  Search,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  X,
} from "lucide-react";

import {
  useState,
  useEffect,
  useMemo,
} from "react";

import { db } from "@/firebase";

const makeSlug = (text = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");



const getCategory = (item) => {

  const title =
    (item.title || "")
      .toLowerCase();

  if (title.includes("rapid"))
    return "Rapid Test Kits";

  if (title.includes("elisa"))
    return "ELISA Kits";

  if (title.includes("electrolyte"))
    return "Electrolyte Reagents";

  if (title.includes("hematology"))
    return "Hematology";

  if (title.includes("biochemistry"))
    return "Biochemistry";

  if (title.includes("immuno"))
    return "Immunoassay";

  return "Other Products";

};

export default function ItemsPage({
  city,
}) {

  const router =
    useRouter();

  const pathname =
    usePathname();

  const pathParts =
    pathname.split("/");

  const district =
    pathParts[1] &&
    ![
      "about",
      "items",
      "services",
      "contact",
    ].includes(
      pathParts[1]
    )
      ? pathParts[1]
      : "";

  const basePath =
    district
      ? `/${district}`
      : "";

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [openedCategory, setOpenedCategory] =
    useState("");

  const [activeCategory, setActiveCategory] =
    useState("");

  const [pendingScroll, setPendingScroll] =
    useState(null);

  const [visible, setVisible] =
    useState(12);

  const [currentPage, setCurrentPage] =
    useState(1);

    

        const [showTopButton, setShowTopButton] = useState(false);

  const productsPerPage = 10;

  
const scrollToTop = () => {

  window.scrollTo({

    top: 0,

    behavior: "smooth",

  });

};


  // ================================
// FIREBASE FETCH
// ================================

useEffect(() => {

  const fetchProducts =
    async () => {

      try {

        const cacheKey =
          "products_cache";

        const cached =
          localStorage.getItem(
            cacheKey
          );

        if (cached) {

          const cacheData =
            JSON.parse(
              cached
            ).map(
              (
                item,
                index
              ) => ({

                ...item,

                uid:
                  index,

                slug:
                  item.slug ||
                  makeSlug(
                    item.title
                  ),

                category:
                  item.category ||
                  getCategory(
                    item
                  ),

              })
            );

          setProducts(
            cacheData
          );

          setLoading(
            false
          );

          return;

        }

        const snap =
          await getDoc(
            doc(
              db,
              "websites",
              "humanbiomedicalsorg",
              "pages",
              "products"
            )
          );

        if (
          snap.exists()
        ) {

          const data =
            snap.data()
              ?.products ||
            [];

          const published =
            data
              .filter(
                (
                  item
                ) =>
                  item.isPublished
              )
              .map(
                (
                  item,
                  index
                ) => ({

                  ...item,

                  uid:
                    index,

                  slug:
                    item.slug ||
                    makeSlug(
                      item.title
                    ),

                  category:
                    item.category ||
                    getCategory(
                      item
                    ),

                })
              );

          setProducts(
            published
          );

          localStorage.setItem(
            cacheKey,
            JSON.stringify(
              published
            )
          );

        }

      } catch (err) {

        console.log(
          err
        );

      } finally {

        setLoading(
          false
        );

      }

    };

  fetchProducts();

}, []);





// =======================================
// FILTER + GROUP + ACCORDION
// =======================================

const filteredProducts =
  useMemo(() => {

    return products.filter(
      (item) => {

        const text = `
          ${item.title}
          ${item.brand}
          ${item.model}
          ${item.instrument}
          ${item.category}
        `.toLowerCase();

        return text.includes(
          search.toLowerCase()
        );

      }
    );

  }, [products, search]);

const groupedProducts =
  useMemo(() => {

    const obj = {};

    filteredProducts.forEach(
      (item) => {

        if (
          !obj[item.category]
        ) {

          obj[item.category] =
            [];

        }

        obj[item.category].push(
          item
        );

      }
    );

    return obj;

  }, [filteredProducts]);

const categories =
  Object.keys(
    groupedProducts
  );

const visibleGrouped =
  useMemo(() => {

    const obj = {};

    Object.entries(
      groupedProducts
    ).forEach(
      ([key, value]) => {

        obj[key] =
          value.slice(
            0,
            visible
          );

      }
    );

    return obj;

  }, [
    groupedProducts,
    visible,
  ]);

const featuredProduct =
  products.length > 0
    ? products[0]
    : null;

// =======================================
// ACCORDION
// =======================================

const toggleCategory = (
  category
) => {

  if (
    openedCategory ===
    category
  ) {

    setOpenedCategory("");

    return;

  }

  setOpenedCategory(
    category
  );

};

const scrollToProduct = (
  slug,
  category
) => {

  setPendingScroll(
    slug
  );

  setOpenedCategory(
    category
  );

  setActiveCategory(
    category
  );

};

useEffect(() => {

  if (
    !pendingScroll
  )
    return;

  const timer =
    setTimeout(() => {

      const el =
        document.getElementById(
          pendingScroll
        );

      if (el) {

        el.scrollIntoView({

          behavior:
            "smooth",

          block:
            "start",

        });

      }

      setPendingScroll(
        null
      );

    }, 350);

  return () =>
    clearTimeout(
      timer
    );

}, [
  openedCategory,
  pendingScroll,
]);

useEffect(() => {

  setVisible(12);

}, [search]);

useEffect(() => {

  const handleScroll = () => {

    if (window.scrollY > 400) {

      setShowTopButton(true);

    } else {

      setShowTopButton(false);

    }

  };

  window.addEventListener(
    "scroll",
    handleScroll
  );

  return () =>
    window.removeEventListener(
      "scroll",
      handleScroll
    );

}, []);



return (

  <main className="relative overflow-hidden bg-white">

    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MedicalEquipmentSupplier",
          name: "Human Biomedicals",
          url: "https://humanbiomedicals.org",
          areaServed: city,
          description: `Medical laboratory and hospital equipment in ${city}`,
          address: {
            "@type": "PostalAddress",
            addressLocality: city,
            addressCountry: "India",
          },
        }),
      }}
    />

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

      <div className="absolute top-0 left-0 w-96 h-96 bg-violet-100 blur-3xl rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-100 blur-3xl rounded-full"></div>

      <div className="max-w-7xl mx-auto px-5 relative z-10">

        <div className="text-center max-w-5xl mx-auto">

          <span className="inline-flex items-center rounded-full bg-violet-100 px-5 py-2 text-sm font-semibold text-violet-700">

            Human Biomedicals LLP

          </span>

          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .7 }}
            className="mt-8 text-5xl lg:text-7xl font-bold leading-tight"
          >

            {city
              ? `Buy Medical Laboratory Equipment in ${city}`
              : "Medical Laboratory Equipment"}

          </motion.h1>

          <p className="mt-8 text-xl text-slate-600 leading-9">

            Premium laboratory instruments,
            diagnostic systems and hospital equipment.

          </p>

        </div>

      </div>

    </section>

    {/* FEATURED */}

    {/* {featuredProduct && !search && (

      <section className="pb-24">

        <div className="max-w-7xl mx-auto px-5">

          <div className="grid lg:grid-cols-2 gap-14 bg-white rounded-[40px] border shadow-2xl overflow-hidden">

            <div>

              <img
                src={
                  featuredProduct.image ||
                  "/placeholder.jpg"
                }
                alt={featuredProduct.title}
                className="w-full h-[420px] object-contain p-8"
              />

            </div>

            <div className="p-14">

              <span className="inline-flex rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">

                Featured Product

              </span>

              <h2 className="mt-8 text-5xl font-bold">

                {featuredProduct.title}

              </h2>

              <p className="mt-8 text-lg text-slate-600 leading-9">

                {featuredProduct.desc}

              </p>

              <button
                onClick={() =>
                  router.push(
                    `${basePath}/items/${featuredProduct.slug}`
                  )
                }
                className="mt-10 bg-gradient-to-r from-violet-600 to-sky-500 text-white px-8 py-4 rounded-full font-semibold flex items-center gap-3"
              >

                Send Enquiry

                <ArrowRight size={18} />

              </button>

            </div>

          </div>

        </div>

      </section>

    )} */}

    {/* PRODUCTS */}
   
    <section className="pb-24">

      <div className="max-w-7xl mx-auto px-5">

        <div className="grid lg:grid-cols-[320px_1fr] gap-10 items-start">

                    {/* ===========================
                LEFT SIDEBAR
          =========================== */}
<div className="self-start"> 
  
                  <aside
                    className="
                      sticky
                      top-24
                      h-[calc(100vh-120px)]
                      overflow-y-auto
                      bg-white
                      rounded-[30px]
                      border
                      border-slate-200
                      shadow-xl
                      p-6
                  "
                  >
            <h3 className="text-2xl font-bold mb-5">

              Categories

            </h3>

            <div className="relative">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search Product..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-300 outline-none focus:border-violet-500"
              />

            </div>

            <div className="mt-6 space-y-3">

              {categories.map((category) => (

                <div
                  key={category}
                  className="border border-slate-200 rounded-2xl overflow-hidden"
                >

                  <button
                    onClick={() =>
                      toggleCategory(category)
                    }
                    className={`w-full flex justify-between items-center px-5 py-4 transition-all

                    ${
                      activeCategory === category
                        ? "bg-gradient-to-r from-violet-600 to-sky-500 text-white"
                        : "bg-white hover:bg-slate-50"
                    }`}
                  >

                    <span className="flex items-center gap-3">

                      {openedCategory === category ? (

                        <ChevronDown size={18} />

                      ) : (

                        <ChevronRight size={18} />

                      )}

                      {category}

                    </span>

                    <span className="text-sm font-semibold">

                      {
                        groupedProducts[
                          category
                        ].length
                      }

                    </span>

                  </button>

                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{
                      maxHeight:
                        openedCategory === category
                          ? groupedProducts[
                              category
                            ].length *
                            48
                          : 0,
                    }}
                  >

                    {groupedProducts[
                      category
                    ].map((item) => (

                      <button
                        key={item.uid}
                        onClick={() =>
                          scrollToProduct(
                            item.slug,
                            category
                          )
                        }
                        className="block w-full text-left px-6 py-3 border-t border-slate-100 hover:bg-slate-50 transition"
                      >

                        {item.title}

                      </button>

                    ))}

                  </div>

                </div>

              ))}

            </div>

          </aside>

          </div>


          {/* ===========================
                RIGHT SIDE
          =========================== */}

        <div className="space-y-12">

                        {Object.entries(
              visibleGrouped
            ).map(
              ([category, list]) => (

                <section
                  key={category}
                  id={category
                    .replace(/\s+/g, "-")
                    .toLowerCase()}
                >

                  {/* CATEGORY HEADER */}

                  <div className="flex items-center justify-between border-b border-slate-200 pb-5 mb-8">

                    <h2 className="text-3xl font-bold text-slate-900">

                      {category}

                    </h2>

                    <span className="text-slate-500 font-medium">

                      {list.length} Products

                    </span>

                  </div>

                  <div className="space-y-6">

                    {list.map((item) => (

                      <div
                        key={item.uid}
                        id={item.slug}
                        className="bg-white rounded-[32px] border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 p-8"
                      >

                        <div className="grid lg:grid-cols-[240px_1fr_180px] gap-8 items-center">

                          {/* IMAGE */}

                          <div className="bg-slate-50 rounded-3xl h-[220px] flex items-center justify-center">

                            <img
                              src={
                                item.image ||
                                "/placeholder.jpg"
                              }
                              alt={item.title}
                              className="max-h-[180px] object-contain"
                            />

                          </div>

                          {/* CONTENT */}

                          <div>

                            <h3 className="text-2xl font-bold text-slate-900">

                              {item.title}

                            </h3>

                            <p className="mt-4 text-slate-600 leading-8">

                              {item.desc ||
                                item.description ||
                                "Premium laboratory and diagnostic equipment for hospitals and healthcare institutions."}

                            </p>

                            <div className="grid md:grid-cols-2 gap-4 mt-6">

                              <div className="bg-slate-50 rounded-xl p-4">

                                <p className="text-xs uppercase text-slate-400">

                                  Brand

                                </p>

                                <p className="font-semibold mt-1">

                                  {item.brand || "-"}

                                </p>

                              </div>

                              <div className="bg-slate-50 rounded-xl p-4">

                                <p className="text-xs uppercase text-slate-400">

                                  Model

                                </p>

                                <p className="font-semibold mt-1">

                                  {item.model || "-"}

                                </p>

                              </div>

                              <div className="bg-slate-50 rounded-xl p-4">

                                <p className="text-xs uppercase text-slate-400">

                                  Instrument

                                </p>

                                <p className="font-semibold mt-1">

                                  {item.instrument || "-"}

                                </p>

                              </div>

                              <div className="bg-slate-50 rounded-xl p-4">

                                <p className="text-xs uppercase text-slate-400">

                                  Throughput

                                </p>

                                <p className="font-semibold mt-1">

                                  {item.throughput || "-"}

                                </p>

                              </div>

                            </div>

                          </div>

                          {/* BUTTON */}

                          <div className="flex justify-center lg:justify-end">

                            <button
                              onClick={() =>
                                router.push(
                                  `${basePath}/items/${item.slug}`
                                )
                              }
                              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-sky-500 text-white font-semibold hover:scale-105 transition-all duration-300 whitespace-nowrap"
                            >

                              View Details

                            </button>

                          </div>

                        </div>

                      </div>

                    ))}

                  </div>

                </section>

              )
            )}

                      </div>

        </div>

        {/* LOAD MORE */}

        {visible < filteredProducts.length && (

          <div className="flex justify-center mt-14">

            <button
              onClick={() =>
                setVisible((prev) => prev + 12)
              }
              className="px-10 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-sky-500 text-white font-semibold shadow-xl hover:scale-105 transition-all duration-300"
            >

              Load More Products

            </button>

          </div>

        )}

      </div>

    </section>

    {/* CTA */}

    <section className="pb-28">

      <div className="max-w-7xl mx-auto px-5">

        <div className="rounded-[40px] bg-gradient-to-r from-violet-600 to-sky-500 px-10 py-16 lg:px-20 flex flex-col lg:flex-row items-center justify-between gap-10">

          <div className="max-w-3xl">

            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">

              Looking For Healthcare Equipment?

            </h2>

            <p className="mt-6 text-lg leading-9 text-white/90">

              Contact Human Biomedicals LLP for laboratory instruments,
              diagnostic systems, pathology devices and hospital
              equipment solutions.

            </p>

          </div>

          <button
            onClick={() =>
              router.push(
                `${basePath}/contact`
              )
            }
            className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:scale-105 transition duration-300 whitespace-nowrap"
          >

            Send Product Enquiry

          </button>

        </div>

      </div>

    </section>

    {/* BACK TO TOP */}

{showTopButton && (

  <button
    onClick={scrollToTop}
    className="fixed bottom-8 right-8 z-[999] w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-sky-500 text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300"
  >

    <ChevronUp size={26} />

  </button>

)}

  </main>

);
}