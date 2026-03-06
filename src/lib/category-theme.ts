export interface CategoryConfig {
  label: string;
  color: string;
  bg: string;
  text: string;
  type: "children" | "adult";
}

const CATEGORIES: Record<string, CategoryConfig> = {
  // --- Children ---
  "Contes":            { label: "Contes",            color: "#ec4899", bg: "#fce7f3", text: "#9d174d", type: "children" },
  "Histoires":         { label: "Histoires",         color: "#60a5fa", bg: "#dbeafe", text: "#1e40af", type: "children" },
  "Livres-jeux":       { label: "Livres-jeux",       color: "#f97316", bg: "#ffedd5", text: "#9a3412", type: "children" },
  "Albums illustrés":  { label: "Albums illustrés",  color: "#a78bfa", bg: "#ede9fe", text: "#5b21b6", type: "children" },
  "Éveil":             { label: "Éveil",             color: "#34d399", bg: "#d1fae5", text: "#065f46", type: "children" },
  // --- Adult ---
  "Littérature":       { label: "Littérature",       color: "#3b82f6", bg: "#dbeafe", text: "#1e3a8a", type: "adult" },
  "Policier":          { label: "Policier",          color: "#1e3a5f", bg: "#e0e7ff", text: "#1e3a5f", type: "adult" },
  "Aventures":         { label: "Aventures",         color: "#14b8a6", bg: "#ccfbf1", text: "#134e4a", type: "adult" },
  "Poche":             { label: "Poche",             color: "#78716c", bg: "#f5f5f4", text: "#44403c", type: "adult" },
  "Documentaire":      { label: "Documentaire",      color: "#22c55e", bg: "#dcfce7", text: "#166534", type: "adult" },
  "BD":                { label: "BD",                color: "#ef4444", bg: "#fee2e2", text: "#991b1b", type: "adult" },
  "Science-Fiction":   { label: "Science-Fiction",    color: "#6366f1", bg: "#e0e7ff", text: "#3730a3", type: "adult" },
  "Romance":           { label: "Romance",           color: "#f472b6", bg: "#fce7f3", text: "#9d174d", type: "adult" },
  "Biographie":        { label: "Biographie",        color: "#a16207", bg: "#fef3c7", text: "#78350f", type: "adult" },
  "Cuisine":           { label: "Cuisine",           color: "#ea580c", bg: "#fff7ed", text: "#9a3412", type: "adult" },
  "Thriller":          { label: "Thriller",          color: "#475569", bg: "#f1f5f9", text: "#1e293b", type: "adult" },
  "Fantasy":           { label: "Fantasy",           color: "#8b5cf6", bg: "#f5f3ff", text: "#4c1d95", type: "adult" },
};

const DEFAULT_ADULT: CategoryConfig =
  { label: "Autre", color: "#a68a5b", bg: "#faf6f1", text: "#6b5530", type: "adult" };
const DEFAULT_CHILD: CategoryConfig =
  { label: "Autre", color: "#f59e0b", bg: "#fef3c7", text: "#92400e", type: "children" };

export function getCategoryConfig(genre: string, section: string): CategoryConfig {
  if (!genre) return section === "Child" ? DEFAULT_CHILD : DEFAULT_ADULT;
  const key = Object.keys(CATEGORIES).find(
    (k) => k.toLowerCase() === genre.toLowerCase()
  );
  if (key) return CATEGORIES[key];
  return section === "Child" ? DEFAULT_CHILD : DEFAULT_ADULT;
}

export function getAllCategories(): CategoryConfig[] {
  return Object.values(CATEGORIES);
}

export function getCategoryNames(): string[] {
  return Object.keys(CATEGORIES);
}

export function getChildCategories(): string[] {
  return Object.keys(CATEGORIES).filter((k) => CATEGORIES[k].type === "children");
}

export function getAdultCategories(): string[] {
  return Object.keys(CATEGORIES).filter((k) => CATEGORIES[k].type === "adult");
}

export { CATEGORIES };
