import { ADMIN_API_BASE_URL, WEBSITE_ID } from "@/lib/admin-api";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, productName, productSlug, brand, model } = body;

    if (!name || !name.trim()) {
      return Response.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    if (!email || !email.trim()) {
      return Response.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    if (!phone || !phone.trim()) {
      return Response.json(
        { success: false, error: "Phone number is required" },
        { status: 400 }
      );
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      productName: (productName || "").trim(),
      productSlug: (productSlug || "").trim(),
      brand: (brand || "").trim(),
      model: (model || "").trim(),
      websiteId: body.websiteId || WEBSITE_ID,
      createdAt: new Date().toISOString(),
    };

    // Forward to SQLite Admin API backend
    try {
      const adminRes = await fetch(`${ADMIN_API_BASE_URL}/api/product-query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!adminRes.ok && adminRes.status !== 404) {
        console.warn("Admin API product-query returned status:", adminRes.status);
      }
    } catch (forwardErr) {
      console.warn("Could not forward product query to admin backend:", forwardErr.message);
    }

    return Response.json({
      success: true,
      message: "Product enquiry submitted successfully",
    });
  } catch (error) {
    console.error("Error in /api/product-query:", error);
    return Response.json(
      {
        success: false,
        error: error.message || "Failed to process product enquiry",
      },
      { status: 500 }
    );
  }
}
