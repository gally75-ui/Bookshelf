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

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/heic"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported image type. Use JPEG, PNG, WebP, or HEIC." },
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
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
