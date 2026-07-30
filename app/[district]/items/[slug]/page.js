import ProductDetails from "../../../itemsbkp/[slug]/ProductDetails";

export async function generateMetadata({
    params,
}) {

    const {
        district,
        slug,
    } = await params;

    const city =
        district
            ?.replace(/-/g, " ")
            .replace(
                /\b\w/g,
                (c) => c.toUpperCase()
            ) || "India";

    const productName =
        slug
            ?.replace(/-/g, " ")
            .replace(
                /\b\w/g,
                (c) => c.toUpperCase()
            ) || "";

    const title =
        `${productName} Supplier in ${city} | Human Biomedical`;

    const description =
        `Buy ${productName} in ${city} from Human Biomedical. Trusted supplier of biomedical equipment, laboratory instruments, pathology analyzers and healthcare solutions.`;

    const url =
        `https://humanbiomedical.org/${district}/items/${slug}`;

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
            "Human Biomedical",
        ],

        robots: {
            index: true,
            follow: true,
        },

        alternates: {
            canonical: url,
        },

        openGraph: {
            title,
            description,
            url,
            siteName: "Human Biomedical",
            locale: "en_IN",
            type: "website",
        },

        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

export default async function DistrictProductPage({
    params,
}) {

    const {
        district,
        slug,
    } = await params;

    return (
        <ProductDetails
            district={district}
            slug={slug}
        />
    );
}