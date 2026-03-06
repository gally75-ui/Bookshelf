"use client";

import { getThumbnail } from "@/lib/image-url";
import { getCategoryConfig } from "@/lib/category-theme";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  publisher: string;
  volume: string;
  genre: string;
  section: string;
  customThumbnailUrl: string;
  onClick: (id: string) => void;
}

export default function BookCard({
  id,
  title,
  author,
  publisher,
  volume,
  genre,
  section,
  customThumbnailUrl,
  onClick,
}: BookCardProps) {
  const thumbSrc = getThumbnail({ customThumbnailUrl, genre, section });
  const cfg = getCategoryConfig(genre, section);

  return (
    <button
      onClick={() => onClick(id)}
      className="group text-left bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
      style={{ borderLeft: `3px solid ${cfg.color}`, borderTop: '1px solid #e2d5c3', borderRight: '1px solid #e2d5c3', borderBottom: '1px solid #e2d5c3' }}
    >
      <div className="aspect-[3/4] overflow-hidden bg-warm-100">
        <img
          src={thumbSrc}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>
      <div className="p-2.5">
        <h3 className="font-semibold text-warm-800 text-xs leading-tight line-clamp-2">
          {title}{volume ? ` (Vol. ${volume})` : ""}
        </h3>
        <p className="text-warm-500 text-[11px] mt-0.5 truncate">{author}</p>
        {publisher && (
          <p className="text-warm-400 text-[11px] truncate">{publisher}</p>
        )}
        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
          {genre && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full font-medium leading-tight"
              style={{ backgroundColor: cfg.bg, color: cfg.text }}
            >
              {genre}
            </span>
          )}
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium leading-tight ${
              section === "Child"
                ? "bg-amber-100 text-amber-700"
                : "bg-warm-100 text-warm-600"
            }`}
          >
            {section === "Child" ? "Enfant" : "Adulte"}
          </span>
        </div>
      </div>
    </button>
  );
}
