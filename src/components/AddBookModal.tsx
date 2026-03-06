"use client";

import { useState, useRef } from "react";

type Step = "idle" | "uploading" | "review" | "saving";

interface AddBookModalProps {
  onBookAdded: () => void;
}

export default function AddBookModal({ onBookAdded }: AddBookModalProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("idle");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imagePath, setImagePath] = useState("");
  const [thumbnailPath, setThumbnailPath] = useState("");
  const [localPreview, setLocalPreview] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [publisher, setPublisher] = useState("");
  const [isbn, setIsbn] = useState("");
  const [section, setSection] = useState<"Child" | "Adult">("Adult");
  const [lookingUp, setLookingUp] = useState(false);

  function reset() {
    setStep("idle");
    setError(null);
    setInfo(null);
    setImagePath("");
    setThumbnailPath("");
    if (localPreview) URL.revokeObjectURL(localPreview);
    setLocalPreview("");
    setTitle("");
    setAuthor("");
    setGenre("");
    setPublisher("");
    setIsbn("");
    setSection("Adult");
    setLookingUp(false);
  }

  function handleClose() {
    setOpen(false);
    reset();
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setInfo(null);
    setLocalPreview(URL.createObjectURL(file));

    setStep("uploading");
    try {
      const formData = new FormData();
      formData.append("image", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const data = await uploadRes.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await uploadRes.json();
      setImagePath(data.imagePath);
      setThumbnailPath(data.thumbnailPath);
      setTitle(data.title || "");
      setAuthor(data.author || "");
      setGenre(data.genre || "");
      setPublisher(data.publisher || "");
      setIsbn(data.isbn || "");
      setSection(data.section === "Child" ? "Child" : "Adult");

      if (data.isbnSource) {
        setInfo(`Enriched from ${data.isbnSource}`);
      }
      if (data.aiError) {
        setError(`AI could not read the cover: ${data.aiError}. You can type an ISBN below to look up the book.`);
      }

      setStep("review");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("idle");
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleIsbnLookup() {
    if (!isbn.trim()) return;
    setLookingUp(true);
    setError(null);
    setInfo(null);

    try {
      const res = await fetch(`/api/isbn?isbn=${encodeURIComponent(isbn.trim())}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "ISBN not found");
      }
      const data = await res.json();
      if (data.title) setTitle(data.title);
      if (data.author) setAuthor(data.author);
      if (data.publisher) setPublisher(data.publisher);
      if (data.genre) setGenre(data.genre);
      setInfo("Fields updated from Open Library / Google Books");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setLookingUp(false);
    }
  }

  async function handleSave() {
    setStep("saving");
    setError(null);

    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || "Untitled",
          author,
          genre,
          publisher,
          isbn,
          section,
          imagePath,
          thumbnailPath,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save book");
      }

      onBookAdded();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setStep("review");
    }
  }

  const isProcessing = step === "uploading" || step === "saving";
  const inputCls = "w-full border border-warm-300 rounded-lg px-3 py-2 text-warm-900 focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-accent hover:bg-accent-light text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
      >
        + Add Book
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] sm:max-h-[90vh] h-full sm:h-auto overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-warm-200">
              <h2 className="text-lg font-bold text-warm-800">Add a Book</h2>
              <button
                onClick={handleClose}
                disabled={isProcessing}
                className="text-warm-400 hover:text-warm-600 text-xl leading-none disabled:opacity-50"
              >
                &times;
              </button>
            </div>

            <div className="p-5">
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

              {(step === "idle" || step === "uploading") && (
                <div className="text-center">
                  {step === "idle" && (
                    <>
                      <p className="text-warm-500 mb-4">
                        Take a photo or upload an image of your book cover.
                      </p>
                      <label className="inline-block cursor-pointer bg-warm-100 hover:bg-warm-200 text-warm-700 font-medium px-6 py-3 rounded-lg transition-colors">
                        Choose Photo
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </label>
                    </>
                  )}

                  {step === "uploading" && (
                    <div className="py-8">
                      <div className="animate-spin w-8 h-8 border-[3px] border-warm-300 border-t-accent rounded-full mx-auto mb-3" />
                      <p className="text-warm-500 font-medium">Uploading &amp; analyzing…</p>
                      <p className="text-warm-400 text-xs mt-1">AI + public book databases</p>
                    </div>
                  )}
                </div>
              )}

              {(step === "review" || step === "saving") && (
                <div className="space-y-3">
                  {localPreview && (
                    <div className="flex justify-center mb-2">
                      <img
                        src={localPreview}
                        alt="Book cover"
                        className="h-36 rounded-lg shadow-sm object-cover"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-warm-700 mb-1">ISBN / Barcode</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={isbn}
                        onChange={(e) => setIsbn(e.target.value)}
                        disabled={step === "saving" || lookingUp}
                        placeholder="e.g. 978-2-07-036822-8"
                        className={inputCls}
                      />
                      <button
                        type="button"
                        onClick={handleIsbnLookup}
                        disabled={step === "saving" || lookingUp || !isbn.trim()}
                        className="shrink-0 px-3 py-2 bg-warm-100 hover:bg-warm-200 text-warm-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                      >
                        {lookingUp ? "…" : "Lookup"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-warm-700 mb-1">Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                      disabled={step === "saving"} placeholder="Book title" className={inputCls} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-warm-700 mb-1">Author</label>
                    <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)}
                      disabled={step === "saving"} placeholder="Author name" className={inputCls} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-warm-700 mb-1">Genre</label>
                      <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)}
                        disabled={step === "saving"} placeholder="e.g. Fiction" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-warm-700 mb-1">Publisher</label>
                      <input type="text" value={publisher} onChange={(e) => setPublisher(e.target.value)}
                        disabled={step === "saving"} placeholder="e.g. Gallimard" className={inputCls} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-warm-700 mb-1">Section</label>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setSection("Adult")} disabled={step === "saving"}
                        className={`flex-1 py-2 rounded-lg font-medium transition-colors ${section === "Adult" ? "bg-warm-700 text-white" : "bg-warm-100 text-warm-600 hover:bg-warm-200"} disabled:opacity-50`}>
                        Adult
                      </button>
                      <button type="button" onClick={() => setSection("Child")} disabled={step === "saving"}
                        className={`flex-1 py-2 rounded-lg font-medium transition-colors ${section === "Child" ? "bg-warm-700 text-white" : "bg-warm-100 text-warm-600 hover:bg-warm-200"} disabled:opacity-50`}>
                        Child
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button onClick={handleClose} disabled={step === "saving"}
                      className="flex-1 py-2.5 rounded-lg font-medium bg-warm-100 text-warm-600 hover:bg-warm-200 transition-colors disabled:opacity-50">
                      Cancel
                    </button>
                    <button onClick={handleSave} disabled={step === "saving"}
                      className="flex-1 py-2.5 rounded-lg font-semibold bg-accent hover:bg-accent-light text-white transition-colors disabled:opacity-50">
                      {step === "saving" ? "Saving…" : "Save Book"}
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
