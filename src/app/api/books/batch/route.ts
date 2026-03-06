import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface BookInput {
  title: string;
  author?: string;
  genre?: string;
  publisher?: string;
  isbn?: string;
  volume?: string;
  section?: string;
  imagePath: string;
  thumbnailPath: string;
}

export async function POST(request: NextRequest) {
  try {
    const { books } = (await request.json()) as { books: BookInput[] };

    if (!Array.isArray(books) || books.length === 0) {
      return NextResponse.json(
        { error: "Provide an array of books" },
        { status: 400 }
      );
    }

    const created = await prisma.$transaction(
      books.map((b) =>
        prisma.book.create({
          data: {
            title: b.title || "Untitled",
            author: b.author || "",
            genre: b.genre || "",
            publisher: b.publisher || "",
            isbn: b.isbn || "",
            volume: b.volume || "",
            section: b.section === "Child" ? "Child" : "Adult",
            imagePath: b.imagePath,
            thumbnailPath: b.thumbnailPath,
          },
        })
      )
    );

    return NextResponse.json({ count: created.length }, { status: 201 });
  } catch (error) {
    console.error("Batch create failed:", error);
    const message = error instanceof Error ? error.message : "Batch save failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
