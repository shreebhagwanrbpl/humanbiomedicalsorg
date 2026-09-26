import { NextResponse } from "next/server";
import { fetchRawCatalogData, getDistrictsData, WEBSITE_ID } from "@/lib/admin-api";

const DOMAIN = "https://humanbiomedicals.org";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
    try {
        // Districts
        let districts = [];
        try {
            districts = await getDistrictsData();
        } catch (distErr) {
            console.warn("Could not load districts for llms.txt:", distErr.message);
        }

        // Categories & Products from Master Catalog
        const catalogData = await fetchRawCatalogData(WEBSITE_ID);
        const categories = catalogData.categoryList || [];
        const publishedProducts = catalogData.categoryProducts || [];

        // Categories text
        const categoryText =
            categories.length > 0
                ? categories
                    .map((cat) => {
                        const productCount = (cat.subcategories || []).reduce(
                            (acc, sub) => acc + (sub.products?.length || 0),
                            0
                        );
                        const subcatList = (cat.subcategories || [])
                            .map((sub) => `  - ${sub.name} (${sub.products?.length || 0} products)`)
                            .join("\n");

                        return `
## ${cat.name || cat.category}
Category ID: ${cat.id}
Total Products: ${productCount}
Subcategories:
${subcatList || "  - None"}
`;
                    })
                    .join("\n")
                : "No Categories Found";

        // Products text
        const productText =
            publishedProducts.length > 0
                ? publishedProducts
                    .map((product) => {
                        return `
# ${product.title}
Category: ${product.category || "N/A"}
Subcategory: ${product.subCategory || "N/A"}
Brand: ${product.brand || "N/A"}
Model: ${product.model || "N/A"}
Description: ${product.description || product.desc || "No description available"}
Instrument: ${product.instrument || "N/A"}
Automation: ${product.automation || "N/A"}
Usage: ${product.usage || "N/A"}
Throughput: ${product.throughput || "N/A"}
Capacity: ${product.capacity || "N/A"}
Availability: ${product.availability || "N/A"}
Price: ${product.price ? `₹${product.price}` : "Contact for Price"}
Product URL: ${DOMAIN}/items/${product.slug || product.id}
Tags: ${[product.title, product.brand, product.category, product.subCategory, product.model, product.instrument, product.automation, product.usage].filter(Boolean).join(", ")}
`;
                    })
                    .join("\n")
                : "No Products Found";

        // Districts text
        const districtText =
            districts.length > 0
                ? districts
                    .map((item) => `${DOMAIN}/${item.slug || item.id || item.district}`)
                    .join("\n")
                : "No Districts Found";

        const content = `
## Statistics
Products: ${publishedProducts.length}
Categories: ${categories.length}
Districts: ${districts.length}

# Human Biomedical
India's Trusted Biomedical & Laboratory Equipment Supplier

Website: ${DOMAIN}
Published Products: ${publishedProducts.length}
Categories: ${categories.length}
District Pages: ${districts.length}

Company:
Human Biomedicals is one of India's trusted Biomedical & Pathology Equipment suppliers.

Services:
- Biomedical Equipment Supply
- Laboratory Equipment
- Diagnostic Equipment
- Installation
- AMC
- Calibration
- Repair
- Technical Support
- Pan India Delivery

Search Keywords:
Biomedical Equipment, Laboratory Equipment, Diagnostic Equipment, Hospital Equipment, Medical Equipment, ICU Equipment, Operation Theatre Equipment, Biochemistry Analyzer, Electrolyte Analyzer, CLIA Analyzer, Immunoassay Analyzer

------------------------------------------------
## Categories
${categoryText}

------------------------------------------------
## Products
${productText}

------------------------------------------------
## District Pages
${districtText}

------------------------------------------------
Sitemap: ${DOMAIN}/sitemap.xml
Robots: ${DOMAIN}/robots.txt
Contact: ${DOMAIN}/contact
Last Updated: ${new Date().toISOString()}
`;

        return new NextResponse(content, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "public, max-age=3600",
            },
        });
    } catch (e) {
        return NextResponse.json(
            {
                success: false,
                error: e.message,
            },
            {
                status: 500,
            }
        );
    }
}