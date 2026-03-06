export interface BookMetadata {
  title: string;
  author: string;
  genre: string;
  publisher: string;
  isbn: string;
  section: "Child" | "Adult";
}

export async function analyzeBookCover(
  base64Image: string,
  mimeType: string = "image/jpeg"
): Promise<BookMetadata> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY not configured");

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
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
- "section": either "Child" or "Adult" based on whether this is a children's book

Return ONLY a JSON object with these 6 fields. If you cannot determine a field, use an empty string "". Return only the raw JSON, no markdown fences.`,
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

  try {
    const cleaned = text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return {
      title: parsed.title || "",
      author: parsed.author || "",
      genre: parsed.genre || "",
      publisher: parsed.publisher || "",
      isbn: parsed.isbn || "",
      section: parsed.section === "Child" ? "Child" : "Adult",
    };
  } catch {
    throw new Error(`Failed to parse AI response: ${text}`);
  }
}
