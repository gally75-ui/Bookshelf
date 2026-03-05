import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { del } from "@vercel/blob";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, author, genre, publisher, isbn, section } = body;

    const book = await prisma.book.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(author !== undefined && { author }),
        ...(genre !== undefined && { genre }),
        ...(publisher !== undefined && { publisher }),
        ...(isbn !== undefined && { isbn }),
        ...(section !== undefined && {
          section: section === "Child" ? "Child" : "Adult",
        }),
      },
    });

    return NextResponse.json(book);
  } catch (error) {
    console.error("Failed to update book:", error);
    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const book = await prisma.book.delete({ where: { id } });

    try {
      await del([book.imagePath, book.thumbnailPath]);
    } catch { /* blob may not exist */ }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete book:", error);
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    );
  }
}
