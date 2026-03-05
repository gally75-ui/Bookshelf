import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${base64Image}`,
            },
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
  });

  const text = response.choices[0]?.message?.content?.trim();
  if (!text) {
    throw new Error("No response from OpenAI Vision");
  }

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
