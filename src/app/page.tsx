"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import AddBookModal from "@/components/AddBookModal";
import SectionTabs, { type Section } from "@/components/SectionTabs";
import SearchBar from "@/components/SearchBar";
import BookGrid, { type Book } from "@/components/BookGrid";
import BookDetail from "@/components/BookDetail";
import Toast from "@/components/Toast";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState<Section>("All");
  const [search, setSearch] = useState("");
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const selectedBook = useMemo(
    () => books.find((b) => b.id === selectedBookId) || null,
    [books, selectedBookId]
  );

  const fetchBooks = useCallback(async () => {
    try {
      const res = await fetch("/api/books");
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      }
    } catch (err) {
      console.error("Failed to fetch books:", err);
    } finally {
      setLoading(false);
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
        !book.genre.toLowerCase().includes(q) &&
        !book.publisher.toLowerCase().includes(q) &&
        !book.isbn.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [books, section, search]);

  return (
    <main className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-warm-800">Bookshelf</h1>
          <p className="text-warm-500 text-sm mt-0.5">
            Your personal book collection.
          </p>
        </div>
        <div className="flex gap-2">
          <AddBookModal
            mode="manual"
            onBookAdded={() => {
              fetchBooks();
              setToast({ message: "Book added!", type: "success" });
            }}
          />
          <AddBookModal
            mode="scan"
            onBookAdded={() => {
              fetchBooks();
              setToast({ message: "Book added!", type: "success" });
            }}
          />
        </div>
      </div>

      <div className="sticky top-0 z-10 bg-cream pt-2 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <SectionTabs active={section} onChange={setSection} />
          <SearchBar value={search} onChange={setSearch} />
        </div>
        {!loading && (
          <p className="text-warm-400 text-xs mt-2">
            {filtered.length} {filtered.length === 1 ? "book" : "books"}
            {section !== "All" && ` in ${section}`}
            {search && ` matching "${search}"`}
          </p>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-warm-200 rounded-xl" />
              <div className="mt-3 space-y-2">
                <div className="h-4 bg-warm-200 rounded w-3/4" />
                <div className="h-3 bg-warm-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <BookGrid books={filtered} onBookClick={setSelectedBookId} />
      )}

      {selectedBook && (
        <BookDetail
          book={selectedBook}
          onClose={() => setSelectedBookId(null)}
          onUpdated={(action?: string) => {
            fetchBooks();
            if (action === "deleted") {
              setToast({ message: "Book deleted.", type: "success" });
            } else if (action === "updated") {
              setToast({ message: "Book updated!", type: "success" });
            }
          }}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </main>
  );
}
