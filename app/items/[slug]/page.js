import ProductDetails from "./ProductDetails";
import { getProductBySlug, fetchFullCatalog } from "@/lib/db-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    const productName = product?.title || slug
        ?.replace(/-/g, " ")
        ?.replace(/\b\w/g, (c) => c.toUpperCase());

    const title = `${productName} Supplier in India | Price, Dealer & Distributor | Human Biomedicals`;

    const description = product?.description || product?.desc || `Buy ${productName} at best price in India. Trusted supplier, dealer and distributor of ${productName} for hospitals, laboratories, diagnostic centers, research institutes and healthcare facilities. Contact Human Biomedicals for latest quotation and product details.`;

    const url = `https://humanbiomedicals.org/items/${slug}`;

    return {
        title,
        description,

        keywords: [
            productName,
            `${productName} Supplier`,
            `${productName} Dealer`,
            `${productName} Distributor`,
            `${productName} Manufacturer`,
            `${productName} Exporter`,
            `${productName} Price`,
            `${productName} Price in India`,
            `${productName} Supplier in India`,
            `${productName} Dealer in India`,
            `${productName} Distributor in India`,
            `Buy ${productName}`,
            `${productName} for Laboratory`,
            `${productName} for Hospital`,
            `${productName} for Diagnostic Center`,
            "Biomedical Equipment",
            "Medical Equipment",
            "Laboratory Equipment",
            "Diagnostic Equipment",
            "Hospital Equipment",
            "Healthcare Equipment",
            "Human Biomedicals",
        ],

        alternates: {
            canonical: url,
        },

        openGraph: {
            title,
            description,
            url,
            siteName: "Human Biomedicals",
            type: "website",
            locale: "en_IN",
            images: product?.image ? [{ url: product.image }] : undefined,
        },

        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: product?.image ? [product.image] : undefined,
        },

        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },

        metadataBase: new URL("https://humanbiomedicals.org"),
    };
}

export default async function Page({ params }) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    return <ProductDetails slug={slug} product={product} />;
}