"use client";

import { useState, useRef } from "react";
import type { Book } from "./BookGrid";
import { getImageSrc, getThumbnail } from "@/lib/image-url";
import { compressImage } from "@/lib/compress-image";

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
  const [publisher, setPublisher] = useState(book.publisher);
  const [isbn, setIsbn] = useState(book.isbn);
  const [volume, setVolume] = useState(book.volume);
  const [section, setSection] = useState(book.section);

  const [customThumb, setCustomThumb] = useState(book.customThumbnailUrl || "");
  const [thumbPreview, setThumbPreview] = useState("");
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const thumbInputRef = useRef<HTMLInputElement>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/books/${book.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, author, genre, publisher, isbn, volume, section,
          customThumbnailUrl: customThumb,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }
      setEditing(false);
      if (thumbPreview) URL.revokeObjectURL(thumbPreview);
      setThumbPreview("");
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
    setPublisher(book.publisher);
    setIsbn(book.isbn);
    setVolume(book.volume);
    setSection(book.section);
    setCustomThumb(book.customThumbnailUrl || "");
    if (thumbPreview) URL.revokeObjectURL(thumbPreview);
    setThumbPreview("");
    setUrlInput("");
    setShowUrlInput(false);
    setEditing(false);
    setError(null);
  }

  async function handleThumbUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingThumb(true);
    setError(null);
    setThumbPreview(URL.createObjectURL(file));

    try {
      const compressed = await compressImage(file);
      const formData = new FormData();
      formData.append("image", compressed);

      const res = await fetch("/api/upload-thumbnail", { method: "POST", body: formData });
      if (!res.ok) {
        let detail = `HTTP ${res.status}`;
        try { const d = await res.json(); detail = d.error || detail; } catch { /* */ }
        throw new Error(`Upload failed: ${detail}`);
      }
      const data = await res.json();
      setCustomThumb(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Thumbnail upload failed");
      setThumbPreview("");
    } finally {
      setUploadingThumb(false);
      if (thumbInputRef.current) thumbInputRef.current.value = "";
    }
  }

  function handlePasteUrl() {
    const url = urlInput.trim();
    if (!url) return;
    setCustomThumb(url);
    setThumbPreview("");
    setShowUrlInput(false);
    setUrlInput("");
  }

  function handleRemoveThumb() {
    setCustomThumb("");
    if (thumbPreview) URL.revokeObjectURL(thumbPreview);
    setThumbPreview("");
  }

  const busy = saving || deleting || uploadingThumb;
  const currentThumbSrc = thumbPreview
    || (customThumb ? getThumbnail({ customThumbnailUrl: customThumb, section }) : "");
  const placeholderSrc = getThumbnail({ customThumbnailUrl: "", section });

  const inputCls =
    "w-full border border-warm-300 rounded-lg px-3 py-2 text-warm-900 focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
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

          {editing ? (
            <div className="space-y-3">
              {/* Thumbnail management */}
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-2">Thumbnail</label>
                <div className="flex items-start gap-4">
                  <div className="w-20 h-28 rounded-lg overflow-hidden bg-warm-100 border border-warm-200 shrink-0">
                    <img
                      src={currentThumbSrc || placeholderSrc}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <label className="cursor-pointer px-3 py-1.5 bg-warm-100 hover:bg-warm-200 text-warm-700 text-xs font-medium rounded-lg transition-colors">
                        {uploadingThumb ? "Uploading…" : "Upload image"}
                        <input
                          ref={thumbInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleThumbUpload}
                          disabled={busy}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowUrlInput(!showUrlInput)}
                        disabled={busy}
                        className="px-3 py-1.5 bg-warm-100 hover:bg-warm-200 text-warm-700 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                      >
                        Paste URL
                      </button>
                      {customThumb && (
                        <button
                          type="button"
                          onClick={handleRemoveThumb}
                          disabled={busy}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    {showUrlInput && (
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          placeholder="https://example.com/cover.jpg"
                          className="flex-1 border border-warm-300 rounded-lg px-2 py-1 text-xs text-warm-900 focus:outline-none focus:ring-1 focus:ring-accent/30"
                        />
                        <button
                          type="button"
                          onClick={handlePasteUrl}
                          disabled={!urlInput.trim()}
                          className="px-2 py-1 bg-accent text-white text-xs rounded-lg font-medium disabled:opacity-50"
                        >
                          Set
                        </button>
                      </div>
                    )}
                    <p className="text-warm-400 text-xs">
                      {customThumb ? "Custom thumbnail set" : "Using section placeholder"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1">Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} disabled={busy} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1">Author</label>
                <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} disabled={busy} className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1">Genre</label>
                  <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} disabled={busy} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1">Publisher</label>
                  <input type="text" value={publisher} onChange={(e) => setPublisher(e.target.value)} disabled={busy} className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-warm-700 mb-1">ISBN</label>
                  <input type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)} disabled={busy} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1">Volume</label>
                  <input type="text" value={volume} onChange={(e) => setVolume(e.target.value)} disabled={busy} placeholder="e.g. 1" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1">Section</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setSection("Adult")} disabled={busy}
                    className={`flex-1 py-2 rounded-lg font-medium transition-colors ${section === "Adult" ? "bg-warm-700 text-white" : "bg-warm-100 text-warm-600 hover:bg-warm-200"} disabled:opacity-50`}>
                    Adult
                  </button>
                  <button type="button" onClick={() => setSection("Child")} disabled={busy}
                    className={`flex-1 py-2 rounded-lg font-medium transition-colors ${section === "Child" ? "bg-warm-700 text-white" : "bg-warm-100 text-warm-600 hover:bg-warm-200"} disabled:opacity-50`}>
                    Child
                  </button>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleCancel} disabled={busy}
                  className="flex-1 py-2.5 rounded-lg font-medium bg-warm-100 text-warm-600 hover:bg-warm-200 transition-colors disabled:opacity-50">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={busy || !title.trim()}
                  className="flex-1 py-2.5 rounded-lg font-semibold bg-accent hover:bg-accent-light text-white transition-colors disabled:opacity-50">
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* View mode: show thumbnail + scanned image side by side */}
              <div className="flex gap-4 justify-center">
                <div className="text-center">
                  <img
                    src={getThumbnail({ customThumbnailUrl: book.customThumbnailUrl, section: book.section })}
                    alt="Thumbnail"
                    className="h-40 rounded-lg shadow-sm object-cover mx-auto"
                  />
                  <p className="text-warm-400 text-xs mt-1">
                    {book.customThumbnailUrl ? "Custom thumbnail" : "Placeholder"}
                  </p>
                </div>
                {book.imagePath && (
                  <div className="text-center">
                    <img
                      src={getImageSrc(book.imagePath)}
                      alt="Scanned photo"
                      className="h-40 rounded-lg shadow-sm object-contain mx-auto"
                    />
                    <p className="text-warm-400 text-xs mt-1">Scanned photo</p>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold text-warm-800">{book.title}</h3>
              <p className="text-warm-600">{book.author}</p>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm pt-1">
                {book.genre && (
                  <div>
                    <span className="text-warm-400">Genre: </span>
                    <span className="text-warm-600">{book.genre}</span>
                  </div>
                )}
                {book.publisher && (
                  <div>
                    <span className="text-warm-400">Publisher: </span>
                    <span className="text-warm-600">{book.publisher}</span>
                  </div>
                )}
                {book.volume && (
                  <div>
                    <span className="text-warm-400">Volume: </span>
                    <span className="text-warm-600">{book.volume}</span>
                  </div>
                )}
                {book.isbn && (
                  <div className="col-span-2">
                    <span className="text-warm-400">ISBN: </span>
                    <span className="text-warm-600 font-mono text-xs">{book.isbn}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm pt-1">
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
                    <button onClick={() => setConfirmDelete(false)} disabled={deleting}
                      className="flex-1 py-2.5 rounded-lg font-medium bg-warm-100 text-warm-600 hover:bg-warm-200 transition-colors disabled:opacity-50">
                      No
                    </button>
                    <button onClick={handleDelete} disabled={deleting}
                      className="flex-1 py-2.5 rounded-lg font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50">
                      {deleting ? "Deleting…" : "Yes, Delete"}
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmDelete(true)}
                    className="flex-1 py-2.5 rounded-lg font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
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
