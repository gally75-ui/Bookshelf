"use client";

import { getCategoryConfig } from "@/lib/category-theme";

interface BookPlaceholderProps {
  genre: string;
  section: string;
}

function CategoryIcon({ genre, color }: { genre: string; color: string }) {
  const c = color;
  const key = genre.toLowerCase();

  switch (key) {
    // ── Children ──
    case "contes":
      // Magic wand with sparkles
      return (
        <>
          <line x1="18" y1="62" x2="58" y2="22" stroke={c} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
          <circle cx="58" cy="22" r="5" fill={c} opacity="0.3" />
          <path d="M62 8l1.5 3 3.3.5-2.4 2.3.6 3.2L62 15l-3 1.8.6-3.2-2.4-2.3 3.3-.5z" fill={c} opacity="0.5" />
          <path d="M44 12l1 2 2.2.3-1.6 1.5.4 2.2L44 16.8l-2 1.2.4-2.2-1.6-1.5 2.2-.3z" fill={c} opacity="0.35" />
          <path d="M70 32l.8 1.6 1.8.3-1.3 1.2.3 1.8-1.6-.9-1.6.9.3-1.8-1.3-1.2 1.8-.3z" fill={c} opacity="0.25" />
          <circle cx="50" cy="30" r="1.5" fill={c} opacity="0.2" />
        </>
      );
    case "histoires":
      // Open book with speech bubble
      return (
        <>
          <rect x="8" y="30" width="64" height="44" rx="4" fill="white" opacity="0.5" />
          <rect x="8" y="30" width="64" height="44" rx="4" stroke={c} strokeWidth="2" opacity="0.3" />
          <line x1="40" y1="34" x2="40" y2="70" stroke={c} strokeWidth="1.5" opacity="0.15" />
          <line x1="16" y1="42" x2="34" y2="42" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
          <line x1="16" y1="48" x2="32" y2="48" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.15" />
          <line x1="46" y1="42" x2="64" y2="42" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
          <line x1="46" y1="48" x2="60" y2="48" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.15" />
          <ellipse cx="54" cy="18" rx="14" ry="10" fill={c} opacity="0.15" />
          <path d="M48 26l4-2 4 4z" fill={c} opacity="0.15" />
          <circle cx="50" cy="17" r="1.5" fill={c} opacity="0.3" />
          <circle cx="54" cy="17" r="1.5" fill={c} opacity="0.3" />
          <circle cx="58" cy="17" r="1.5" fill={c} opacity="0.3" />
        </>
      );
    case "livres-jeux":
      // Dice / puzzle
      return (
        <>
          <rect x="18" y="18" width="44" height="44" rx="8" fill="white" opacity="0.5" />
          <rect x="18" y="18" width="44" height="44" rx="8" stroke={c} strokeWidth="2" opacity="0.35" />
          <circle cx="30" cy="30" r="3" fill={c} opacity="0.4" />
          <circle cx="50" cy="30" r="3" fill={c} opacity="0.4" />
          <circle cx="40" cy="40" r="3" fill={c} opacity="0.4" />
          <circle cx="30" cy="50" r="3" fill={c} opacity="0.4" />
          <circle cx="50" cy="50" r="3" fill={c} opacity="0.4" />
          <path d="M14 68l6 6 12-12" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" fill="none" />
        </>
      );
    case "albums illustrés":
      // Paint palette
      return (
        <>
          <ellipse cx="40" cy="40" rx="26" ry="22" fill="white" opacity="0.5" />
          <ellipse cx="40" cy="40" rx="26" ry="22" stroke={c} strokeWidth="2" opacity="0.3" />
          <circle cx="30" cy="32" r="4" fill={c} opacity="0.5" />
          <circle cx="42" cy="28" r="3.5" fill={c} opacity="0.35" />
          <circle cx="52" cy="34" r="3" fill={c} opacity="0.25" />
          <circle cx="48" cy="46" r="3.5" fill={c} opacity="0.4" />
          <circle cx="34" cy="48" r="3" fill={c} opacity="0.3" />
          <ellipse cx="38" cy="50" rx="4" ry="6" fill="white" opacity="0.7" />
          <line x1="54" y1="14" x2="66" y2="4" stroke={c} strokeWidth="2" strokeLinecap="round" opacity="0.25" />
          <line x1="56" y1="12" x2="68" y2="6" stroke={c} strokeWidth="2" strokeLinecap="round" opacity="0.2" />
        </>
      );
    case "éveil":
      // ABC blocks with sun
      return (
        <>
          <rect x="12" y="34" width="24" height="24" rx="3" fill="white" opacity="0.5" />
          <rect x="12" y="34" width="24" height="24" rx="3" stroke={c} strokeWidth="2" opacity="0.3" />
          <text x="24" y="52" textAnchor="middle" fontFamily="system-ui" fontSize="14" fontWeight="700" fill={c} opacity="0.45">A</text>
          <rect x="42" y="34" width="24" height="24" rx="3" fill="white" opacity="0.5" />
          <rect x="42" y="34" width="24" height="24" rx="3" stroke={c} strokeWidth="2" opacity="0.3" />
          <text x="54" y="52" textAnchor="middle" fontFamily="system-ui" fontSize="14" fontWeight="700" fill={c} opacity="0.45">B</text>
          <circle cx="40" cy="16" r="8" fill={c} opacity="0.15" />
          <circle cx="40" cy="16" r="4" fill={c} opacity="0.2" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line key={a} x1={40 + 10 * Math.cos(a * Math.PI / 180)} y1={16 + 10 * Math.sin(a * Math.PI / 180)} x2={40 + 13 * Math.cos(a * Math.PI / 180)} y2={16 + 13 * Math.sin(a * Math.PI / 180)} stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
          ))}
        </>
      );

    // ── Adult ──
    case "littérature":
      // Feather quill with inkwell
      return (
        <>
          <path d="M52 10C42 18 34 32 30 50c-1 4-2 10-2 14" stroke={c} strokeWidth="2" strokeLinecap="round" opacity="0.4" fill="none" />
          <path d="M52 10c-4 6-2 14 2 10 3-3 6-8 4-14-6 2-10 6-6 4z" fill={c} opacity="0.2" />
          <path d="M52 10c2-3 5-4 8-3-1 4-4 6-8 3z" fill={c} opacity="0.3" />
          <ellipse cx="30" cy="64" rx="10" ry="6" fill={c} opacity="0.12" />
          <rect x="24" y="56" width="12" height="10" rx="2" fill="white" opacity="0.5" />
          <rect x="24" y="56" width="12" height="10" rx="2" stroke={c} strokeWidth="1.5" opacity="0.3" />
        </>
      );
    case "policier":
      // Magnifying glass
      return (
        <>
          <circle cx="36" cy="32" r="18" fill="white" opacity="0.4" />
          <circle cx="36" cy="32" r="18" stroke={c} strokeWidth="3" opacity="0.35" />
          <circle cx="36" cy="32" r="14" stroke={c} strokeWidth="1" opacity="0.1" />
          <line x1="49" y1="45" x2="64" y2="62" stroke={c} strokeWidth="4" strokeLinecap="round" opacity="0.3" />
          <path d="M30 28c0-4 3-8 8-9" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.2" fill="none" />
        </>
      );
    case "aventures":
      // Compass
      return (
        <>
          <circle cx="40" cy="38" r="24" fill="white" opacity="0.4" />
          <circle cx="40" cy="38" r="24" stroke={c} strokeWidth="2" opacity="0.3" />
          <circle cx="40" cy="38" r="20" stroke={c} strokeWidth="0.5" opacity="0.15" />
          <polygon points="40,18 44,36 40,42 36,36" fill={c} opacity="0.4" />
          <polygon points="40,58 44,40 40,34 36,40" fill={c} opacity="0.15" />
          <circle cx="40" cy="38" r="3" fill={c} opacity="0.25" />
          <text x="40" y="14" textAnchor="middle" fontFamily="system-ui" fontSize="7" fontWeight="700" fill={c} opacity="0.3">N</text>
        </>
      );
    case "poche":
      // Small pocket book
      return (
        <>
          <rect x="20" y="16" width="40" height="56" rx="3" fill="white" opacity="0.5" />
          <rect x="20" y="16" width="40" height="56" rx="3" stroke={c} strokeWidth="2" opacity="0.3" />
          <line x1="26" y1="16" x2="26" y2="72" stroke={c} strokeWidth="1" opacity="0.12" />
          <rect x="32" y="26" width="22" height="3" rx="1.5" fill={c} opacity="0.25" />
          <rect x="32" y="33" width="16" height="2" rx="1" fill={c} opacity="0.15" />
          <line x1="32" y1="42" x2="54" y2="42" stroke={c} strokeWidth="0.5" opacity="0.12" />
          <rect x="32" y="48" width="22" height="1.5" rx="0.75" fill={c} opacity="0.08" />
          <rect x="32" y="53" width="18" height="1.5" rx="0.75" fill={c} opacity="0.06" />
          <rect x="32" y="58" width="14" height="1.5" rx="0.75" fill={c} opacity="0.05" />
        </>
      );
    case "documentaire":
      // Globe
      return (
        <>
          <circle cx="40" cy="36" r="22" fill="white" opacity="0.4" />
          <circle cx="40" cy="36" r="22" stroke={c} strokeWidth="2" opacity="0.3" />
          <ellipse cx="40" cy="36" rx="10" ry="22" stroke={c} strokeWidth="1" opacity="0.15" fill="none" />
          <line x1="18" y1="36" x2="62" y2="36" stroke={c} strokeWidth="1" opacity="0.15" />
          <ellipse cx="40" cy="28" rx="18" ry="4" stroke={c} strokeWidth="0.75" opacity="0.1" fill="none" />
          <ellipse cx="40" cy="44" rx="18" ry="4" stroke={c} strokeWidth="0.75" opacity="0.1" fill="none" />
          <rect x="36" y="58" width="8" height="4" rx="1" fill={c} opacity="0.15" />
          <rect x="30" y="62" width="20" height="3" rx="1.5" fill={c} opacity="0.12" />
        </>
      );
    case "bd":
      // Comic speech bubbles (POW!)
      return (
        <>
          <rect x="6" y="12" width="36" height="28" rx="6" fill="white" opacity="0.5" />
          <rect x="6" y="12" width="36" height="28" rx="6" stroke={c} strokeWidth="2" opacity="0.3" />
          <path d="M18 40l6-4 6 6z" fill="white" opacity="0.5" />
          <path d="M18 40l6-4 6 6z" stroke={c} strokeWidth="2" opacity="0.3" fill="none" />
          <text x="24" y="30" textAnchor="middle" fontFamily="system-ui" fontSize="10" fontWeight="800" fill={c} opacity="0.35">POW!</text>
          <rect x="38" y="30" width="32" height="24" rx="6" fill="white" opacity="0.4" />
          <rect x="38" y="30" width="32" height="24" rx="6" stroke={c} strokeWidth="1.5" opacity="0.2" />
          <line x1="44" y1="40" x2="64" y2="40" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.15" />
          <line x1="44" y1="46" x2="58" y2="46" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.12" />
          <path d="M56 54l4-2 2 6z" fill="white" opacity="0.4" />
        </>
      );
    case "science-fiction":
      // Rocket
      return (
        <>
          <path d="M40 8c-6 10-10 26-10 40h20C50 34 46 18 40 8z" fill="white" opacity="0.5" />
          <path d="M40 8c-6 10-10 26-10 40h20C50 34 46 18 40 8z" stroke={c} strokeWidth="2" opacity="0.35" fill="none" />
          <circle cx="40" cy="30" r="5" fill={c} opacity="0.2" />
          <circle cx="40" cy="30" r="3" stroke={c} strokeWidth="1" opacity="0.15" fill="none" />
          <path d="M30 48l-6 10h12z" fill={c} opacity="0.15" />
          <path d="M50 48l6 10H44z" fill={c} opacity="0.15" />
          <rect x="35" y="48" width="10" height="6" rx="1" fill={c} opacity="0.12" />
          <path d="M37 54l-2 10M43 54l2 10M40 54v12" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
          <circle cx="24" cy="20" r="1.5" fill={c} opacity="0.15" />
          <circle cx="58" cy="28" r="1" fill={c} opacity="0.12" />
        </>
      );
    case "romance":
      // Heart
      return (
        <>
          <path d="M40 62C28 50 12 40 12 28c0-10 8-16 16-16 6 0 10 3 12 7 2-4 6-7 12-7 8 0 16 6 16 16 0 12-16 22-28 34z" fill={c} opacity="0.15" />
          <path d="M40 62C28 50 12 40 12 28c0-10 8-16 16-16 6 0 10 3 12 7 2-4 6-7 12-7 8 0 16 6 16 16 0 12-16 22-28 34z" stroke={c} strokeWidth="2" opacity="0.35" fill="none" />
          <path d="M22 28c0-4 3-8 6-8" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.2" fill="none" />
        </>
      );
    case "biographie":
      // Person silhouette / portrait frame
      return (
        <>
          <rect x="16" y="10" width="48" height="60" rx="3" fill="white" opacity="0.4" />
          <rect x="16" y="10" width="48" height="60" rx="3" stroke={c} strokeWidth="2" opacity="0.25" />
          <rect x="18" y="12" width="44" height="56" rx="2" stroke={c} strokeWidth="0.5" opacity="0.1" fill="none" />
          <circle cx="40" cy="32" r="10" fill={c} opacity="0.15" />
          <path d="M24 62c0-10 8-16 16-16s16 6 16 16" fill={c} opacity="0.1" />
        </>
      );
    case "cuisine":
      // Chef hat and utensils
      return (
        <>
          <path d="M26 36c-6-2-10-8-10-14 0-8 6-12 12-12 2 0 4 .5 6 1.5C36 8 38 6 40 6s4 2 6 5.5c2-1 4-1.5 6-1.5 6 0 12 4 12 12 0 6-4 12-10 14" stroke={c} strokeWidth="2" opacity="0.3" fill="white" fillOpacity="0.5" />
          <rect x="26" y="36" width="28" height="6" rx="2" fill={c} opacity="0.15" />
          <rect x="28" y="42" width="24" height="16" rx="2" fill="white" opacity="0.4" />
          <rect x="28" y="42" width="24" height="16" rx="2" stroke={c} strokeWidth="1.5" opacity="0.2" />
          <line x1="22" y1="68" x2="22" y2="52" stroke={c} strokeWidth="2" strokeLinecap="round" opacity="0.2" />
          <path d="M20 52h4v-6h-4z" fill={c} opacity="0.15" />
          <line x1="58" y1="68" x2="58" y2="54" stroke={c} strokeWidth="2" strokeLinecap="round" opacity="0.2" />
          <circle cx="58" cy="52" r="3" stroke={c} strokeWidth="1.5" opacity="0.2" fill="none" />
        </>
      );
    case "thriller":
      // Eye
      return (
        <>
          <path d="M10 38C18 24 28 18 40 18s22 6 30 20c-8 14-18 20-30 20S18 52 10 38z" fill="white" opacity="0.4" />
          <path d="M10 38C18 24 28 18 40 18s22 6 30 20c-8 14-18 20-30 20S18 52 10 38z" stroke={c} strokeWidth="2" opacity="0.3" fill="none" />
          <circle cx="40" cy="38" r="12" fill={c} opacity="0.12" />
          <circle cx="40" cy="38" r="8" fill={c} opacity="0.2" />
          <circle cx="40" cy="38" r="4" fill={c} opacity="0.35" />
          <circle cx="43" cy="35" r="2" fill="white" opacity="0.5" />
        </>
      );
    case "fantasy":
      // Wizard hat with stars
      return (
        <>
          <path d="M40 6L22 60h36z" fill="white" opacity="0.4" />
          <path d="M40 6L22 60h36z" stroke={c} strokeWidth="2" opacity="0.3" fill="none" />
          <ellipse cx="40" cy="60" rx="22" ry="6" fill={c} opacity="0.12" />
          <ellipse cx="40" cy="60" rx="22" ry="6" stroke={c} strokeWidth="1.5" opacity="0.2" fill="none" />
          <path d="M46 10c4-2 8 0 6 4" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" fill="none" />
          <path d="M34 30l1.5 3 3.3.5-2.4 2.3.6 3.2L34 37l-3 1.8.6-3.2-2.4-2.3 3.3-.5z" fill={c} opacity="0.25" />
          <path d="M44 44l1 2 2.2.3-1.6 1.6.4 2.2L44 49l-2 1.2.4-2.2-1.6-1.6 2.2-.3z" fill={c} opacity="0.2" />
          <circle cx="38" cy="22" r="1.5" fill={c} opacity="0.2" />
        </>
      );

    // ── Defaults ──
    default:
      if (getCategoryConfig(genre, "Child").type === "children") {
        // Default child: open book with star
        return (
          <>
            <rect x="8" y="24" width="64" height="48" rx="6" fill="white" opacity="0.5" />
            <rect x="8" y="24" width="64" height="48" rx="6" stroke={c} strokeWidth="2" opacity="0.3" />
            <line x1="40" y1="28" x2="40" y2="68" stroke={c} strokeWidth="1.5" opacity="0.15" />
            <line x1="16" y1="38" x2="34" y2="38" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
            <line x1="16" y1="45" x2="30" y2="45" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.15" />
            <line x1="46" y1="38" x2="64" y2="38" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
            <line x1="46" y1="45" x2="60" y2="45" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.15" />
            <path d="M40 8l2.5 5 5.5.8-4 3.9.9 5.5L40 20.5l-4.9 2.7.9-5.5-4-3.9 5.5-.8z" fill={c} opacity="0.25" />
          </>
        );
      }
      // Default adult: closed book with bookmark
      return (
        <>
          <rect x="14" y="14" width="52" height="58" rx="3" fill={c} opacity="0.06" />
          <rect x="10" y="10" width="52" height="58" rx="3" fill="white" opacity="0.6" />
          <rect x="10" y="10" width="52" height="58" rx="3" stroke={c} strokeWidth="1.5" opacity="0.25" />
          <line x1="18" y1="10" x2="18" y2="68" stroke={c} strokeWidth="1" opacity="0.12" />
          <rect x="24" y="22" width="32" height="2.5" rx="1.25" fill={c} opacity="0.2" />
          <rect x="24" y="28" width="24" height="2" rx="1" fill={c} opacity="0.14" />
          <line x1="24" y1="36" x2="56" y2="36" stroke={c} strokeWidth="0.5" opacity="0.1" />
          <rect x="24" y="42" width="32" height="1.5" rx="0.75" fill={c} opacity="0.08" />
          <rect x="24" y="47" width="26" height="1.5" rx="0.75" fill={c} opacity="0.06" />
          <path d="M48 10v18l-4-3-4 3V10" fill={c} opacity="0.2" />
        </>
      );
  }
}

export default function BookPlaceholder({ genre, section }: BookPlaceholderProps) {
  const cfg = getCategoryConfig(genre, section);
  const isChild = cfg.type === "children";
  const label = genre || (isChild ? "Enfant" : "Adulte");

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center p-[12%] select-none"
      style={{ backgroundColor: cfg.bg }}
    >
      <div
        className="w-8 h-1 rounded-full mb-4 opacity-40"
        style={{ backgroundColor: cfg.color }}
      />

      <svg
        viewBox="0 0 80 80"
        className="w-[50%] max-w-[80px] mb-4"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <CategoryIcon genre={genre} color={cfg.color} />
      </svg>

      <span
        className="text-[11px] font-semibold tracking-wide text-center leading-tight px-2"
        style={{ color: cfg.text }}
      >
        {label}
      </span>

      <span
        className="text-[9px] mt-1 font-medium opacity-50 tracking-wider uppercase"
        style={{ color: cfg.color }}
      >
        {isChild ? "Enfant" : "Adulte"}
      </span>

      <div
        className="w-5 h-0.5 rounded-full mt-3 opacity-25"
        style={{ backgroundColor: cfg.color }}
      />
    </div>
  );
}
