import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { analyzeBookCover } from "@/lib/openai";

const MIME_MAP: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  heic: "image/heic",
};

export async function POST(request: NextRequest) {
  try {
    const { imagePath } = await request.json();

    if (!imagePath || typeof imagePath !== "string") {
      return NextResponse.json(
        { error: "imagePath is required" },
        { status: 400 }
      );
    }

    const fullPath = path.join(process.cwd(), "public", imagePath);
    let fileBuffer: Buffer;

    try {
      fileBuffer = await readFile(fullPath);
    } catch {
      return NextResponse.json(
        { error: "Image file not found" },
        { status: 404 }
      );
    }

    const ext = imagePath.split(".").pop()?.toLowerCase() || "jpg";
    const mimeType = MIME_MAP[ext] || "image/jpeg";
    const base64 = fileBuffer.toString("base64");

    const metadata = await analyzeBookCover(base64, mimeType);

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
