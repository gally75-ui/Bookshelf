import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { generateThumbnail } from "@/lib/thumbnails";
import { analyzeBookCover } from "@/lib/openai";
import { lookupIsbn } from "@/lib/isbn-lookup";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (file.type && !file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Please upload an image file." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const id = randomUUID();
    const ext = file.name.split(".").pop() || "jpg";
    const contentType = file.type || "image/jpeg";
    const analyze = formData.get("analyze") !== "false";

    const [imageBlob, thumbBuffer] = await Promise.all([
      put(`books/${id}.${ext}`, buffer, { access: "private", contentType }),
      generateThumbnail(buffer),
    ]);

    const thumbBlob = await put(`books/thumbs/${id}.jpg`, thumbBuffer, {
      access: "private",
      contentType: "image/jpeg",
    });

    let metadata: { title: string; author: string; genre: string; publisher: string; isbn: string; section: "Child" | "Adult" } = {
      title: "", author: "", genre: "", publisher: "", isbn: "", section: "Adult",
    };
    let aiError: string | null = null;
    let isbnSource: string | null = null;

    if (analyze) {
      const base64 = buffer.toString("base64");
      try {
        metadata = await analyzeBookCover(base64, contentType);
      } catch (err) {
        console.error("AI analysis failed:", err);
        aiError = err instanceof Error ? err.message : "AI analysis failed";
      }

      if (metadata.isbn) {
        try {
          const dbResult = await lookupIsbn(metadata.isbn);
          if (dbResult) {
            isbnSource = "Open Library / Google Books";
            metadata.title = dbResult.title || metadata.title;
            metadata.author = dbResult.author || metadata.author;
            metadata.publisher = dbResult.publisher || metadata.publisher;
            metadata.genre = dbResult.genre || metadata.genre;
          }
        } catch (err) {
          console.error("ISBN lookup failed:", err);
        }
      }
    }

    return NextResponse.json({
      imagePath: imageBlob.url,
      thumbnailPath: thumbBlob.url,
      ...metadata,
      aiError,
      isbnSource,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
