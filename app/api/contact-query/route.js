import { ADMIN_API_BASE_URL, WEBSITE_ID } from "@/lib/admin-api";
import { insertQueryToMongo } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message, district } = body;

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
      type: "contact",
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      subject: (subject || "").trim(),
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
      console.warn("Error inserting contact query to MongoDB:", mongoErr.message);
    }

    // 2. Also forward to SuperAdmin API
    try {
      const adminUrl = `${ADMIN_API_BASE_URL}/api/contact-query`;
      await fetch(adminUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }).catch(() => {});
    } catch (forwardErr) {
      console.warn("Could not forward contact query to admin backend:", forwardErr.message);
    }

    return Response.json({
      success: true,
      message: "Your message has been received! Our biomedical team will contact you shortly.",
      queryId: mongoResult?.queryId || null,
    });
  } catch (error) {
    console.error("Error in /api/contact-query:", error);
    return Response.json(
      {
        success: false,
        error: error.message || "Failed to process query",
      },
      { status: 500 }
    );
  }
}
