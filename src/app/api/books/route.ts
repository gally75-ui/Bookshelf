import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(books);
  } catch (error) {
    console.error("Failed to fetch books:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, author, genre, publisher, isbn, volume, section, imagePath, thumbnailPath } = body;

    if (!title || !imagePath || !thumbnailPath) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const book = await prisma.book.create({
      data: {
        title,
        author: author || "",
        genre: genre || "",
        publisher: publisher || "",
        isbn: isbn || "",
        volume: volume || "",
        section: section === "Child" ? "Child" : "Adult",
        imagePath,
        thumbnailPath,
      },
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    console.error("Failed to create book:", error);
    return NextResponse.json(
      { error: "Failed to create book" },
      { status: 500 }
    );
  }
}
