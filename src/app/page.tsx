"use client";

import { useRouter } from "next/navigation";
import AddBookModal from "@/components/AddBookModal";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-warm-800">Bookshelf</h1>
          <p className="text-warm-500">Your personal book collection.</p>
        </div>
        <AddBookModal onBookAdded={() => router.refresh()} />
      </div>
    </main>
  );
}
