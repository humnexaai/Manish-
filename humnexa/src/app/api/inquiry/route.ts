import { NextResponse } from "next/server";
import { z } from "zod";

// आने वाले inquiry payload का validation schema
const inquirySchema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().min(7).max(20),
  message: z.string().min(10).max(1000),
  language: z.enum(["en", "hi"]).default("hi"),
});

export async function POST(request: Request) {
  try {
    // क्लाइंट से भेजे गए JSON body को validate करना
    const body = await request.json();
    const parsedInquiry = inquirySchema.parse(body);

    // सर्वर-साइड enriched payload तैयार करना
    const inquiryPayload = {
      ...parsedInquiry,
      brand: "EAT DRINK and Be MERRY",
      location: "Faridabad, Haryana, India",
      receivedAt: new Date().toISOString(),
      source: "website-inquiry-form",
    };

    // अगर webhook URL उपलब्ध है तो inquiry को external service तक भेजना
    const webhookUrl = process.env.INQUIRY_WEBHOOK_URL;
    if (webhookUrl) {
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 7000);

      try {
        const webhookResponse = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(process.env.INQUIRY_WEBHOOK_SECRET
              ? { "x-webhook-secret": process.env.INQUIRY_WEBHOOK_SECRET }
              : {}),
          },
          body: JSON.stringify(inquiryPayload),
          signal: abortController.signal,
        });

        if (!webhookResponse.ok) {
          return NextResponse.json(
            {
              success: false,
              message: "Inquiry delivery failed. Please try WhatsApp or call.",
            },
            { status: 502 },
          );
        }
      } finally {
        clearTimeout(timeoutId);
      }
    }

    // fallback monitoring के लिए server logs में inquiry capture करना
    console.info("[beverage-inquiry]", inquiryPayload);

    return NextResponse.json(
      {
        success: true,
        message: "Inquiry submitted successfully.",
      },
      { status: 200 },
    );
  } catch (error) {
    // invalid input होने पर clear validation response देना
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid inquiry data.",
          fieldErrors: error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    // unexpected errors के लिए safe generic error भेजना
    return NextResponse.json(
      {
        success: false,
        message: "Unable to submit inquiry right now.",
      },
      { status: 500 },
    );
  }
}
