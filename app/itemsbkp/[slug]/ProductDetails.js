"use client";

import "./productSlug.css";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Play } from "lucide-react";
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
    const [selectedImage, setSelectedImage] =
        useState("");
    const pathname = usePathname();

    const pathParts = pathname.split("/");

    const city =
        pathParts[1] &&
            ![
                "about",
                "items",
                "services",
                "contact",
            ].includes(pathParts[1])
            ? pathParts[1]
            : "India";
    const [selectedMedia, setSelectedMedia] =
        useState("image");
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

                        const found = products.find((item) => {

                            const itemSlug =
                                item.slug ||
                                item.title
                                    ?.toLowerCase()
                                    .trim()
                                    .replace(/[^a-z0-9\s-]/g, "")
                                    .replace(/\s+/g, "-");

                            return itemSlug === slug;

                        });

                        setProduct(found);

                        if (found) {

                            setSelectedImage(
                                found.images?.[0] ||
                                found.image ||
                                ""
                            );

                            setSelectedMedia("image");

                        }
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

                    <div className="product-image-preview">

                        {selectedMedia === "video" &&
                            product.video ? (

                            <video
                                controls
                                className="product-detail-image"
                            >
                                <source
                                    src={product.video}
                                    type="video/mp4"
                                />
                            </video>

                        ) : (

                            <img
                                src={
                                    selectedImage ||
                                    product.images?.[0] ||
                                    product.image ||
                                    "/placeholder.jpg"
                                }
                                alt={product.title}
                                className="product-detail-image"
                            />

                        )}

                    </div>

                    <div className="thumbnail-gallery">

                        {(product.images?.length
                            ? product.images
                            : [product.image]
                        ).map((img, index) => (

                            <div
                                key={index}
                                className={`thumbnail-item ${selectedImage === img &&
                                    selectedMedia === "image"
                                    ? "active"
                                    : ""
                                    }`}
                                onClick={() => {
                                    setSelectedImage(img);
                                    setSelectedMedia("image");
                                }}
                            >
                                <img
                                    src={img}
                                    alt={`thumb-${index}`}
                                    className="thumbnail-image"
                                />
                            </div>

                        ))}

                        {product.video && (
                            <div
                                className={`thumbnail-item media-thumb ${selectedMedia === "video"
                                    ? "active"
                                    : ""
                                    }`}
                                onClick={() =>
                                    setSelectedMedia("video")
                                }
                            >
                                ▶
                                <span>Video</span>
                            </div>
                        )}

                        {product.pdf && (
                            <a
                                href={product.pdf}
                                target="_blank"
                                rel="noreferrer"
                                className="thumbnail-item media-thumb"
                            >
                                📄
                                <span>PDF</span>
                            </a>
                        )}

                    </div>
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
            <div className="seo-content">

                <h2>
                    {product.title} Supplier in {city}
                </h2>

                <p>
                    Human Biomedical is a trusted supplier of {product.title} in {city}.
                    We provide premium quality {product.title} for hospitals,
                    pathology laboratories, diagnostic centres, research institutes
                    and healthcare facilities across {city}.
                </p>

                <h2>
                    Why Choose Our {product.title} in {city}
                </h2>

                <p>
                    Our {product.title} is known for high accuracy, reliable performance,
                    advanced technology and long operational life. We provide installation,
                    training and after-sales support throughout {city} and nearby areas.
                </p>

                <h2>
                    Features of {product.title}
                </h2>

                <p>
                    The {product.title} offers excellent performance, user-friendly
                    operation, low maintenance, high efficiency and dependable results
                    for modern laboratories and healthcare facilities.
                </p>

                <h2>
                    Applications of {product.title} in {city}
                </h2>

                <p>
                    {product.title} is widely used in hospitals, pathology labs,
                    diagnostic centres, blood banks, medical colleges and healthcare
                    institutions in {city} for routine testing and analysis.
                </p>

                <h2>
                    Trusted {product.title} Dealer in {city}
                </h2>

                <p>
                    We are one of the leading suppliers and dealers of {product.title}
                    in {city}. Our team ensures timely delivery, technical support
                    and competitive pricing for customers across the region.
                </p>

                <h2>
                    FAQs
                </h2>

                <h3>
                    What is {product.title} used for?
                </h3>

                <p>
                    {product.title} is used in laboratories and healthcare facilities
                    for accurate testing, diagnostics and analysis.
                </p>

                <h3>
                    Do you provide installation and training?
                </h3>

                <p>
                    Yes, we provide complete installation, training and technical support
                    for all {product.title} systems.
                </p>

                <h3>
                    Do you offer after-sales service in {city}?
                </h3>

                <p>
                    Yes, we provide after-sales support, maintenance and service
                    assistance throughout {city}.
                </p>

            </div>

        </div>
    );
}