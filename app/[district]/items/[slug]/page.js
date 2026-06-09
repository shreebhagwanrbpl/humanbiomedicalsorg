"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
    doc,
    getDoc,
    collection,
    addDoc,
    serverTimestamp,
} from "firebase/firestore";

import { db } from "@/firebase";
import toast, { Toaster } from "react-hot-toast";

export default function ProductDetailPage() {
    const { district, slug } = useParams();

    const [product, setProduct] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const [sending, setSending] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            const snap = await getDoc(
                doc(
                    db,
                    "websites",
                    "humanbiomedicalsorg",
                    "pages",
                    "products"
                )
            );

            if (!snap.exists()) return;

            const products =
                snap.data().products || [];

            const makeSlug = (text = "") =>
                text
                    .toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, "")
                    .replace(/\s+/g, "-");

            const found = products.find(
                (p) => makeSlug(p.title) === slug
            );

            setProduct(found || null);
        };

        fetchProduct();
    }, [slug]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async () => {
        const { name, email, phone, message } = formData;

        if (!name.trim()) {
            toast.error("Please enter your name");
            return;
        }

        if (name.trim().length < 3) {
            toast.error("Name must be at least 3 characters");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email.trim()) {
            toast.error("Please enter your email");
            return;
        }

        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email");
            return;
        }

        const phoneRegex = /^[6-9]\d{9}$/;

        if (!phone.trim()) {
            toast.error("Please enter your phone number");
            return;
        }

        if (!phoneRegex.test(phone)) {
            toast.error("Please enter a valid 10 digit mobile number");
            return;
        }

        if (!message.trim()) {
            toast.error("Please enter your requirement");
            return;
        }

        if (message.trim().length < 10) {
            toast.error("Message must be at least 10 characters");
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
                    productName: product?.title || "",
                    productImage: product?.image || "",
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
        } catch (err) {
            console.error(err);
            toast.error("Failed To Submit");
        } finally {
            setSending(false);
        }
    };

    if (!product)
        return (
            <div className="max-w-7xl mx-auto px-5 py-20 animate-pulse">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">

                    <div className="h-[250px] sm:h-[400px] lg:h-[500px] rounded-3xl bg-slate-200"></div>

                    <div>
                        <div className="h-12 w-3/4 bg-slate-200 rounded mb-6"></div>

                        <div className="h-4 bg-slate-200 rounded mb-3"></div>
                        <div className="h-4 bg-slate-200 rounded mb-3"></div>
                        <div className="h-4 w-2/3 bg-slate-200 rounded mb-8"></div>

                        <div className="grid grid-cols-2 gap-4">
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-16 bg-slate-200 rounded-xl"
                                />
                            ))}
                        </div>
                    </div>

                </div>

                <div className="mt-20 max-w-2xl">
                    <div className="h-10 w-48 bg-slate-200 rounded mb-6"></div>

                    <div className="space-y-4">
                        <div className="h-14 bg-slate-200 rounded-xl"></div>
                        <div className="h-14 bg-slate-200 rounded-xl"></div>
                        <div className="h-14 bg-slate-200 rounded-xl"></div>
                        <div className="h-32 bg-slate-200 rounded-xl"></div>

                        <div className="h-14 w-52 bg-slate-200 rounded-xl"></div>
                    </div>
                </div>
            </div>
        );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-5 py-10 sm:py-16 lg:py-20">
            <Toaster />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">

                <div>
                    <img
                        src={
                            product.image ||
                            "/placeholder.jpg"
                        }
                        alt={product.title}
                        className="w-full h-[250px] sm:h-[400px] lg:h-auto object-cover rounded-2xl lg:rounded-3xl border"
                    />
                </div>

                <div>
                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight break-words">
                        {product.title}
                    </h1>

                    <p className="mt-4 lg:mt-6 text-sm sm:text-base text-gray-600 leading-7">
                        {product.desc}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 lg:mt-8">

                        <div className="p-4 border rounded-xl bg-slate-50">
                            <p className="text-sm text-slate-500 font-medium">
                                Brand
                            </p>
                            <p className="mt-1 font-semibold text-slate-900 break-words">
                                {product.brand || "N/A"}
                            </p>
                        </div>

                        <div className="p-4 border rounded-xl bg-slate-50">
                            <p className="text-sm text-slate-500 font-medium">
                                Instrument
                            </p>
                            <p className="mt-1 font-semibold text-slate-900 break-words">
                                {product.instrument || "N/A"}
                            </p>
                        </div>

                        <div className="p-4 border rounded-xl bg-slate-50">
                            <p className="text-sm text-slate-500 font-medium">
                                Model
                            </p>
                            <p className="mt-1 font-semibold text-slate-900 break-words">
                                {product.model || "N/A"}
                            </p>
                        </div>

                        <div className="p-4 border rounded-xl bg-slate-50">
                            <p className="text-sm text-slate-500 font-medium">
                                Throughput
                            </p>
                            <p className="mt-1 font-semibold text-slate-900 break-words">
                                {product.throughput || "N/A"}
                            </p>
                        </div>

                        <div className="p-4 border rounded-xl bg-slate-50">
                            <p className="text-sm text-slate-500 font-medium">
                                Capacity
                            </p>
                            <p className="mt-1 font-semibold text-slate-900 break-words">
                                {product.capacity || "N/A"}
                            </p>
                        </div>

                        <div className="p-4 border rounded-xl bg-slate-50">
                            <p className="text-sm text-slate-500 font-medium">
                                Availability
                            </p>
                            <p className="mt-1 font-semibold text-slate-900 break-words">
                                {product.availability || "N/A"}
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            <div className="mt-10 lg:mt-20 max-w-2xl">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                    Send Enquiry
                </h2>

                <div className="space-y-4">

                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                name: e.target.value.replace(/[^a-zA-Z\s]/g, ""),
                            })
                        }
                        className="w-full border p-4 rounded-xl"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border p-4 rounded-xl"
                    />

                    <input
                        type="tel"
                        name="phone"
                        maxLength={10}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                phone: e.target.value.replace(/\D/g, ""),
                            })
                        }
                        value={formData.phone}
                        placeholder="Phone"
                        className="w-full border p-4 rounded-xl"
                    />

                    <textarea
                        rows={5}
                        name="message"
                        placeholder="Your Requirement"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full border p-4 rounded-xl"
                    />

                    <button
                        onClick={handleSubmit}
                        disabled={sending}
                        className={`w-full sm:w-auto px-8 py-4 rounded-xl text-white font-semibold ${sending
                            ? "bg-slate-400 cursor-not-allowed"
                            : "bg-violet-600 hover:bg-violet-700"
                            }`}
                    >
                        {sending ? "Submitting..." : "Submit Enquiry"}
                    </button>

                </div>
            </div>
        </div>
    );
}