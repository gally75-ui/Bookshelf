const PLACEHOLDERS: Record<string, string> = {
  Child: "/placeholders/child.svg",
  Adult: "/placeholders/adult.svg",
};

export function getImageSrc(blobUrl: string): string {
  return `/api/image?url=${encodeURIComponent(blobUrl)}`;
}

export function getThumbnail(book: {
  customThumbnailUrl?: string;
  section: string;
}): string {
  const custom = book.customThumbnailUrl;
  if (custom) {
    if (custom.startsWith("http") && custom.includes(".blob.")) {
      return getImageSrc(custom);
    }
    return custom;
  }
  return PLACEHOLDERS[book.section] || PLACEHOLDERS.Adult;
}
