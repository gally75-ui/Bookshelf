import { NextRequest, NextResponse } from "next/server";
import { analyzeBookCover } from "@/lib/openai";
import { lookupIsbn } from "@/lib/isbn-lookup";
import { get } from "@vercel/blob";

export const maxDuration = 60;

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
        { error: `Could not read image from storage (status: ${result?.statusCode})` },
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

    let metadata = await analyzeBookCover(base64, contentType);
    let isbnSource: string | null = null;

    if (metadata.isbn) {
      try {
        const dbResult = await lookupIsbn(metadata.isbn);
        if (dbResult) {
          isbnSource = "Open Library / Google Books";
          metadata = {
            ...metadata,
            title: dbResult.title || metadata.title,
            author: dbResult.author || metadata.author,
            publisher: dbResult.publisher || metadata.publisher,
            genre: dbResult.genre || metadata.genre,
          };
        }
      } catch (err) {
        console.error("ISBN lookup failed (non-blocking):", err);
      }
    }

    return NextResponse.json({ ...metadata, isbnSource });
  } catch (error) {
    console.error("Analyze failed:", error);
    const message = error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
