"use client";

import { getCategoryConfig } from "@/lib/category-theme";

interface BookPlaceholderProps {
  genre: string;
  section: string;
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
      {/* Decorative top accent */}
      <div
        className="w-8 h-1 rounded-full mb-4 opacity-40"
        style={{ backgroundColor: cfg.color }}
      />

      {/* Book illustration */}
      <svg
        viewBox="0 0 80 100"
        className="w-[45%] max-w-[80px] mb-4"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {isChild ? (
          <>
            {/* Children: open book with rounded shapes and sparkles */}
            <rect x="4" y="20" width="72" height="68" rx="8" fill="white" opacity="0.7" />
            <rect x="4" y="20" width="72" height="68" rx="8" stroke={cfg.color} strokeWidth="2" opacity="0.3" />
            {/* Spine */}
            <line x1="40" y1="24" x2="40" y2="84" stroke={cfg.color} strokeWidth="1.5" opacity="0.2" />
            {/* Left page lines */}
            <line x1="14" y1="40" x2="34" y2="40" stroke={cfg.color} strokeWidth="2" strokeLinecap="round" opacity="0.25" />
            <line x1="14" y1="48" x2="32" y2="48" stroke={cfg.color} strokeWidth="2" strokeLinecap="round" opacity="0.2" />
            <line x1="14" y1="56" x2="30" y2="56" stroke={cfg.color} strokeWidth="2" strokeLinecap="round" opacity="0.15" />
            {/* Right page lines */}
            <line x1="46" y1="40" x2="66" y2="40" stroke={cfg.color} strokeWidth="2" strokeLinecap="round" opacity="0.25" />
            <line x1="46" y1="48" x2="64" y2="48" stroke={cfg.color} strokeWidth="2" strokeLinecap="round" opacity="0.2" />
            <line x1="46" y1="56" x2="60" y2="56" stroke={cfg.color} strokeWidth="2" strokeLinecap="round" opacity="0.15" />
            {/* Star top-right */}
            <path d="M64 10l2 4 4.5.7-3.2 3.2.8 4.5L64 20l-4.1 2.4.8-4.5-3.2-3.2 4.5-.7z" fill={cfg.color} opacity="0.35" />
            {/* Star top-left */}
            <path d="M18 6l1.3 2.7 3 .4-2.1 2.1.5 3L18 12.5 15.3 14.2l.5-3-2.1-2.1 3-.4z" fill={cfg.color} opacity="0.2" />
            {/* Small dot */}
            <circle cx="52" cy="8" r="2" fill={cfg.color} opacity="0.2" />
            {/* Heart on right page */}
            <path d="M56 66c-1.5-1.5-4-1.5-5.5 0L56 72l5.5-6c-1.5-1.5-4-1.5-5.5 0z" fill={cfg.color} opacity="0.2" />
          </>
        ) : (
          <>
            {/* Adult: closed elegant book with bookmark */}
            {/* Book shadow */}
            <rect x="12" y="14" width="56" height="78" rx="3" fill={cfg.color} opacity="0.08" />
            {/* Book body */}
            <rect x="8" y="10" width="56" height="78" rx="3" fill="white" opacity="0.8" />
            <rect x="8" y="10" width="56" height="78" rx="3" stroke={cfg.color} strokeWidth="1.5" opacity="0.3" />
            {/* Spine line */}
            <line x1="16" y1="10" x2="16" y2="88" stroke={cfg.color} strokeWidth="1" opacity="0.15" />
            {/* Title area */}
            <rect x="22" y="24" width="36" height="2" rx="1" fill={cfg.color} opacity="0.3" />
            <rect x="22" y="30" width="28" height="2" rx="1" fill={cfg.color} opacity="0.2" />
            {/* Decorative line */}
            <line x1="22" y1="40" x2="58" y2="40" stroke={cfg.color} strokeWidth="0.5" opacity="0.15" />
            {/* Content lines */}
            <rect x="22" y="48" width="36" height="1.5" rx="0.75" fill={cfg.color} opacity="0.12" />
            <rect x="22" y="54" width="32" height="1.5" rx="0.75" fill={cfg.color} opacity="0.1" />
            <rect x="22" y="60" width="28" height="1.5" rx="0.75" fill={cfg.color} opacity="0.08" />
            <rect x="22" y="66" width="24" height="1.5" rx="0.75" fill={cfg.color} opacity="0.06" />
            {/* Bookmark ribbon */}
            <path d="M50 10v20l-4-3-4 3V10" fill={cfg.color} opacity="0.25" />
          </>
        )}
      </svg>

      {/* Category label */}
      <span
        className="text-[11px] font-semibold tracking-wide text-center leading-tight px-2"
        style={{ color: cfg.text }}
      >
        {label}
      </span>

      {/* Section subtitle */}
      <span
        className="text-[9px] mt-1 font-medium opacity-50 tracking-wider uppercase"
        style={{ color: cfg.color }}
      >
        {isChild ? "Enfant" : "Adulte"}
      </span>

      {/* Decorative bottom accent */}
      <div
        className="w-5 h-0.5 rounded-full mt-3 opacity-25"
        style={{ backgroundColor: cfg.color }}
      />
    </div>
  );
}
