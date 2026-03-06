"use client";

import BookCard from "./BookCard";

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  publisher: string;
  isbn: string;
  volume: string;
  section: string;
  imagePath: string;
  thumbnailPath: string;
  customThumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface BookGridProps {
  books: Book[];
  onBookClick: (id: string) => void;
}

export default function BookGrid({ books, onBookClick }: BookGridProps) {
  if (books.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4 opacity-30">📚</div>
        <p className="text-warm-500 text-lg font-medium">No books yet</p>
        <p className="text-warm-400 text-sm mt-1">
          Tap &ldquo;+ Add Book&rdquo; to snap a photo and start your collection.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {books.map((book) => (
        <BookCard
          key={book.id}
          id={book.id}
          title={book.title}
          author={book.author}
          publisher={book.publisher}
          volume={book.volume}
          genre={book.genre}
          section={book.section}
          customThumbnailUrl={book.customThumbnailUrl}
          onClick={onBookClick}
        />
      ))}
    </div>
  );
}
