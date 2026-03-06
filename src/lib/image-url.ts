import { getCategoryConfig, type CategoryConfig } from "./category-theme";

export function getImageSrc(blobUrl: string): string {
  return `/api/image?url=${encodeURIComponent(blobUrl)}`;
}

function buildPlaceholderSvg(cfg: CategoryConfig, label: string): string {
  const isChild = cfg.type === "children";

  const icon = isChild
    ? `<circle cx="120" cy="105" r="26" fill="${cfg.color}" opacity="0.25"/>
       <path d="M108 100l8 5-8 5z" fill="${cfg.color}" opacity="0.6"/>
       <circle cx="130" cy="98" r="4" fill="${cfg.color}" opacity="0.5"/>
       <path d="M112 118a10 10 0 0016 0" stroke="${cfg.color}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.5"/>`
    : `<rect x="88" y="80" width="64" height="80" rx="4" fill="${cfg.color}" opacity="0.12" stroke="${cfg.color}" stroke-width="1.5" opacity="0.3"/>
       <rect x="96" y="90" width="48" height="58" rx="2" fill="white" opacity="0.6"/>
       <path d="M108 112h24M108 122h24M108 132h16" stroke="${cfg.color}" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 320">
    <rect width="240" height="320" rx="12" fill="${cfg.bg}"/>
    ${icon}
    <text x="120" y="200" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" font-weight="600" fill="${cfg.text}">${escXml(label)}</text>
    <text x="120" y="220" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="${cfg.color}" opacity="0.7">${isChild ? "Enfant" : "Adulte"}</text>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function escXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function getThumbnail(book: {
  customThumbnailUrl?: string;
  genre?: string;
  section: string;
}): string {
  const custom = book.customThumbnailUrl;
  if (custom) {
    if (custom.startsWith("http") && custom.includes(".blob.")) {
      return getImageSrc(custom);
    }
    return custom;
  }
  const cfg = getCategoryConfig(book.genre || "", book.section);
  const label = book.genre || (book.section === "Child" ? "Enfant" : "Adulte");
  return buildPlaceholderSvg(cfg, label);
}
