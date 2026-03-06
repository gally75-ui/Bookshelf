export interface BookMetadata {
  title: string;
  author: string;
  genre: string;
  publisher: string;
  isbn: string;
  volume: string;
  section: "Child" | "Adult";
}

function groqHeaders() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY not configured");
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
}

function parseBookMetadata(raw: Record<string, unknown>): BookMetadata {
  return {
    title: String(raw.title || ""),
    author: String(raw.author || ""),
    genre: String(raw.genre || ""),
    publisher: String(raw.publisher || ""),
    isbn: String(raw.isbn || ""),
    volume: String(raw.volume || ""),
    section: raw.section === "Child" ? "Child" : "Adult",
  };
}

export async function analyzeBookCover(
  base64Image: string,
  mimeType: string = "image/jpeg"
): Promise<BookMetadata> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: groqHeaders(),
    body: JSON.stringify({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${base64Image}` },
            },
            {
              type: "text",
              text: `You are a book identification expert. Carefully read ALL text visible in this image (front cover, back cover, spine, title page, etc.).

From the extracted text, identify and categorize:
- "title": the book title
- "author": the author name(s)
- "genre": the genre or category (e.g. "Fiction", "Science Fiction", "Children's Fiction", "Biography", "Cookbook", "Thriller", "Romance", etc.)
- "publisher": the publisher / publishing house name (e.g. "Penguin", "Hachette", "Gallimard", "Flammarion", etc.)
- "isbn": any ISBN, EAN, or serial number visible (e.g. "978-2-07-036822-8")
- "volume": the volume or tome number if this is part of a series (e.g. "1", "3", "Tome 2")
- "section": either "Child" or "Adult" based on whether this is a children's book

Return ONLY a JSON object with these 7 fields. If you cannot determine a field, use an empty string "". Return only the raw JSON, no markdown fences.`,
            },
          ],
        },
      ],
      max_tokens: 500,
      temperature: 0.1,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API error (${res.status}): ${err}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("No response from Groq Vision");

  const cleaned = text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
  const parsed = JSON.parse(cleaned);
  return parseBookMetadata(parsed);
}

export async function analyzeShelf(
  base64Image: string,
  mimeType: string = "image/jpeg"
): Promise<BookMetadata[]> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: groqHeaders(),
    body: JSON.stringify({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${base64Image}` },
            },
            {
              type: "text",
              text: `You are a book identification expert. This image shows a bookshelf with multiple books visible by their spines (and possibly covers).

Your task: identify EVERY book visible in the image. For each book, extract:
- "title": the book title (read it from the spine or cover)
- "author": the author name(s)
- "genre": the genre or category
- "publisher": the publisher name if visible
- "isbn": any ISBN visible (usually not on spines, so leave empty if not visible)
- "volume": the volume or tome number if part of a series (e.g. "1", "Tome 2")
- "section": "Child" or "Adult"

Return ONLY a JSON array of objects, one per book. Even if you can only partially read a spine, include it with whatever fields you can determine. Use empty string "" for unknown fields. Return the raw JSON array, no markdown fences.

Example format: [{"title":"Le Petit Prince","author":"Antoine de Saint-Exupéry","genre":"Fiction","publisher":"Gallimard","isbn":"","volume":"","section":"Adult"}]`,
            },
          ],
        },
      ],
      max_tokens: 4000,
      temperature: 0.1,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API error (${res.status}): ${err}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("No response from Groq Vision");

  const cleaned = text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
  const parsed = JSON.parse(cleaned);

  if (!Array.isArray(parsed)) {
    throw new Error("Expected an array of books from shelf analysis");
  }

  return parsed.map(parseBookMetadata);
}
