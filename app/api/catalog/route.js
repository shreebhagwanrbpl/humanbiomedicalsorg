import { NextResponse } from "next/server";
import { getCategoriesData } from "@/lib/db-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const data = await getCategoriesData();
    return NextResponse.json(
      {
        success: true,
        count: data.categoryProducts?.length || 0,
        categoriesCount: data.categoryList?.length || 0,
        categories: data.categoryList,
        products: data.categoryProducts,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Error in /api/catalog:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch catalog",
      },
      { status: 500 }
    );
  }
}
