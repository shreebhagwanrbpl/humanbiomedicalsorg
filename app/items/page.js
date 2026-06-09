"use client";
import toast, { Toaster } from "react-hot-toast";
import { useRouter }
<<<<<<< HEAD
  from "next/navigation";


=======
from "next/navigation";
>>>>>>> b0e26621ec997ee8adf3ecdbc4d4f9ea39f9a135
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

<<<<<<< HEAD
export default function ItemsPage({ city, }) {
=======

export default function ItemsPage({
  city
}) {
>>>>>>> b0e26621ec997ee8adf3ecdbc4d4f9ea39f9a135

  const router =
    useRouter();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] =
    useState("All");
    
  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [open, setOpen] = useState(false);

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  // ADD THESE STATES
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
<<<<<<< HEAD
  const basePath = city
    ? `/${city.toLowerCase().replace(/\s+/g, "-")}`
    : "";
=======

  const router =
  useRouter();

>>>>>>> b0e26621ec997ee8adf3ecdbc4d4f9ea39f9a135
  const [sending, setSending] = useState(false);
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
  // ADD THIS FUNCTION
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.message
    ) {

      toast.error("Please fill all fields");

      return;

    }

    try {

      setSending(true);

      await addDoc(
        collection(
          db,
          "websitesQueries",
          "humanbiomedicalsorg",
          "productQueries"
        ),
        {
          ...formData,

          productName: selectedProduct?.title || "",

          productImage:
            selectedProduct?.image || "",

          createdAt: serverTimestamp(),
        }
      );

      toast.success(
        "Enquiry Submitted Successfully"
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

      setOpen(false);

    } catch (err) {

      console.error(err);

      toast.error("Failed To Submit");

    } finally {

      setSending(false);

    }

  };
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

<<<<<<< HEAD
  const startIndex =
    (currentPage - 1) * productsPerPage;
  useEffect(() => {
    setVisible(8);
  }, [search, activeCategory]);
  if (loading) return null;
=======
  // if (loading) return null;
  if (loading)
  return (
    <div className="h-screen flex items-center justify-center text-2xl font-bold">
      Loading Products...
    </div>
  );
>>>>>>> b0e26621ec997ee8adf3ecdbc4d4f9ea39f9a135

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
<<<<<<< HEAD
              Human Biomedical LLP
=======
              Human Biomedicals
>>>>>>> b0e26621ec997ee8adf3ecdbc4d4f9ea39f9a135
            </span>
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
          </div>

          {/* Search */}
          <div className="mt-14 max-w-2xl mx-auto">
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

          </div>

          {/* Categories */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">

            {categories.map((item) => (
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
            ))}

          </div>

        </div>

      </section>

      {/* FEATURED PRODUCT */}
      {featuredProduct && (
        <section className="pb-24">

          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

            <div className="grid lg:grid-cols-2 gap-16 items-center bg-white rounded-[40px] border border-slate-200 shadow-2xl overflow-hidden">

              {/* Image */}
              <div className="relative h-full">

                <img
                  src={
                    featuredProduct.image ||
                    "/placeholder.jpg"
                  }
                  alt={featuredProduct.title}
                  className="w-full h-[500px] object-cover"
                />

              </div>

              {/* Content */}
              <div className="p-10 lg:p-14">

                <span className="inline-flex rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
                  Featured Product
                </span>

                <h2 className="mt-8 text-4xl sm:text-5xl font-bold leading-tight text-slate-900">
                  {featuredProduct.title}
                </h2>

                <p className="mt-8 text-lg leading-9 text-slate-600">
                  {featuredProduct.desc}
                </p>

                {/* Buttons */}
                <div className="mt-10 flex flex-wrap gap-4">

                  {/* Enquiry Modal Button */}
                  <button
                    onClick={() => {
                      setSelectedProduct(featuredProduct);
                      setOpen(true);
                    }}
                    className="bg-gradient-to-r from-violet-600 to-sky-500 text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:scale-105 transition duration-300 shadow-xl"
                  >
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
      )}

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

<<<<<<< HEAD
            {visibleProducts.map((item, index) => (

              <motion.div
=======
            {filteredProducts.map((item, index) => (
                <motion.div
>>>>>>> b0e26621ec997ee8adf3ecdbc4d4f9ea39f9a135
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
<<<<<<< HEAD
                    Human Biomedical LLP
                  </p>

                  <p >
                    Product: {item.title}
                  </p>
                  <p>
                    Brand:  {item.brand}
                  </p>
                  <p>
                    Throughput:  {item.throughput}
                  </p>

=======
                    Human Biomedicals
                  </p>
                  <h3 className="mt-3 text-2xl font-bold leading-snug text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-2">
                  Buy {item.title} in {city},
                  best laboratory and hospital
                  equipment supplier in {city}.
                </p>
                
>>>>>>> b0e26621ec997ee8adf3ecdbc4d4f9ea39f9a135
                  {/* Buttons */}
                  <div className="mt-7 flex items-center justify-between">
                    {/* ENQUIRY */}
                    <button
                      onClick={() => {
                        setSelectedProduct(item);
                        setOpen(true);
                      }}
                      className="bg-slate-900 text-white px-5 py-3 rounded-full font-semibold hover:bg-violet-600 transition duration-300"
                    >
                      Enquiry
                    </button>

                    {/* DETAILS */}
                    <button className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:text-violet-600 hover:border-violet-400 transition duration-300">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
<<<<<<< HEAD

              </motion.div>

=======
              </motion.div>
>>>>>>> b0e26621ec997ee8adf3ecdbc4d4f9ea39f9a135
            ))}

          </div>
          {visible < filteredProducts.length && (
            <button
              onClick={() => setVisible(prev => prev + 8)}
              className="mt-10 px-8 py-3 bg-violet-600 text-white rounded-full"
            >
              Load More
            </button>
          )}
        </div>

      </section>

      {/* CTA STRIP */}
      <section className="pb-28">

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

          <div className="rounded-[40px] bg-gradient-to-r from-violet-600 to-sky-500 px-8 py-16 lg:px-20 flex flex-col lg:flex-row items-center justify-between gap-10">

            <div className="max-w-3xl">

              <h2 className="text-4xl sm:text-5xl font-bold leading-tight text-white">
                Looking For Healthcare Equipment?
              </h2>

              <p className="mt-6 text-lg leading-9 text-white/90">
<<<<<<< HEAD
                Contact Human Biomedical LLP for laboratory instruments,
=======
                Contact Human Biomedicals for laboratory instruments,
>>>>>>> b0e26621ec997ee8adf3ecdbc4d4f9ea39f9a135
                diagnostic systems, pathology devices,
                and hospital equipment solutions.
              </p>

            </div>

            <button
              onClick={() =>
                router.push(`${basePath}/contact`)
              }
              className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:scale-105 transition duration-300 whitespace-nowrap"
            >
              Send Product Enquiry
            </button>

          </div>

        </div>

      </section>

      {/* PREMIUM SIDE MODAL */}
      {open && (
        <div className="fixed inset-0 z-[999]">

          {/* Overlay */}
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          ></div>

          {/* Side Panel */}
          <div className="absolute right-0 top-0 h-full w-full max-w-lg max-w-xl bg-white shadow-2xl overflow-y-auto">

            {/* Top Gradient */}
            <div className="h-2 w-full bg-gradient-to-r from-violet-600 to-sky-500"></div>

            {/* Content */}
            <div className="p-8 lg:p-10">

              {/* Top */}
              <div className="flex items-start justify-between gap-5">

                <div>
                  <span className="inline-flex rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
                    Product Enquiry
                  </span>

                  <h2 className="mt-6 text-4xl font-bold text-slate-900 leading-tight">
                    Let’s Discuss Your Requirements
                  </h2>
                </div>

                {/* Close */}
                <button
                  onClick={() => setOpen(false)}
                  className="w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
                >
                  <X size={20} />
                </button>

              </div>

              {/* Description */}
              <p className="mt-8 text-lg leading-8 text-slate-600">
<<<<<<< HEAD
                Contact Human Biomedical LLP for premium laboratory
=======
                Contact Human Biomedicals for premium laboratory
>>>>>>> b0e26621ec997ee8adf3ecdbc4d4f9ea39f9a135
                instruments, pathology systems, diagnostic devices,
                hospital equipment, and healthcare technology solutions.
              </p>

              {/* Selected Product */}
              {selectedProduct && (
                <div className="mt-8 flex gap-4 rounded-3xl border border-slate-200 p-4 bg-slate-50">

                  {/* Image */}
                  <img
                    src={
                      selectedProduct.image ||
                      "/placeholder.jpg"
                    }
                    alt={selectedProduct.title}
                    className="w-28 h-28 rounded-2xl object-cover shrink-0"
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">

                    <p className="text-xs font-semibold uppercase tracking-widest text-violet-600">
                      {selectedProduct.instrument || "Medical"}
                    </p>

                    <h3 className="mt-2 text-2xl font-bold text-slate-900 leading-tight">
                      {selectedProduct.title}
                    </h3>

                    <div className="mt-3 inline-flex px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold">
<<<<<<< HEAD
                      Human Biomedical LLP
=======
                      Human Biomedicals
>>>>>>> b0e26621ec997ee8adf3ecdbc4d4f9ea39f9a135
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-2">
                      {selectedProduct.desc}
                    </p>

                  </div>

                </div>
              )}

              {/* Form */}
              <div className="mt-10 space-y-5">


                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:border-violet-500"
                />


                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:border-violet-500"
                />


                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:border-violet-500"
                />


                <textarea
                  rows="5"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your requirement..."
                  className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:border-violet-500"
                ></textarea>


                <button
                  onClick={handleSubmit}
                  disabled={sending}
                  className="w-full bg-gradient-to-r from-violet-600 to-sky-500 text-white py-4 rounded-2xl font-semibold hover:scale-[1.01] transition duration-300 disabled:opacity-70"
                >
                  {sending ? "Submitting..." : "Submit Enquiry"}
                </button>

              </div>

            </div>

          </div>

        </div>
      )}
    </main>
  );
}