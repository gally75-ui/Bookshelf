"use client";

import { useState } from "react";
import type { Book } from "./BookGrid";

interface BookDetailProps {
  book: Book;
  onClose: () => void;
  onUpdated: (action?: string) => void;
}

export default function BookDetail({ book, onClose, onUpdated }: BookDetailProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [genre, setGenre] = useState(book.genre);
  const [section, setSection] = useState(book.section);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/books/${book.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, genre, section }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }
      setEditing(false);
      onUpdated("updated");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/books/${book.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }
      onUpdated("deleted");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
      setDeleting(false);
    }
  }

  function handleCancel() {
    setTitle(book.title);
    setAuthor(book.author);
    setGenre(book.genre);
    setSection(book.section);
    setEditing(false);
    setError(null);
  }

  const busy = saving || deleting;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-warm-200">
          <h2 className="text-lg font-bold text-warm-800">
            {editing ? "Edit Book" : "Book Details"}
          </h2>
          <button
            onClick={onClose}
            disabled={busy}
            className="text-warm-400 hover:text-warm-600 text-xl leading-none disabled:opacity-50"
          >
            &times;
          </button>
        </div>

        <div className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Full-size image */}
          <div className="flex justify-center">
            <img
              src={book.imagePath}
              alt={book.title}
              className="max-h-64 rounded-lg shadow-sm object-contain"
            />
          </div>

          {editing ? (
            /* Edit form */
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={busy}
                  className="w-full border border-warm-300 rounded-lg px-3 py-2 text-warm-900 focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1">Author</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  disabled={busy}
                  className="w-full border border-warm-300 rounded-lg px-3 py-2 text-warm-900 focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1">Genre</label>
                <input
                  type="text"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  disabled={busy}
                  className="w-full border border-warm-300 rounded-lg px-3 py-2 text-warm-900 focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1">Section</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSection("Adult")}
                    disabled={busy}
                    className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                      section === "Adult"
                        ? "bg-warm-700 text-white"
                        : "bg-warm-100 text-warm-600 hover:bg-warm-200"
                    } disabled:opacity-50`}
                  >
                    Adult
                  </button>
                  <button
                    type="button"
                    onClick={() => setSection("Child")}
                    disabled={busy}
                    className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                      section === "Child"
                        ? "bg-warm-700 text-white"
                        : "bg-warm-100 text-warm-600 hover:bg-warm-200"
                    } disabled:opacity-50`}
                  >
                    Child
                  </button>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCancel}
                  disabled={busy}
                  className="flex-1 py-2.5 rounded-lg font-medium bg-warm-100 text-warm-600 hover:bg-warm-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={busy || !title.trim()}
                  className="flex-1 py-2.5 rounded-lg font-semibold bg-accent hover:bg-accent-light text-white transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          ) : (
            /* View mode */
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-warm-800">{book.title}</h3>
              <p className="text-warm-600">{book.author}</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-warm-400">{book.genre}</span>
                <span
                  className={`px-2 py-0.5 rounded-full font-medium ${
                    book.section === "Child"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-warm-100 text-warm-600"
                  }`}
                >
                  {book.section}
                </span>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setEditing(true)}
                  className="flex-1 py-2.5 rounded-lg font-medium bg-warm-100 text-warm-700 hover:bg-warm-200 transition-colors"
                >
                  Edit
                </button>
                {confirmDelete ? (
                  <div className="flex-1 flex gap-2">
                    <button
                      onClick={() => setConfirmDelete(false)}
                      disabled={deleting}
                      className="flex-1 py-2.5 rounded-lg font-medium bg-warm-100 text-warm-600 hover:bg-warm-200 transition-colors disabled:opacity-50"
                    >
                      No
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="flex-1 py-2.5 rounded-lg font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50"
                    >
                      {deleting ? "Deleting…" : "Yes, Delete"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="flex-1 py-2.5 rounded-lg font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
