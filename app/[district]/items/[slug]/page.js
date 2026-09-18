import ProductDetails from "@/app/items/[slug]/ProductDetails";
import { getProductBySlug } from "@/lib/db-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }) {
    const { district, slug } = await params;
    const product = await getProductBySlug(slug);

    const city =
        district
            ?.replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase()) || "India";

    const productName = product?.title || slug
        ?.replace(/-/g, " ")
        ?.replace(/\b\w/g, (c) => c.toUpperCase()) || "";

    const title = `${productName} Supplier in ${city} | Human Biomedicals`;

    const description = product?.description || product?.desc || `Buy ${productName} in ${city} from Human Biomedicals. Trusted supplier of biomedical equipment, laboratory instruments, pathology analyzers and healthcare solutions.`;

    const url = `https://humanbiomedicals.org/${district}/items/${slug}`;

    return {
        title,
        description,

        keywords: [
            productName,
            `${productName} ${city}`,
            `${productName} Supplier in ${city}`,
            `${productName} Dealer in ${city}`,
            `${productName} Distributor in ${city}`,
            `${productName} Price in ${city}`,
            `${productName} Manufacturer in ${city}`,
            `Biomedical Equipment Supplier in ${city}`,
            `Laboratory Equipment Supplier in ${city}`,
            `Hospital Equipment Supplier in ${city}`,
            `Diagnostic Equipment Supplier in ${city}`,
            city,
            "Human Biomedicals",
        ],

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

        alternates: {
            canonical: url,
        },

        openGraph: {
            title,
            description,
            url,
            siteName: "Human Biomedicals",
            locale: "en_IN",
            type: "website",
            images: product?.image ? [{ url: product.image }] : undefined,
        },

        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: product?.image ? [product.image] : undefined,
        },

        metadataBase: new URL("https://humanbiomedicals.org"),
    };
}

export default async function DistrictProductPage({ params }) {
    const { district, slug } = await params;
    const product = await getProductBySlug(slug);

    return (
        <ProductDetails
            district={district}
            slug={slug}
            product={product}
        />
    );
}