"use client";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  genre: string;
  section: string;
  thumbnailPath: string;
  onClick: (id: string) => void;
}

export default function BookCard({
  id,
  title,
  author,
  genre,
  section,
  thumbnailPath,
  onClick,
}: BookCardProps) {
  return (
    <button
      onClick={() => onClick(id)}
      className="group text-left bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-warm-200"
    >
      <div className="aspect-[3/4] overflow-hidden bg-warm-100">
        <img
          src={thumbnailPath}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-warm-800 text-sm leading-tight line-clamp-2">
          {title}
        </h3>
        <p className="text-warm-500 text-xs mt-1 truncate">{author}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-warm-400 truncate">{genre}</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              section === "Child"
                ? "bg-amber-100 text-amber-700"
                : "bg-warm-100 text-warm-600"
            }`}
          >
            {section}
          </span>
        </div>
      </div>
    </button>
  );
}
