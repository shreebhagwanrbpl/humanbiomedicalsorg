import ProductDetails from "./ProductDetails";

export async function generateMetadata({
    params,
}) {

    const { slug } =
        await params;

    const productName =
        slug
            .replace(/-/g, " ")
            .replace(
                /\b\w/g,
                (c) => c.toUpperCase()
            );

    const title =
        `${productName} Supplier in India | Human Biomedicals`;

    const description =
        `Buy ${productName} from Human Biomedicals. Trusted supplier of biomedical equipment and laboratory instruments across India.`;

    return {
        title,
        description,

        alternates: {
            canonical:
                `https://humanbiomedicals.in/items/${slug}`,
        },

        robots: {
            index: true,
            follow: true,
        },

        openGraph: {
            title,
            description,
            url:
                `https://humanbiomedicals.in/items/${slug}`,
            type: "website",
        },

        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

export default function Page() {
    return <ProductDetails />;
}