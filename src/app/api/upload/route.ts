import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { generateThumbnail } from "@/lib/thumbnails";

const UPLOADS_DIR = path.join(process.cwd(), "public/uploads");
const THUMBS_DIR = path.join(UPLOADS_DIR, "thumbs");

async function ensureDirs() {
  await mkdir(UPLOADS_DIR, { recursive: true });
  await mkdir(THUMBS_DIR, { recursive: true });
}

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

    await ensureDirs();

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop() || "jpg";
    const id = randomUUID();
    const filename = `${id}.${ext}`;
    const thumbFilename = `${id}.jpg`;

    const imagePath = `/uploads/${filename}`;
    const thumbnailPath = `/uploads/thumbs/${thumbFilename}`;

    await writeFile(path.join(UPLOADS_DIR, filename), buffer);

    const thumbBuffer = await generateThumbnail(buffer);
    await writeFile(path.join(THUMBS_DIR, thumbFilename), thumbBuffer);

    return NextResponse.json({ imagePath, thumbnailPath });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
