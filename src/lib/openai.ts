import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface BookMetadata {
  title: string;
  author: string;
  genre: string;
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
            text: `Analyze this book cover or title page. Return ONLY a JSON object with these fields:
- "title": the book title
- "author": the author name
- "genre": the genre/category (e.g. "Fiction", "Science Fiction", "Children's Fiction", "Biography", "Cookbook", etc.)
- "section": either "Child" or "Adult" based on whether this is a children's book

If you cannot determine a field, use "Unknown" as the value. Return only the raw JSON, no markdown fences.`,
          },
        ],
      },
    ],
    max_tokens: 300,
  });

  const text = response.choices[0]?.message?.content?.trim();
  if (!text) {
    throw new Error("No response from OpenAI Vision");
  }

  try {
    const cleaned = text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return {
      title: parsed.title || "Unknown",
      author: parsed.author || "Unknown",
      genre: parsed.genre || "Unknown",
      section: parsed.section === "Child" ? "Child" : "Adult",
    };
  } catch {
    throw new Error(`Failed to parse AI response: ${text}`);
  }
}
