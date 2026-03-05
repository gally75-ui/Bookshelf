import sharp from "sharp";

const THUMB_WIDTH = 300;
const THUMB_HEIGHT = 400;

export async function generateThumbnail(imageBuffer: Buffer): Promise<Buffer> {
  return sharp(imageBuffer)
    .resize(THUMB_WIDTH, THUMB_HEIGHT, { fit: "cover" })
    .jpeg({ quality: 80 })
    .toBuffer();
}
