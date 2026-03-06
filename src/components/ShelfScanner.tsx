"use client";

import { useState, useRef } from "react";
import { compressImage } from "@/lib/compress-image";

type ScanMode = "cover" | "shelf";
type Step = "idle" | "uploading" | "analyzing" | "review" | "saving";

interface DetectedBook {
  id: string;
  title: string;
  author: string;
  genre: string;
  publisher: string;
  isbn: string;
  volume: string;
  section: "Child" | "Adult";
  selected: boolean;
}

interface ShelfScannerProps {
  onBooksAdded: (count: number) => void;
}

let nextId = 0;

export default function ShelfScanner({ onBooksAdded }: ShelfScannerProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ScanMode>("shelf");
  const [step, setStep] = useState<Step>("idle");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [thumbnailPath, setThumbnailPath] = useState("");
  const [books, setBooks] = useState<DetectedBook[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function reset() {
    setStep("idle");
    setError(null);
    setInfo(null);
    if (localPreview) URL.revokeObjectURL(localPreview);
    setLocalPreview("");
    setImagePath("");
    setThumbnailPath("");
    setBooks([]);
  }

  function handleClose() {
    setOpen(false);
    reset();
  }

  function updateBook(id: string, field: keyof DetectedBook, value: string | boolean) {
    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [field]: value } : b))
    );
  }

  function removeBook(id: string) {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  }

  function toggleAll(selected: boolean) {
    setBooks((prev) => prev.map((b) => ({ ...b, selected })));
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setInfo(null);
    setLocalPreview(URL.createObjectURL(file));
    setStep("uploading");

    try {
      const compressed = await compressImage(file);
      const formData = new FormData();
      formData.append("image", compressed);

      let uploadRes: Response;
      try {
        uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      } catch (networkErr) {
        const sizeMB = (compressed.size / 1024 / 1024).toFixed(1);
        throw new Error(
          `Network error (file: ${sizeMB}MB). Check your connection or try a smaller image. Detail: ${networkErr instanceof Error ? networkErr.message : "Unknown"}`
        );
      }

      if (!uploadRes.ok) {
        let detail = `HTTP ${uploadRes.status}`;
        try { const d = await uploadRes.json(); detail = d.error || detail; } catch { /* not JSON */ }
        throw new Error(`Upload failed: ${detail}`);
      }

      const uploadData = await uploadRes.json();
      setImagePath(uploadData.imagePath);
      setThumbnailPath(uploadData.thumbnailPath);

      setStep("analyzing");
      const endpoint = mode === "shelf" ? "/api/analyze-shelf" : "/api/analyze";

      let analyzeRes: Response;
      try {
        analyzeRes = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imagePath: uploadData.imagePath }),
        });
      } catch (networkErr) {
        throw new Error(
          `AI analysis network error: ${networkErr instanceof Error ? networkErr.message : "Unknown"}`
        );
      }

      if (!analyzeRes.ok) {
        let detail = `HTTP ${analyzeRes.status}`;
        try { const d = await analyzeRes.json(); detail = d.error || detail; } catch { /* */ }
        throw new Error(`Analysis failed: ${detail}`);
      }

      const analyzeData = await analyzeRes.json();

      if (mode === "shelf") {
        const detected: DetectedBook[] = (analyzeData.books || []).map(
          (b: Record<string, string>) => ({
            id: `shelf-${nextId++}`,
            title: b.title || "",
            author: b.author || "",
            genre: b.genre || "",
            publisher: b.publisher || "",
            isbn: b.isbn || "",
            volume: b.volume || "",
            section: b.section === "Child" ? "Child" as const : "Adult" as const,
            selected: true,
          })
        );
        setBooks(detected);
        setInfo(`AI detected ${detected.length} book${detected.length !== 1 ? "s" : ""} on the shelf.`);
        setStep("review");
      } else {
        const detected: DetectedBook[] = [
          {
            id: `cover-${nextId++}`,
            title: analyzeData.title || "",
            author: analyzeData.author || "",
            genre: analyzeData.genre || "",
            publisher: analyzeData.publisher || "",
            isbn: analyzeData.isbn || "",
            volume: analyzeData.volume || "",
            section: analyzeData.section === "Child" ? "Child" : "Adult",
            selected: true,
          },
        ];
        setBooks(detected);
        setStep("review");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("idle");
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSaveAll() {
    const toSave = books.filter((b) => b.selected && b.title.trim());
    if (toSave.length === 0) {
      setError("No books with titles selected.");
      return;
    }

    setStep("saving");
    setError(null);

    try {
      const payload = toSave.map((b) => ({
        title: b.title,
        author: b.author,
        genre: b.genre,
        publisher: b.publisher,
        isbn: b.isbn,
        volume: b.volume,
        section: b.section,
        imagePath,
        thumbnailPath,
      }));

      let res: Response;
      try {
        res = await fetch("/api/books/batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ books: payload }),
        });
      } catch (networkErr) {
        throw new Error(
          `Network error while saving: ${networkErr instanceof Error ? networkErr.message : "Unknown"}`
        );
      }

      if (!res.ok) {
        let detail = `HTTP ${res.status}`;
        try { const d = await res.json(); detail = d.error || detail; } catch { /* */ }
        throw new Error(`Save failed: ${detail}`);
      }

      const result = await res.json();
      onBooksAdded(result.count);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setStep("review");
    }
  }

  const selectedCount = books.filter((b) => b.selected && b.title.trim()).length;
  const inputCls =
    "w-full border border-warm-300 rounded px-2 py-1 text-sm text-warm-900 focus:outline-none focus:ring-1 focus:ring-accent/30";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="font-semibold px-4 py-2.5 rounded-lg transition-colors text-sm bg-warm-800 hover:bg-warm-700 text-white"
      >
        Scan Shelf
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-warm-200 shrink-0">
              <h2 className="text-lg font-bold text-warm-800">Book Scanner</h2>
              <button
                onClick={handleClose}
                disabled={step === "saving"}
                className="text-warm-400 hover:text-warm-600 text-xl leading-none disabled:opacity-50"
              >
                &times;
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {info && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                  {info}
                </div>
              )}

              {/* Mode toggle + photo picker */}
              {step === "idle" && (
                <div className="space-y-6">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => setMode("cover")}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        mode === "cover"
                          ? "bg-accent text-white"
                          : "bg-warm-100 text-warm-600 hover:bg-warm-200"
                      }`}
                    >
                      Single Cover
                    </button>
                    <button
                      onClick={() => setMode("shelf")}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        mode === "shelf"
                          ? "bg-accent text-white"
                          : "bg-warm-100 text-warm-600 hover:bg-warm-200"
                      }`}
                    >
                      Shelf / Spines
                    </button>
                  </div>

                  <div className="text-center">
                    <p className="text-warm-500 mb-4">
                      {mode === "shelf"
                        ? "Take a photo of your bookshelf. AI will detect every book spine visible."
                        : "Take a photo of a single book cover for detailed extraction."}
                    </p>
                    <label className="inline-block cursor-pointer bg-accent hover:bg-accent-light text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                      {mode === "shelf" ? "Photograph Shelf" : "Photograph Cover"}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Uploading / analyzing spinners */}
              {(step === "uploading" || step === "analyzing") && (
                <div className="text-center py-10">
                  {localPreview && (
                    <img
                      src={localPreview}
                      alt="Preview"
                      className="max-h-32 rounded-lg mx-auto mb-4 shadow-sm"
                    />
                  )}
                  <div className="animate-spin w-8 h-8 border-[3px] border-warm-300 border-t-accent rounded-full mx-auto mb-3" />
                  <p className="text-warm-500 font-medium">
                    {step === "uploading"
                      ? "Uploading image…"
                      : mode === "shelf"
                        ? "AI is scanning every spine…"
                        : "AI is reading the cover…"}
                  </p>
                  {step === "analyzing" && mode === "shelf" && (
                    <p className="text-warm-400 text-xs mt-1">
                      This may take a moment for large shelves.
                    </p>
                  )}
                </div>
              )}

              {/* Review table */}
              {(step === "review" || step === "saving") && (
                <div className="space-y-4">
                  {localPreview && (
                    <img
                      src={localPreview}
                      alt="Shelf"
                      className="max-h-40 rounded-lg mx-auto shadow-sm"
                    />
                  )}

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-warm-600 font-medium">
                      {books.length} book{books.length !== 1 ? "s" : ""} detected
                      {selectedCount < books.length && ` (${selectedCount} selected)`}
                    </p>
                    <div className="flex gap-2 text-xs">
                      <button
                        onClick={() => toggleAll(true)}
                        className="text-accent hover:underline"
                      >
                        Select all
                      </button>
                      <button
                        onClick={() => toggleAll(false)}
                        className="text-warm-400 hover:underline"
                      >
                        Deselect all
                      </button>
                    </div>
                  </div>

                  <div className="border border-warm-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-warm-50 text-warm-500 text-xs uppercase tracking-wide">
                            <th className="px-3 py-2 text-left w-8"></th>
                            <th className="px-3 py-2 text-left">Title</th>
                            <th className="px-3 py-2 text-left">Author</th>
                            <th className="px-3 py-2 text-left hidden sm:table-cell">Vol.</th>
                            <th className="px-3 py-2 text-left hidden md:table-cell">Publisher</th>
                            <th className="px-3 py-2 text-left hidden md:table-cell">Genre</th>
                            <th className="px-3 py-2 text-center">Section</th>
                            <th className="px-3 py-2 w-8"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-warm-100">
                          {books.map((book) => (
                            <tr
                              key={book.id}
                              className={`${book.selected ? "bg-white" : "bg-warm-50 opacity-60"}`}
                            >
                              <td className="px-3 py-2">
                                <input
                                  type="checkbox"
                                  checked={book.selected}
                                  onChange={(e) =>
                                    updateBook(book.id, "selected", e.target.checked)
                                  }
                                  disabled={step === "saving"}
                                  className="accent-accent"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <input
                                  type="text"
                                  value={book.title}
                                  onChange={(e) =>
                                    updateBook(book.id, "title", e.target.value)
                                  }
                                  disabled={step === "saving"}
                                  className={inputCls}
                                  placeholder="Title"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <input
                                  type="text"
                                  value={book.author}
                                  onChange={(e) =>
                                    updateBook(book.id, "author", e.target.value)
                                  }
                                  disabled={step === "saving"}
                                  className={inputCls}
                                  placeholder="Author"
                                />
                              </td>
                              <td className="px-3 py-2 hidden sm:table-cell">
                                <input
                                  type="text"
                                  value={book.volume}
                                  onChange={(e) =>
                                    updateBook(book.id, "volume", e.target.value)
                                  }
                                  disabled={step === "saving"}
                                  className={`${inputCls} w-16`}
                                  placeholder="—"
                                />
                              </td>
                              <td className="px-3 py-2 hidden md:table-cell">
                                <input
                                  type="text"
                                  value={book.publisher}
                                  onChange={(e) =>
                                    updateBook(book.id, "publisher", e.target.value)
                                  }
                                  disabled={step === "saving"}
                                  className={inputCls}
                                  placeholder="Publisher"
                                />
                              </td>
                              <td className="px-3 py-2 hidden md:table-cell">
                                <input
                                  type="text"
                                  value={book.genre}
                                  onChange={(e) =>
                                    updateBook(book.id, "genre", e.target.value)
                                  }
                                  disabled={step === "saving"}
                                  className={inputCls}
                                  placeholder="Genre"
                                />
                              </td>
                              <td className="px-3 py-2 text-center">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateBook(
                                      book.id,
                                      "section",
                                      book.section === "Adult" ? "Child" : "Adult"
                                    )
                                  }
                                  disabled={step === "saving"}
                                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                    book.section === "Child"
                                      ? "bg-amber-100 text-amber-700"
                                      : "bg-warm-100 text-warm-600"
                                  }`}
                                >
                                  {book.section}
                                </button>
                              </td>
                              <td className="px-3 py-2">
                                <button
                                  onClick={() => removeBook(book.id)}
                                  disabled={step === "saving"}
                                  className="text-warm-300 hover:text-red-500 text-lg leading-none disabled:opacity-50"
                                  title="Remove"
                                >
                                  &times;
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => { reset(); }}
                      disabled={step === "saving"}
                      className="flex-1 py-2.5 rounded-lg font-medium bg-warm-100 text-warm-600 hover:bg-warm-200 transition-colors disabled:opacity-50"
                    >
                      Scan Again
                    </button>
                    <button
                      onClick={handleSaveAll}
                      disabled={step === "saving" || selectedCount === 0}
                      className="flex-1 py-2.5 rounded-lg font-semibold bg-accent hover:bg-accent-light text-white transition-colors disabled:opacity-50"
                    >
                      {step === "saving"
                        ? "Saving…"
                        : `Save ${selectedCount} Book${selectedCount !== 1 ? "s" : ""}`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
