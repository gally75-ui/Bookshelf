"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder="Search by title, author, or genre…"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full max-w-md border border-warm-300 rounded-lg px-4 py-2.5 text-warm-900 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white"
    />
  );
}
