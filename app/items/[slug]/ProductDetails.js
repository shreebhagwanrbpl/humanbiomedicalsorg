"use client";

import "./productSlug.css";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
    doc,
    getDoc,
    addDoc,
    collection,
} from "firebase/firestore";
import { db } from "../../../firebase";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
export default function ProductDetails() {

    const { slug } = useParams();

    const [product, setProduct] =
        useState(null);

    const [errors, setErrors] =
        useState({});

    const [name, setName] =
        useState("");

    const [phone, setPhone] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [loading, setLoading] =
        useState(true);
    const [submitting, setSubmitting] =
        useState(false);
    useEffect(() => {

        const fetchProduct =
            async () => {

                try {

                    const snap =
                        await getDoc(
                            doc(
                                db,
                                "websites",
                                "humanbiomedicalsin",
                                "pages",
                                "products"
                            )
                        );

                    if (
                        snap.exists()
                    ) {

                        const products =
                            snap.data()
                                .products || [];

                        const found =
                            products.find(
                                (item) =>
                                    item.slug === slug
                            );

                        setProduct(
                            found
                        );
                    }

                } catch (
                err
                ) {
                    console.error(
                        err
                    );
                } finally {
                    setLoading(
                        false
                    );
                }
            };

        fetchProduct();

    }, [slug]);

    const validateForm =
        () => {

            const newErrors =
                {};

            if (
                name.trim()
                    .length < 3
            ) {
                newErrors.name =
                    "Minimum 3 characters required";
            }

            if (
                !/^[6-9]\d{9}$/.test(
                    phone
                )
            ) {
                newErrors.phone =
                    "Enter valid 10 digit mobile number";
            }

            if (
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                    email
                )
            ) {
                newErrors.email =
                    "Enter valid email";
            }

            if (
                message.trim()
                    .length < 10
            ) {
                newErrors.message =
                    "Minimum 10 characters required";
            }

            setErrors(
                newErrors
            );

            return (
                Object.keys(
                    newErrors
                ).length === 0
            );
        };

    const submitEnquiry = async (e) => {

        e.preventDefault();

        if (!validateForm()) {

            toast.error(
                "Please fill all fields correctly"
            );

            return;
        }

        setSubmitting(true);

        try {

            await addDoc(
                collection(
                    db,
                    "websitesQueries",
                    "humanbiomedicalsin",
                    "productQueries"
                ),
                {
                    productName: product.title,
                    productSlug: product.slug,
                    productImage: product.image || "",
                    brand: product.brand || "",
                    model: product.model || "",
                    name,
                    phone,
                    email,
                    message,
                    createdAt: new Date()
                }
            );

            toast.success(
                "Enquiry Submitted Successfully"
            );

            setName("");
            setPhone("");
            setEmail("");
            setMessage("");

        } catch (err) {

            toast.error(
                "Submission Failed"
            );

        } finally {

            setSubmitting(false);

        }
    };

    if (loading) {
        return (
            <div className="product-details-page">

                <div className="product-details-container">

                    <div className="skeleton image-loader"></div>

                    <div>

                        <div className="skeleton title-loader"></div>

                        <div className="skeleton text-loader"></div>
                        <div className="skeleton text-loader"></div>
                        <div className="skeleton text-loader short"></div>

                    </div>

                </div>

            </div>
        );
    }

    if (!product) {
        return (
            <h2
                style={{
                    textAlign:
                        "center",
                    marginTop:
                        "150px",
                }}
            >
                Product Not Found
            </h2>
        );
    }

    return (
        <div className="product-details-page">
            <Toaster
                position="top-right"
            />
            <div className="product-details-container">

                <div className="product-image-box">
                    <img
                        src={
                            product.image ||
                            "/placeholder.jpg"
                        }
                        alt={`${product.title} Supplier India`}
                        title={product.title}
                    />
                </div>

                <div className="product-info">

                    <h1>
                        {product.title}
                    </h1>

                    <p className="product-description">
                        {product.desc}
                    </p>

                    <div className="product-meta">

                        <div className="meta-card">
                            <strong>
                                Brand
                            </strong>
                            <span>
                                {product.brand ||
                                    "N/A"}
                            </span>
                        </div>

                        <div className="meta-card">
                            <strong>
                                Model
                            </strong>
                            <span>
                                {product.model ||
                                    "N/A"}
                            </span>
                        </div>

                        <div className="meta-card">
                            <strong>
                                Availability
                            </strong>
                            <span>
                                {product.availability ||
                                    "Available"}
                            </span>
                        </div>

                    </div>

                </div>

            </div>

            <div className="enquiry-section">

                <div className="enquiry-card">

                    <h2>
                        Product Enquiry Form
                    </h2>

                    <form
                        onSubmit={
                            submitEnquiry
                        }
                        className="enquiry-form"
                    >

                        <input
                            type="text"
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) =>
                                setName(
                                    e.target
                                        .value
                                )
                            }
                        />

                        <input
                            type="tel"
                            placeholder="Mobile Number"
                            value={phone}
                            maxLength={10}
                            onChange={(e) =>
                                setPhone(
                                    e.target.value.replace(
                                        /[^0-9]/g,
                                        ""
                                    )
                                )
                            }
                        />

                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) =>
                                setEmail(
                                    e.target
                                        .value
                                )
                            }
                        />

                        <textarea
                            rows="6"
                            placeholder="Write your enquiry..."
                            value={message}
                            onChange={(e) =>
                                setMessage(
                                    e.target
                                        .value
                                )
                            }
                        />

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={submitting}
                        >
                            {
                                submitting
                                    ? "Submitting..."
                                    : "Send Enquiry"
                            }
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}