"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import AddBookModal from "@/components/AddBookModal";
import SectionTabs, { type Section } from "@/components/SectionTabs";
import SearchBar from "@/components/SearchBar";
import BookGrid, { type Book } from "@/components/BookGrid";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [section, setSection] = useState<Section>("All");
  const [search, setSearch] = useState("");

  const fetchBooks = useCallback(async () => {
    try {
      const res = await fetch("/api/books");
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      }
    } catch (err) {
      console.error("Failed to fetch books:", err);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return books.filter((book) => {
      if (section !== "All" && book.section !== section) return false;
      if (
        q &&
        !book.title.toLowerCase().includes(q) &&
        !book.author.toLowerCase().includes(q) &&
        !book.genre.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [books, section, search]);

  function handleBookClick(id: string) {
    // Will be implemented in task 7 (book detail view)
    console.log("Book clicked:", id);
  }

  return (
    <main className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-warm-800">Bookshelf</h1>
          <p className="text-warm-500 text-sm mt-0.5">
            Your personal book collection.
          </p>
        </div>
        <AddBookModal onBookAdded={fetchBooks} />
      </div>

      <div className="sticky top-0 z-10 bg-cream pt-2 pb-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <SectionTabs active={section} onChange={setSection} />
          <SearchBar value={search} onChange={setSearch} />
        </div>
      </div>

      <BookGrid books={filtered} onBookClick={handleBookClick} />
    </main>
  );
}
