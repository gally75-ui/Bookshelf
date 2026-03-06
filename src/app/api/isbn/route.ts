import { NextRequest, NextResponse } from "next/server";
import { lookupIsbn } from "@/lib/isbn-lookup";

export async function GET(request: NextRequest) {
  const isbn = request.nextUrl.searchParams.get("isbn");

  if (!isbn) {
    return NextResponse.json({ error: "Missing isbn param" }, { status: 400 });
  }

  const result = await lookupIsbn(isbn);

  if (!result) {
    return NextResponse.json(
      { error: "Book not found in public databases" },
      { status: 404 }
    );
  }

  return NextResponse.json(result);
}
