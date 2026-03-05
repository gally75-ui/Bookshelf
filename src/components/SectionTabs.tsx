"use client";

export type Section = "All" | "Child" | "Adult";

interface SectionTabsProps {
  active: Section;
  onChange: (section: Section) => void;
}

const tabs: Section[] = ["All", "Child", "Adult"];

export default function SectionTabs({ active, onChange }: SectionTabsProps) {
  return (
    <div className="flex gap-1 bg-warm-100 p-1 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            active === tab
              ? "bg-white text-warm-800 shadow-sm"
              : "text-warm-500 hover:text-warm-700"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
