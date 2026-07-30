"use client";

import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";

import { usePathname } from "next/navigation";

import {
    FaPlay,
    FaShareAlt,
    FaWhatsapp,
    FaFacebook,
    FaInstagram,
    FaLink,
} from "react-icons/fa";

import {
    addDoc,
    collection,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { fetchFullCatalog } from "@/lib/data-fetcher";

export default function ProductDetails({ slug, product: initialProduct }) {
    const [product, setProduct] = useState(initialProduct || null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [selectedImage, setSelectedImage] = useState(() => {
        if (initialProduct) {
            return initialProduct.images?.length > 0 ? initialProduct.images[0] : (initialProduct.image || "");
        }
        return "";
    });
    const [selectedMedia, setSelectedMedia] = useState("image");
    const [showShare, setShowShare] = useState(false);
    const [loading, setLoading] = useState(!initialProduct);

    const shareRef = useRef();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const pathname = usePathname();

    const pathParts = pathname.split("/").filter(Boolean);
    const city = pathParts.length > 1 ? pathParts[0] : "India";
    const cityName = city.charAt(0).toUpperCase() + city.slice(1);

    useEffect(() => {
        if (initialProduct) {
            setProduct(initialProduct);
            setSelectedImage(initialProduct.images?.length > 0 ? initialProduct.images[0] : (initialProduct.image || ""));
            setSelectedMedia("image");
            setLoading(false);
            return;
        }

        const loadProduct = async () => {
            try {
                setLoading(true);
                const allProducts = await fetchFullCatalog();
                const found = allProducts.find((p) => p.slug === slug);

                setProduct(found || null);

                if (found) {
                    if (found.images?.length > 0) {
                        setSelectedImage(found.images[0]);
                    } else {
                        setSelectedImage(found.image || "");
                    }
                    setSelectedMedia("image");
                }
            } catch (error) {
                console.error("Error loading product details:", error);
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [slug, initialProduct]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const phoneRegex = /^[6-9]\d{9}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!form.name.trim()) {
            return toast.error("Name is required");
        }

        if (!emailRegex.test(form.email)) {
            return toast.error("Enter valid email");
        }

        if (!phoneRegex.test(form.phone)) {
            return toast.error("Enter valid mobile number");
        }

        try {
            setSubmitting(true);

            await addDoc(
                collection(
                    db,
                    "websitesQueries",
                    "humanbiomedicalsorg",
                    "productQueries"
                ),
                {
                    ...form,
                    productName: product.title,
                    productSlug: product.slug,
                    brand: product.brand || "",
                    model: product.model || "",
                    createdAt: new Date(),
                }
            );

            toast.success("Your enquiry has been submitted successfully.");

            setForm({
                name: "",
                email: "",
                phone: "",
            });
        } catch (error) {
            console.error("Error submitting query:", error);
            toast.error("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    const productSchema = product
        ? {
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.title,
            image: product.image ? [product.image] : [],
            description:
                product.desc ||
                product.description ||
                product.title,
            brand: {
                "@type": "Brand",
                name: product.brand || "Central Biomedicals",
            },
        }
        : null;

    const faqSchema = product
        ? {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
                {
                    "@type": "Question",
                    name: `What is ${product.title} used for?`,
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: `${product.title} is used in hospitals, pathology labs and diagnostic centres.`,
                    },
                },
                {
                    "@type": "Question",
                    name: "Do you provide installation support?",
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: "Yes, installation and technical support are available.",
                    },
                },
            ],
        }
        : null;

    const handleCopy = async () => {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link Copied");
        setShowShare(false);
    };

    const handleWhatsapp = () => {
        const shareText = `🔬 ${product?.title}\n\n${product?.desc || ""}\n\n🌐 ${window.location.href}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
    };

    const handleFacebook = () => {
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                window.location.href
            )}`,
            "_blank"
        );
    };

    const handleInstagram = async () => {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Instagram sharing is not directly supported. Link copied to clipboard!");
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.title,
                    text: product.desc || product.description,
                    url: window.location.href,
                });
            } catch (err) {
                console.log("Share failed:", err);
            }
        } else {
            setShowShare(!showShare);
        }
    };

    useEffect(() => {
        const close = (e) => {
            if (
                shareRef.current &&
                !shareRef.current.contains(e.target)
            ) {
                setShowShare(false);
            }
        };

        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    if (loading) {
        return (
            <section className="py-10 md:py-20 bg-slate-50">
                <div className="container-custom px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 animate-pulse">
                        <div className="h-[420px] md:h-[520px] rounded-[36px] bg-slate-200" />
                        <div>
                            <div className="h-12 w-3/4 bg-slate-200 rounded-xl mb-8" />
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-6 bg-slate-200 rounded-lg mb-4"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (!product) {
        return (
            <section className="py-10 md:py-20 bg-slate-50 text-center">
                <div className="container-custom px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-slate-800">Product Not Found</h2>
                    <p className="text-slate-600 mt-4">The requested product could not be located in our catalog.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-14 md:py-20 lg:py-24 bg-slate-50">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(productSchema),
                }}
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(faqSchema),
                }}
            />
            <div className="container-custom px-4 sm:px-6 lg:px-8">
                <div className="mb-10 text-sm text-slate-500">
                    Home / Products / {product.title}
                </div>

                <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-start">
                    {/* Product Image */}
                    <div>
                        <div className="relative h-[340px] sm:h-[420px] md:h-[500px] lg:h-[580px] rounded-[28px] md:rounded-[36px] overflow-hidden bg-white shadow-[0_25px_80px_rgba(0,0,0,0.12)]">
                            {selectedMedia === "video" && product.video ? (
                                <video
                                    controls
                                    autoPlay
                                    className="w-full h-full object-contain p-6"
                                >
                                    <source
                                        src={product.video}
                                        type="video/mp4"
                                    />
                                </video>
                            ) : (
                                <>
                                    {!imageLoaded && (
                                        <div className="absolute inset-0 bg-slate-100 animate-pulse" />
                                    )}

                                    <img
                                        src={selectedImage || product.image || "/placeholder.jpg"}
                                        alt={product.title}
                                        onLoad={() => setImageLoaded(true)}
                                        decoding="async"
                                        className={`w-full h-full object-contain p-4 transition duration-500 ${imageLoaded
                                            ? "opacity-100"
                                            : "opacity-0"
                                            }`}
                                        onError={(e) => {
                                            e.currentTarget.src = "/placeholder.jpg";
                                        }}
                                    />
                                </>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-4 mt-12">
                            {(product.images?.length
                                ? product.images
                                : [product.image || "/placeholder.jpg"]
                            ).map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setSelectedImage(img);
                                        setSelectedMedia("image");
                                    }}
                                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 relative ${selectedMedia === "image" &&
                                        selectedImage === img
                                        ? "border-sky-600"
                                        : "border-gray-200"
                                        }`}
                                >
                                    <img
                                        src={img}
                                        alt=""
                                        decoding="async"
                                        loading="lazy"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = "/placeholder.jpg";
                                        }}
                                    />
                                </button>
                            ))}

                            {product.video && (
                                <button
                                    onClick={() => setSelectedMedia("video")}
                                    className={`w-20 h-20 rounded-xl border-2 flex flex-col items-center justify-center ${selectedMedia === "video"
                                        ? "border-sky-600"
                                        : "border-gray-200"
                                        }`}
                                >
                                    <FaPlay size={20} />
                                    <span className="text-xs mt-1">Video</span>
                                </button>
                            )}

                            {product.pdf && (
                                <a
                                    href={product.pdf}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-20 h-20 rounded-xl border flex flex-col items-center justify-center hover:bg-slate-100"
                                >
                                    📄
                                    <span className="text-xs">PDF</span>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div>
                        <div className="flex justify-between items-start gap-6 relative mb-8">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-slate-900">
                                {product.title}
                            </h1>

                            <div
                                ref={shareRef}
                                className="relative"
                            >
                                <button
                                    onClick={handleNativeShare}
                                    className="w-12 h-12 rounded-full border bg-white shadow flex items-center justify-center hover:bg-slate-100"
                                >
                                    <FaShareAlt size={18} />
                                </button>

                                {showShare && (
                                    <div className="absolute right-0 top-14 w-56 bg-white rounded-xl shadow-xl border p-2 z-50">
                                        <button
                                            onClick={handleCopy}
                                            className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded flex items-center gap-2"
                                        >
                                            <FaLink />
                                            Copy Link
                                        </button>

                                        <button
                                            onClick={handleWhatsapp}
                                            className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded flex items-center gap-2"
                                        >
                                            <FaWhatsapp className="text-green-600" />
                                            WhatsApp
                                        </button>

                                        <button
                                            onClick={handleFacebook}
                                            className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded flex items-center gap-2"
                                        >
                                            <FaFacebook className="text-blue-600" />
                                            Facebook
                                        </button>

                                        <button
                                            onClick={handleInstagram}
                                            className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded flex items-center gap-2"
                                        >
                                            <FaInstagram className="text-pink-600" />
                                            Instagram
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-12 bg-white p-6 sm:p-8 md:p-10 rounded-[24px] md:rounded-[30px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] space-y-4 font-medium text-slate-700">
                            <p><b>Brand:</b> {product.brand || "N/A"}</p>
                            <p><b>Model:</b> {product.model || "N/A"}</p>
                            <p><b>Instrument:</b> {product.instrument || "N/A"}</p>
                            <p><b>Capacity:</b> {product.capacity || "N/A"}</p>
                            <p><b>Throughput:</b> {product.throughput || "N/A"}</p>
                            <p><b>Usage:</b> {product.usage || "N/A"}</p>
                            <p><b>Automation:</b> {product.automation || "N/A"}</p>
                            <p><b>Availability:</b> {product.availability || "N/A"}</p>
                        </div>
                    </div>
                </div>

                {/* Description + Form */}
                <div className="mt-20 lg:mt-24">
                    <div className="grid grid-cols-1 lg:grid-cols-[500px_1fr] xl:grid-cols-[600px_1fr] gap-8 xl:gap-12">
                        {/* Quote Form */}
                        <div className="bg-white rounded-[24px] md:rounded-[32px] p-6 sm:p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.08)] h-fit lg:sticky lg:top-24">
                            <h2 className="text-2xl md:text-3xl font-bold mb-2">
                                Request A Quote
                            </h2>

                            <p className="text-slate-500 mb-8">
                                Product:
                                <span className="font-semibold ml-2 text-slate-800">
                                    {product.title}
                                </span>
                            </p>

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            name: e.target.value,
                                        })
                                    }
                                    className="w-full bg-slate-100 rounded-xl md:rounded-2xl px-4 md:px-5 py-3 md:py-4 outline-none focus:ring-2 focus:ring-sky-600"
                                />

                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            email: e.target.value,
                                        })
                                    }
                                    className="w-full bg-slate-100 rounded-xl md:rounded-2xl px-4 md:px-5 py-3 md:py-4 outline-none focus:ring-2 focus:ring-sky-600"
                                />

                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    maxLength={10}
                                    value={form.phone}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            phone: e.target.value.replace(/\D/g, ""),
                                        })
                                    }
                                    className="w-full bg-slate-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-sky-600"
                                />

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-gradient-to-r from-sky-600 to-blue-700 text-white py-4 rounded-2xl font-semibold hover:opacity-90 transition"
                                >
                                    {submitting ? "Submitting..." : "Get Quote"}
                                </button>
                            </form>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-[24px] md:rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden">

                            {/* Description */}
                            <div className="p-6 sm:p-8 lg:p-10 xl:p-12">
                                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                                    Product Description
                                </h3>

                                <p className="text-slate-600 text-base md:text-lg leading-8 md:leading-9">
                                    {product.desc ||
                                        product.description ||
                                        "No description available."}
                                </p>
                            </div>

                            {/* Specifications */}
                            <div className="border-t border-slate-200">
                                <div className="px-6 sm:px-8 lg:px-10 xl:px-12 py-8">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-6">
                                        Technical Specifications
                                    </h3>

                                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                                        <table className="w-full text-left border-collapse">
                                            <tbody>

                                                <tr className="border-b">
                                                    <td className="w-1/3 bg-slate-50 px-6 py-5 font-semibold">
                                                        Brand
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        {product.brand || "N/A"}
                                                    </td>
                                                </tr>

                                                <tr className="border-b">
                                                    <td className="bg-slate-50 px-6 py-5 font-semibold">
                                                        Model
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        {product.model || "N/A"}
                                                    </td>
                                                </tr>

                                                <tr className="border-b">
                                                    <td className="bg-slate-50 px-6 py-5 font-semibold">
                                                        Usage
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        {product.usage || "N/A"}
                                                    </td>
                                                </tr>

                                                <tr className="border-b">
                                                    <td className="bg-slate-50 px-6 py-5 font-semibold">
                                                        Automation
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        {product.automation || "N/A"}
                                                    </td>
                                                </tr>

                                                <tr className="border-b">
                                                    <td className="bg-slate-50 px-6 py-5 font-semibold">
                                                        Capacity
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        {product.capacity || "N/A"}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td className="bg-slate-50 px-6 py-5 font-semibold">
                                                        Throughput
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        {product.throughput || "N/A"}
                                                    </td>
                                                </tr>

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>


                            {/* SEO Content */}
                            <div className="mt-20 space-y-12">

                                {[
                                    {
                                        title: `Why Choose Central Biomedicals in ${cityName}?`,
                                        content: `Central Biomedicals is a trusted supplier and distributor of ${product.title} in ${cityName}. We provide high-quality biomedical and laboratory equipment for hospitals, pathology laboratories, diagnostic centres and healthcare facilities with reliable products, competitive pricing and professional support.`
                                    },
                                    {
                                        title: `Features of ${product.title}`,
                                        content: `${product.title} offers reliable performance, accurate results, user-friendly operation, durable construction, low maintenance requirements and efficient workflow, making it an ideal choice for modern laboratories and healthcare institutions.`
                                    },
                                    {
                                        title: `Applications of ${product.title}`,
                                        content: `${product.title} is widely used in hospitals, pathology laboratories, diagnostic centres, blood banks, research institutes, educational laboratories and various healthcare facilities for accurate and dependable testing.`
                                    },
                                    {
                                        title: `${product.title} Supplier in ${cityName}`,
                                        content: `Central Biomedicals is a leading supplier of ${product.title} in ${cityName}. We provide quality products with installation assistance, technical guidance, after-sales support and prompt customer service.`
                                    },
                                    {
                                        title: `${product.title} Dealer in ${cityName}`,
                                        content: `As a trusted dealer of ${product.title} in ${cityName}, Central Biomedicals supplies premium biomedical equipment, laboratory instruments, diagnostic analysers and healthcare devices to hospitals and laboratories across the region.`
                                    },
                                    {
                                        title: `${product.title} Distributor in ${cityName}`,
                                        content: `Looking for a reliable distributor of ${product.title} in ${cityName}? We ensure genuine products, timely delivery, installation support, maintenance guidance and excellent customer satisfaction.`
                                    },
                                    {
                                        title: `Buy ${product.title} in ${cityName}`,
                                        content: `Buy premium quality ${product.title} in ${cityName} at competitive prices. Contact Central Biomedicals for the latest quotation, product availability and expert consultation based on your laboratory requirements.`
                                    },
                                    {
                                        title: `${product.title} Price in ${cityName}`,
                                        content: `The price of ${product.title} depends on its model, brand, technical specifications and available features. Contact our team today for the latest pricing, offers and delivery information.`
                                    }
                                ].map((item, index) => (
                                    <section
                                        key={index}
                                        className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6 md:p-8 lg:p-10"
                                    >
                                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-5">
                                            {item.title}
                                        </h2>

                                        <div className="w-20 h-1 rounded-full bg-gradient-to-r from-violet-600 to-sky-500 mb-6"></div>

                                        <p className="text-slate-600 text-base md:text-lg leading-8 md:leading-9">
                                            {item.content}
                                        </p>
                                    </section>
                                ))}

                            </div>

                            {/* FAQ Section */}
                            <div className="mt-20">

                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10">
                                    Frequently Asked Questions
                                </h2>

                                <div className="space-y-5">

                                    {[
                                        {
                                            q: `What is ${product.title} used for in ${cityName}?`,
                                            a: `${product.title} is widely used in hospitals, pathology laboratories, diagnostic centres, research institutes and healthcare facilities for reliable and accurate testing.`
                                        },
                                        {
                                            q: `What is the price of ${product.title} in ${cityName}?`,
                                            a: `The price depends on the model, brand, features and technical specifications. Contact Central Biomedicals for the latest quotation and availability.`
                                        },
                                        {
                                            q: `Are you an authorized supplier of ${product.title}?`,
                                            a: `Yes, Central Biomedicals supplies genuine biomedical, diagnostic and laboratory equipment from trusted manufacturers with professional customer support.`
                                        },
                                        {
                                            q: `Can hospitals in ${cityName} order this product?`,
                                            a: `Yes. Hospitals, pathology laboratories, diagnostic centres, blood banks and healthcare institutions can order this product from us.`
                                        },
                                        {
                                            q: `Do you provide installation support?`,
                                            a: `Yes. Installation guidance, product demonstration and technical support are available depending on the product model and manufacturer.`
                                        },
                                        {
                                            q: `Can I request a quotation?`,
                                            a: `Absolutely. Simply fill out the enquiry form available on this page and our team will share pricing, specifications and product availability.`
                                        },
                                        {
                                            q: `Do you provide warranty?`,
                                            a: `Yes. Warranty depends on the manufacturer and specific product model. Complete warranty details are provided at the time of purchase.`
                                        },
                                        {
                                            q: `Do you deliver across India?`,
                                            a: `Yes. We supply biomedical and laboratory equipment across India with secure packaging, fast logistics and reliable delivery support.`
                                        },
                                        {
                                            q: `How can I contact Central Biomedicals?`,
                                            a: `You can submit the enquiry form, call our team directly or contact us through the details available on our Contact page.`
                                        }
                                    ].map((faq, index) => (

                                        <div
                                            key={index}
                                            className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300"
                                        >

                                            <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-4">
                                                {faq.q}
                                            </h3>

                                            <p className="text-slate-600 leading-8 text-base md:text-lg">
                                                {faq.a}
                                            </p>

                                        </div>

                                    ))}

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}