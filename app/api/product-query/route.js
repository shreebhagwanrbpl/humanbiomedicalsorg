import { ADMIN_API_BASE_URL, WEBSITE_ID } from "@/lib/admin-api";
import { insertQueryToMongo } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, productName, productSlug, brand, model, message, district } = body;

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
      type: "product",
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      productName: (productName || "").trim(),
      productSlug: (productSlug || "").trim(),
      brand: (brand || "").trim(),
      model: (model || "").trim(),
      message: (message || "").trim(),
      district: (district || "").trim(),
      websiteId: body.websiteId || WEBSITE_ID,
      createdAt: new Date().toISOString(),
    };

    // 1. Save directly into MongoDB queries collection for SuperAdmin
    let mongoResult = null;
    try {
      mongoResult = await insertQueryToMongo(payload);
    } catch (mongoErr) {
      console.warn("Error inserting product query to MongoDB:", mongoErr.message);
    }

    // 2. Also forward to SuperAdmin API
    try {
      const adminUrl = `${ADMIN_API_BASE_URL}/api/product-query`;
      await fetch(adminUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }).catch(() => {});
    } catch (forwardErr) {
      console.warn("Could not forward product query to admin backend:", forwardErr.message);
    }

    return Response.json({
      success: true,
      message: "Product quotation request submitted successfully! Our technical team will reach out promptly.",
      queryId: mongoResult?.queryId || null,
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
