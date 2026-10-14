import { fetchSiteDataFromAdmin, WEBSITE_ID } from "@/lib/admin-api";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all";
    const websiteId = searchParams.get("websiteId") || WEBSITE_ID;

    const data = await fetchSiteDataFromAdmin(type, websiteId);

    return Response.json(
      {
        success: true,
        type,
        websiteId,
        data,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error) {
    console.error("Error in /api/site-data:", error);
    return Response.json(
      {
        success: false,
        error: error.message || "Failed to fetch site data",
      },
      { status: 500 }
    );
  }
}
