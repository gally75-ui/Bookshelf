import { NextRequest, NextResponse } from "next/server";
import { analyzeBookCover } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const { imagePath } = await request.json();

    if (!imagePath || typeof imagePath !== "string") {
      return NextResponse.json(
        { error: "imagePath is required" },
        { status: 400 }
      );
    }

    const imageRes = await fetch(imagePath);
    if (!imageRes.ok) {
      return NextResponse.json(
        { error: "Image file not found" },
        { status: 404 }
      );
    }

    const arrayBuffer = await imageRes.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const contentType = imageRes.headers.get("content-type") || "image/jpeg";

    const metadata = await analyzeBookCover(base64, contentType);

    return NextResponse.json(metadata);
  } catch (error) {
    console.error("Analyze failed:", error);

    const message =
      error instanceof Error ? error.message : "Analysis failed";

    if (message.includes("rate limit") || message.includes("429")) {
      return NextResponse.json(
        { error: "Rate limited by OpenAI. Please try again in a moment." },
        { status: 429 }
      );
    }

    if (message.includes("parse")) {
      return NextResponse.json(
        { error: "Could not extract book details from this image. Try a clearer photo." },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { error: "Failed to analyze image. Please try again." },
      { status: 500 }
    );
  }
}
