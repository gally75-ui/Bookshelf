import { NextRequest, NextResponse } from "next/server";
import { analyzeShelf } from "@/lib/openai";
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

    const books = await analyzeShelf(base64, contentType);

    const enriched = await Promise.all(
      books.map(async (book) => {
        if (!book.isbn) return { ...book, isbnSource: null };
        try {
          const dbResult = await lookupIsbn(book.isbn);
          if (dbResult) {
            return {
              ...book,
              title: dbResult.title || book.title,
              author: dbResult.author || book.author,
              publisher: dbResult.publisher || book.publisher,
              genre: dbResult.genre || book.genre,
              isbnSource: "Open Library / Google Books",
            };
          }
        } catch { /* non-blocking */ }
        return { ...book, isbnSource: null };
      })
    );

    return NextResponse.json({ books: enriched });
  } catch (error) {
    console.error("Shelf analysis failed:", error);
    const message = error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
