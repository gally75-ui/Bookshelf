export function getImageSrc(blobUrl: string): string {
  return `/api/image?url=${encodeURIComponent(blobUrl)}`;
}
