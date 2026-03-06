export interface IsbnResult {
  title?: string;
  author?: string;
  publisher?: string;
  genre?: string;
  isbn?: string;
  coverUrl?: string;
}

async function lookupOpenLibrary(isbn: string): Promise<IsbnResult | null> {
  try {
    const res = await fetch(
      `https://openlibrary.org/isbn/${isbn}.json`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return null;

    const data = await res.json();

    let author = "";
    if (data.authors?.length) {
      const authorKey = data.authors[0].key;
      const authorRes = await fetch(
        `https://openlibrary.org${authorKey}.json`,
        { signal: AbortSignal.timeout(3000) }
      );
      if (authorRes.ok) {
        const authorData = await authorRes.json();
        author = authorData.name || "";
      }
    }

    let publisher = "";
    if (data.publishers?.length) {
      publisher = data.publishers[0];
    }

    const coverId = data.covers?.[0];

    return {
      title: data.title || undefined,
      author: author || undefined,
      publisher: publisher || undefined,
      isbn,
      coverUrl: coverId
        ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
        : undefined,
    };
  } catch {
    return null;
  }
}

async function lookupGoogleBooks(isbn: string): Promise<IsbnResult | null> {
  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&maxResults=1`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return null;

    const data = await res.json();
    const item = data.items?.[0]?.volumeInfo;
    if (!item) return null;

    return {
      title: item.title || undefined,
      author: item.authors?.join(", ") || undefined,
      publisher: item.publisher || undefined,
      genre: item.categories?.join(", ") || undefined,
      isbn,
    };
  } catch {
    return null;
  }
}

export async function lookupIsbn(rawIsbn: string): Promise<IsbnResult | null> {
  const isbn = rawIsbn.replace(/[^0-9Xx]/g, "");
  if (isbn.length !== 10 && isbn.length !== 13) return null;

  const [openLib, google] = await Promise.all([
    lookupOpenLibrary(isbn),
    lookupGoogleBooks(isbn),
  ]);

  if (!openLib && !google) return null;

  return {
    title: openLib?.title || google?.title,
    author: openLib?.author || google?.author,
    publisher: openLib?.publisher || google?.publisher,
    genre: google?.genre || openLib?.genre,
    isbn,
    coverUrl: openLib?.coverUrl,
  };
}
