## Relevant Files

- `package.json` - Project dependencies and scripts.
- `next.config.js` - Next.js configuration.
- `.env.local` - Environment variables (OpenAI API key). **Do not commit.**
- `tailwind.config.ts` - Tailwind CSS theme configuration (warm, library-inspired tones).
- `prisma/schema.prisma` - Database schema for the Book model.
- `src/app/layout.tsx` - Root layout with global styles and fonts.
- `src/app/page.tsx` - Main dashboard page.
- `src/app/api/books/route.ts` - API route for listing and creating books.
- `src/app/api/books/[id]/route.ts` - API route for updating and deleting a single book.
- `src/app/api/upload/route.ts` - API route for image upload and thumbnail generation.
- `src/app/api/analyze/route.ts` - API route for OpenAI Vision analysis.
- `src/lib/db.ts` - Prisma client instance.
- `src/lib/openai.ts` - OpenAI client and vision extraction helper.
- `src/lib/thumbnails.ts` - Thumbnail generation utility using sharp.
- `src/components/BookCard.tsx` - Individual book card for the grid.
- `src/components/BookGrid.tsx` - Responsive grid layout for book cards.
- `src/components/AddBookModal.tsx` - Modal with upload, AI review form, and save flow.
- `src/components/BookDetail.tsx` - Book detail/edit view with delete option.
- `src/components/SearchBar.tsx` - Search input component.
- `src/components/SectionTabs.tsx` - All / Child / Adult tab navigation.

### Notes

- This project uses **Next.js (App Router)** with **TypeScript**, **Tailwind CSS**, **Prisma + SQLite**, **sharp** for thumbnails, and the **OpenAI SDK** for vision.
- For deployment on Vercel, SQLite will need to be swapped for a hosted solution (e.g., Vercel Postgres or Turso) and image storage will use Vercel Blob. This is handled in task 9.0.
- Use `npx prisma studio` to inspect the database during development.
- Use `npm run dev` to start the development server.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [x] 1.0 Project setup and configuration
  - [x] 1.1 Initialize a new Next.js project (App Router, TypeScript) inside the `Bookshelf` directory
  - [x] 1.2 Install dependencies: `prisma`, `@prisma/client`, `sharp`, `openai`, and any other needed packages
  - [x] 1.3 Set up Tailwind CSS with a warm, library-inspired color palette in `tailwind.config.ts`
  - [x] 1.4 Create `.env.local` with a placeholder for `OPENAI_API_KEY`
  - [x] 1.5 Set up the project folder structure (`src/app`, `src/components`, `src/lib`, `public/uploads`)
  - [x] 1.6 Create the root layout (`src/app/layout.tsx`) with global styles and a clean font

- [ ] 2.0 Database schema and data model
  - [ ] 2.1 Initialize Prisma with SQLite (`npx prisma init --datasource-provider sqlite`)
  - [ ] 2.2 Define the `Book` model in `prisma/schema.prisma` with fields: `id`, `title`, `author`, `genre`, `section` (Child/Adult), `imagePath`, `thumbnailPath`, `createdAt`, `updatedAt`
  - [ ] 2.3 Run the initial migration (`npx prisma migrate dev --name init`)
  - [ ] 2.4 Create the Prisma client singleton in `src/lib/db.ts`

- [ ] 3.0 Image upload and thumbnail generation
  - [ ] 3.1 Create `src/lib/thumbnails.ts` — a utility function that takes an image buffer and returns a resized thumbnail buffer using sharp
  - [ ] 3.2 Create `src/app/api/upload/route.ts` — accepts a multipart image upload, saves the original to `public/uploads/`, generates a thumbnail, saves it to `public/uploads/thumbs/`, and returns both file paths
  - [ ] 3.3 Ensure the upload directory and thumbs subdirectory are created automatically if they don't exist

- [ ] 4.0 OpenAI Vision integration
  - [ ] 4.1 Create `src/lib/openai.ts` — initialize the OpenAI client using the API key from environment variables
  - [ ] 4.2 Add an `analyzeBookCover` function that sends an image (as base64 or URL) to GPT-4 Vision and returns structured data: `{ title, author, genre, section }` where section is "Child" or "Adult"
  - [ ] 4.3 Create `src/app/api/analyze/route.ts` — accepts an image path, calls `analyzeBookCover`, and returns the extracted metadata as JSON
  - [ ] 4.4 Handle API errors gracefully (rate limits, invalid images) and return meaningful error messages

- [ ] 5.0 Book creation flow
  - [ ] 5.1 Create `src/components/AddBookModal.tsx` — a modal triggered by an "Add Book" button with a file input (camera capture + file picker)
  - [ ] 5.2 On photo selection, upload the image via the `/api/upload` endpoint and display a loading state
  - [ ] 5.3 After upload, call `/api/analyze` with the image to get AI-extracted metadata
  - [ ] 5.4 Display the extracted fields (title, author, genre) in an editable form, with a Child/Adult toggle pre-filled by the AI suggestion
  - [ ] 5.5 On form submission, POST to `/api/books` to save the book record to the database
  - [ ] 5.6 Close the modal and refresh the dashboard to show the new book

- [ ] 6.0 Dashboard UI
  - [ ] 6.1 Create `src/components/SectionTabs.tsx` — tab navigation for All / Child / Adult
  - [ ] 6.2 Create `src/components/SearchBar.tsx` — a sticky search input that filters books in real time by title, author, or genre
  - [ ] 6.3 Create `src/components/BookCard.tsx` — a card displaying the thumbnail, title, and author
  - [ ] 6.4 Create `src/components/BookGrid.tsx` — a responsive grid layout that renders BookCard components
  - [ ] 6.5 Build the main dashboard page (`src/app/page.tsx`) — fetch all books, wire up SectionTabs, SearchBar, and BookGrid together
  - [ ] 6.6 Implement client-side filtering: search text filters across title/author/genre; section tabs filter by Child/Adult

- [ ] 7.0 Book detail, edit, and delete functionality
  - [ ] 7.1 Create `src/components/BookDetail.tsx` — a detail/edit view (modal or slide-over) showing the full-size image and all editable fields including a Child/Adult override toggle
  - [ ] 7.2 Create `src/app/api/books/[id]/route.ts` — PUT handler to update a book's fields, DELETE handler to remove a book and its images
  - [ ] 7.3 Wire the edit form to call PUT `/api/books/[id]` on save
  - [ ] 7.4 Add a delete button with a confirmation prompt; on confirm, call DELETE `/api/books/[id]` and refresh the dashboard
  - [ ] 7.5 Open the detail view when a BookCard is clicked on the dashboard

- [ ] 8.0 Responsive design and final polish
  - [ ] 8.1 Test and adjust the card grid for mobile (1 column), tablet (2-3 columns), and desktop (4+ columns)
  - [ ] 8.2 Ensure the Add Book modal and upload flow work well on mobile (camera capture via `accept="image/*" capture="environment"`)
  - [ ] 8.3 Add loading spinners/skeletons during image upload and AI analysis
  - [ ] 8.4 Add toast notifications or inline feedback for success/error states (book saved, upload failed, etc.)
  - [ ] 8.5 Polish typography, spacing, and colors to match the warm library-inspired theme

- [ ] 9.0 Deployment (public hosting, shareable URL)
  - [ ] 9.1 Swap SQLite for a hosted database compatible with Vercel (e.g., Vercel Postgres or Turso) and update Prisma config
  - [ ] 9.2 Set up Vercel Blob (or similar) for image/thumbnail storage and update upload logic to use it instead of local disk
  - [ ] 9.3 Configure environment variables (`OPENAI_API_KEY`, database URL, blob store token) in the Vercel project settings
  - [ ] 9.4 Deploy to Vercel and verify the public URL works end-to-end (upload, AI extraction, dashboard, search, edit, delete)
  - [ ] 9.5 Share the public dashboard URL
