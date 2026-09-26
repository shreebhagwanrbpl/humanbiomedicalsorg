import { getProductsData } from "@/lib/admin-api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let products = await getProductsData();

    if (category) {
      const catLower = category.toLowerCase().trim();
      products = products.filter(
        (p) =>
          (p.category || "").toLowerCase() === catLower ||
          (p.categoryId || "").toLowerCase() === catLower ||
          (p.subCategory || "").toLowerCase() === catLower
      );
    }

    if (search) {
      const q = search.toLowerCase().trim();
      products = products.filter((p) => {
        const title = (p.title || "").toLowerCase();
        const brand = (p.brand || "").toLowerCase();
        const model = (p.model || "").toLowerCase();
        const desc = (p.desc || p.description || "").toLowerCase();
        return title.includes(q) || brand.includes(q) || model.includes(q) || desc.includes(q);
      });
    }

    return Response.json(
      {
        success: true,
        count: products.length,
        products,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Error in /api/products:", error);
    return Response.json(
      {
        success: false,
        error: error.message || "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}
