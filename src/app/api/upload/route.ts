import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { generateThumbnail } from "@/lib/thumbnails";

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

    const imageBlob = await put(`books/${id}.${ext}`, buffer, {
      access: "public",
      contentType: file.type,
    });

    const thumbBuffer = await generateThumbnail(buffer);
    const thumbBlob = await put(`books/thumbs/${id}.jpg`, thumbBuffer, {
      access: "public",
      contentType: "image/jpeg",
    });

    return NextResponse.json({
      imagePath: imageBlob.url,
      thumbnailPath: thumbBlob.url,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
