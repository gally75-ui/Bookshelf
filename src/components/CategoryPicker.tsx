"use client";

import { getChildCategories, getAdultCategories, getCategoryConfig } from "@/lib/category-theme";

interface CategoryPickerProps {
  value: string;
  section: string;
  onChange: (genre: string) => void;
  disabled?: boolean;
}

export default function CategoryPicker({ value, section, onChange, disabled }: CategoryPickerProps) {
  const childCats = getChildCategories();
  const adultCats = getAdultCategories();
  const categories = section === "Child" ? childCats : adultCats;
  const cfg = getCategoryConfig(value, section);

  return (
    <div>
      <label className="block text-sm font-medium text-warm-700 mb-1">Category / Genre</label>
      <div className="flex gap-1.5 flex-wrap mb-2">
        {categories.map((cat) => {
          const c = getCategoryConfig(cat, section);
          const isActive = value.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onChange(cat)}
              disabled={disabled}
              className="text-[11px] px-2 py-1 rounded-full font-medium transition-all disabled:opacity-50"
              style={
                isActive
                  ? { backgroundColor: c.color, color: "#fff" }
                  : { backgroundColor: c.bg, color: c.text }
              }
            >
              {cat}
            </button>
          );
        })}
      </div>
      {value && (
        <div className="flex items-center gap-2 text-xs text-warm-500">
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ backgroundColor: cfg.color }}
          />
          {value}
          <button
            type="button"
            onClick={() => onChange("")}
            disabled={disabled}
            className="text-warm-400 hover:text-red-500 ml-1 disabled:opacity-50"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
}
