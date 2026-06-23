import ProductDetails from "../../../items/[slug]/ProductDetails";

export async function generateMetadata({
    params,
}) {

    const district =
        params?.district || "";

    const slug =
        params?.slug || "";

    const city = district
        .replace(/-/g, " ")
        .replace(
            /\b\w/g,
            (c) => c.toUpperCase()
        );

    const productName =
        slug
            .replace(/-/g, " ")
            .replace(
                /\b\w/g,
                (c) => c.toUpperCase()
            );

    const title =
        `${productName} Supplier in ${city} | Human Biomedicals`;

    const description =
        `Buy ${productName} in ${city} from Human Biomedials. Trusted supplier of biomedical equipment, laboratory instruments, pathology analyzers and healthcare solutions.`;

    const url =
        `https://humanbiomedials.org/${district}/items/${slug}`;

    return {
        title,
        description,

        keywords: [
            productName,
            `${productName} ${city}`,
            `${productName} supplier in ${city}`,
            `${productName} dealer in ${city}`,
            `${productName} distributor in ${city}`,
            `${productName} price in ${city}`,
            `Biomedical Equipment ${city}`,
            `Laboratory Equipment ${city}`,
            `Hospital Equipment ${city}`,
            `Diagnostic Equipment ${city}`,
            "Human Biomedials",
        ],

        alternates: {
            canonical: url,
        },

        robots: {
            index: true,
            follow: true,
        },

        openGraph: {
            title,
            description,
            url,
            siteName:
                "Human Biomedials",
            locale: "en_IN",
            type: "website",
        },

        twitter: {
            card:
                "summary_large_image",
            title,
            description,
        },
    };
}

export default function DistrictProductPage() {
    return <ProductDetails />;
}