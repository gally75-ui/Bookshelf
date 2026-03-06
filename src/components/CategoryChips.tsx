"use client";

import { CATEGORIES, type CategoryConfig } from "@/lib/category-theme";

interface CategoryChipsProps {
  active: string | null;
  onChange: (genre: string | null) => void;
  availableGenres: string[];
}

export default function CategoryChips({ active, onChange, availableGenres }: CategoryChipsProps) {
  const chips = availableGenres
    .map((g) => {
      const key = Object.keys(CATEGORIES).find(
        (k) => k.toLowerCase() === g.toLowerCase()
      );
      const cfg: CategoryConfig | undefined = key ? CATEGORIES[key] : undefined;
      return { genre: g, cfg };
    })
    .sort((a, b) => a.genre.localeCompare(b.genre));

  if (chips.length === 0) return null;

  return (
    <div className="flex gap-1.5 flex-wrap">
      <button
        onClick={() => onChange(null)}
        className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
          active === null
            ? "bg-warm-700 text-white"
            : "bg-warm-100 text-warm-500 hover:bg-warm-200"
        }`}
      >
        Tous
      </button>
      {chips.map(({ genre, cfg }) => {
        const isActive = active === genre;
        return (
          <button
            key={genre}
            onClick={() => onChange(isActive ? null : genre)}
            className="text-xs px-3 py-1 rounded-full font-medium transition-all"
            style={
              isActive
                ? { backgroundColor: cfg?.color || "#a68a5b", color: "#fff" }
                : { backgroundColor: cfg?.bg || "#faf6f1", color: cfg?.text || "#6b5530" }
            }
          >
            {genre}
          </button>
        );
      })}
    </div>
  );
}
