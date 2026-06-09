"use client";
import toast, { Toaster } from "react-hot-toast";
import { useRouter, usePathname }
  from "next/navigation";




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
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { db } from "@/firebase";

const categories = [
  "All",
  "Laboratory",
  "Hospital",
  "Diagnostic",
  "Pathology",
];

export default function ItemsPage({ city, }) {


  const router =
    useRouter();
  const pathname = usePathname();

  const pathParts = pathname.split("/");

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
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] =
    useState("All");


  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const basePath =
    district
      ? `/${district}`
      : "";

  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 10;
  const [visible, setVisible] = useState(8);

  // FETCH PRODUCTS FROM FIREBASE
  useEffect(() => {

    const fetchProducts = async () => {

      try {

        // CACHE CHECK
        const cacheKey =
          "products_cache";

        const cached =
          localStorage.getItem(
            cacheKey
          );

        if (cached) {

          setProducts(
            JSON.parse(cached)
          );
          setLoading(false);
          return;
        }
        // FIREBASE CALL
        const snap = await getDoc(
          doc(
            db,
            "websites",
            "humanbiomedicalsorg",
            "pages",
            "products"
          )
        );
        if (snap.exists()) {
          const data =
            snap.data().products || [];
          const publishedProducts =
            data.filter(
              (item) =>
                item.isPublished
            );
          // SET PRODUCTS
          setProducts(
            publishedProducts
          );
          // SAVE CACHE
          localStorage.setItem(
            cacheKey,
            JSON.stringify(
              publishedProducts
            )
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

  }, []);

  // FILTER PRODUCTS
  const filteredProducts = products.filter((item) => {

    const matchSearch = item.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      activeCategory === "All" ||
      item.instrument === activeCategory;

    return matchSearch && matchCategory;

  });
  const visibleProducts =
    filteredProducts.slice(0, visible);
  // FEATURED PRODUCT
  const featuredProduct =
    products.length > 0 ? products[0] : null;
  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );


  const startIndex =
    (currentPage - 1) * productsPerPage;
  useEffect(() => {
    setVisible(8);
  }, [search, activeCategory]);
  if (loading) return null;


  return (

    <main className="relative overflow-hidden bg-white">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context":
              "https://schema.org",
            "@type":
              "MedicalEquipmentSupplier",
            name:
              "Human Biomedicals",
            url:
              "https://humanbiomedicals.org",
            areaServed:
              city,
            description:
              `Medical laboratory and hospital equipment in ${city}`,
            address: {
              "@type":
                "PostalAddress",
              addressLocality:
                city,
              addressCountry:
                "India"
            }
          })
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
      {/* TOP HERO */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-violet-100 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-100 blur-3xl rounded-full"></div>
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <span className="inline-flex items-center rounded-full bg-violet-100 px-5 py-2 text-sm font-semibold text-violet-700">

              Human Biomedicals LLP

            </span >
            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mt-8 text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight text-slate-900"
            >
              {city
                ? `Buy Medical Laboratory Equipment in ${city} | Hospital & Diagnostic Devices`
                : "Medical Laboratory & Hospital Equipment in India"}
            </motion.h1>
            <p className="mt-8 text-lg sm:text-xl leading-9 text-slate-600">
              Premium laboratory instruments, diagnostic systems,
              hospital machines, pathology devices,
              and healthcare technology solutions
              {city ? ` in ${city}` : ""}.
            </p>
          </div >

          {/* Search */}
          < div className="mt-14 max-w-2xl mx-auto" >
            <div className="bg-white border border-slate-200 rounded-full shadow-xl px-6 py-5 flex items-center">
              <Search size={22} className="text-slate-400" />

              <input
                type="text"
                placeholder="Search medical equipment..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="ml-4 w-full outline-none bg-transparent text-slate-700 placeholder:text-slate-400"
              />

            </div>

          </div >

          {/* Categories */}
          < div className="mt-10 flex flex-wrap justify-center gap-4" >

            {
              categories.map((item) => (
                <button
                  key={item}
                  onClick={() =>
                    setActiveCategory(item)
                  }
                  className={`px-6 py-3 rounded-full font-semibold transition duration-300 ${activeCategory === item
                    ? "bg-slate-900 text-white"
                    : "bg-white border border-slate-200 text-slate-700 hover:border-violet-400"
                    }`}
                >
                  {item}
                </button>
              ))
            }

          </div >

        </div >

      </section >

      {/* FEATURED PRODUCT */}
      {
        featuredProduct && (
          <section className="pb-24">

            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

              <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center bg-white rounded-[24px] lg:rounded-[40px] border border-slate-200 shadow-2xl overflow-hidden">

                {/* Image */}
                <div className="relative h-full">

                  <img
                    src={
                      featuredProduct.image ||
                      "/placeholder.jpg"
                    }
                    alt={featuredProduct.title}
                    className="w-full h-[250px] sm:h-[350px] lg:h-[500px] object-cover"
                  />

                </div>

                {/* Content */}
                <div className="p-5 sm:p-8 lg:p-14">

                  <span className="inline-flex rounded-full bg-violet-100 px-3 py-2 text-xs sm:text-sm font-semibold text-violet-700">
                    Featured Product
                  </span>

                  <h2 className="mt-4 lg:mt-8 text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight text-slate-900 break-words">
                    {featuredProduct.title}
                  </h2>

                  <p className="mt-4 lg:mt-8 text-sm sm:text-base lg:text-lg leading-7 lg:leading-9 text-slate-600">
                    {featuredProduct.desc}
                  </p>

                  {/* Buttons */}
                  <div className="mt-6 lg:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">

                    {/* Enquiry Modal Button */}
                    <button
                      onClick={() => {
                        const slug = featuredProduct.title
                          .toLowerCase()
                          .replace(/[^a-z0-9\s-]/g, "")
                          .replace(/\s+/g, "-");

                        router.push(`${basePath}/items/${slug}`);
                      }}
                      className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-sky-500 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold flex items-center justify-center gap-2 hover:scale-105 transition duration-300 shadow-xl">
                      Send Enquiry
                      <ArrowRight size={18} />
                    </button>

                    {/* View Details */}
                    {/* <button
                    className="border border-slate-300 bg-white px-8 py-4 rounded-full font-semibold text-slate-700 hover:border-violet-500 hover:text-violet-600 transition"
                  >
                    View Details
                  </button> */}

                  </div>

                </div>

              </div>

            </div>

          </section>
        )
      }

      {/* PRODUCTS */}
      <section className="pb-24">

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

          <div className="flex items-center justify-between flex-wrap gap-5 mb-14">

            <div>
              <h2 className="text-4xl font-bold text-slate-900">
                Our Products
              </h2>

              <p className="mt-3 text-slate-600">
                Premium medical and healthcare equipment solutions.
              </p>
            </div>

          </div>

          {/* PRODUCTS GRID */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">


            {visibleProducts.map((item, index) => (
              <motion.div

                key={item.id || index}
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
                className="group bg-white rounded-[30px] overflow-hidden border border-slate-200 shadow-lg hover:shadow-2xl transition duration-500"
              >

                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={
                      item.image ||
                      "/placeholder.jpg"
                    }
                    alt={`${item.title} in ${city} | Human Biomedicals`}
                    className="w-full h-[260px] object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-lg px-4 py-2 rounded-full text-xs font-semibold text-slate-800">
                    {item.instrument || "Medical"}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-violet-600 font-semibold uppercase tracking-widest text-xs">

                    Human Biomedicals
                  </p>
                  <h6 className="mt-3 text-2xl font-bold leading-snug text-slate-900">
                    Product: {item.title}
                  </h6>
                  {/* <p className="text-sm text-slate-500 mt-2">
                    Buy {item.title} in {district},
                    best laboratory and hospital
                    equipment supplier in {district}.
                  </p> */}
                  <p className="text-sm text-slate-500 mt-2">
                    Throughput: {item.throughput}
                  </p>
                  <p className="text-sm text-slate-500 mt-2">
                    Model: {item.model}
                  </p>


                  {/* Buttons */}
                  < div className="mt-7 flex items-center justify-between" >
                    {/* ENQUIRY */}

                    <button
                      onClick={() =>
                        router.push(
                          `${basePath}/items/${item.title
                            .toLowerCase()
                            .replace(/[^a-z0-9\s-]/g, "")
                            .replace(/\s+/g, "-")}`
                        )
                      }
                      className="bg-slate-900 text-white px-5 py-3 rounded-full font-semibold hover:bg-violet-600 transition duration-300"
                    >
                      Enquiry
                    </button>

                  </div >
                </div >


              </motion.div >

            ))
            }

          </div >
          {
            visible < filteredProducts.length && (
              <button
                onClick={() => setVisible(prev => prev + 8)}
                className="mt-10 px-8 py-3 bg-violet-600 text-white rounded-full"
              >
                Load More
              </button>
            )
          }
        </div >

      </section >

      {/* CTA STRIP */}
      < section className="pb-28" >

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

          <div className="rounded-[40px] bg-gradient-to-r from-violet-600 to-sky-500 px-8 py-16 lg:px-20 flex flex-col lg:flex-row items-center justify-between gap-10">

            <div className="max-w-3xl">

              <h2 className="text-4xl sm:text-5xl font-bold leading-tight text-white">
                Looking For Healthcare Equipment?
              </h2>

              <p className="mt-6 text-lg leading-9 text-white/90">

                Contact Human Biomedicals LLP for laboratory instruments,

                diagnostic systems, pathology devices,
                and hospital equipment solutions.
              </p >

            </div >

            <button
              onClick={() =>
                router.push(`${basePath}/contact`)
              }
              className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:scale-105 transition duration-300 whitespace-nowrap"
            >
              Send Product Enquiry
            </button>

          </div >

        </div >

      </section >

    </main >
  );
}