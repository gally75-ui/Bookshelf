import { NextRequest, NextResponse } from "next/server";
import { analyzeBookCover } from "@/lib/openai";
import { get } from "@vercel/blob";

export async function POST(request: NextRequest) {
  try {
    const { imagePath } = await request.json();

    if (!imagePath || typeof imagePath !== "string") {
      return NextResponse.json(
        { error: "imagePath is required" },
        { status: 400 }
      );
    }

    const result = await get(imagePath, { access: "private" });
    if (result?.statusCode !== 200 || !result.stream) {
      return NextResponse.json(
        { error: "Image file not found" },
        { status: 404 }
      );
    }

    const chunks: Uint8Array[] = [];
    const reader = result.stream.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }
    const buffer = Buffer.concat(chunks);
    const base64 = buffer.toString("base64");
    const contentType = result.blob.contentType || "image/jpeg";

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
