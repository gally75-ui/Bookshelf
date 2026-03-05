"use client";

import BookCard from "./BookCard";

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  section: string;
  imagePath: string;
  thumbnailPath: string;
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
      <div className="text-center py-16">
        <p className="text-warm-400 text-lg">No books found.</p>
        <p className="text-warm-300 text-sm mt-1">
          Add your first book to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {books.map((book) => (
        <BookCard
          key={book.id}
          id={book.id}
          title={book.title}
          author={book.author}
          genre={book.genre}
          section={book.section}
          thumbnailPath={book.thumbnailPath}
          onClick={onBookClick}
        />
      ))}
    </div>
  );
}
