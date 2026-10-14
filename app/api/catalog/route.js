import { fetchRawCatalogData, WEBSITE_ID } from "@/lib/admin-api";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetWebsiteId = searchParams.get("websiteId") || WEBSITE_ID;

    const data = await fetchRawCatalogData(targetWebsiteId);

    return Response.json(
      {
        success: true,
        count: data.categoryProducts?.length || 0,
        categoriesCount: data.categoryList?.length || 0,
        categories: data.categoryList || [],
        products: data.categoryProducts || [],
        websiteId: targetWebsiteId,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error) {
    console.error("Error in /api/catalog:", error);
    return Response.json(
      {
        success: false,
        products: [],
        categories: [],
        error: error.message || "Failed to fetch catalog",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
