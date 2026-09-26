import { ADMIN_API_BASE_URL, WEBSITE_ID } from "@/lib/admin-api";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

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
      subject: (subject || "").trim(),
      message: (message || "").trim(),
      websiteId: body.websiteId || WEBSITE_ID,
      createdAt: new Date().toISOString(),
    };

    // Forward to SQLite Admin API backend
    try {
      const adminRes = await fetch(`${ADMIN_API_BASE_URL}/api/contact-query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!adminRes.ok && adminRes.status !== 404) {
        console.warn("Admin API contact-query returned status:", adminRes.status);
      }
    } catch (forwardErr) {
      console.warn("Could not forward contact query to admin backend:", forwardErr.message);
    }

    return Response.json({
      success: true,
      message: "Query submitted successfully",
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
