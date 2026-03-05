# PRD: Personal Bookshelf

## 1. Introduction/Overview

Bookshelf is a personal, responsive web application that serves as a searchable directory of your physical book collection. You add books by uploading a photo of the book's title/cover — the app uses AI to extract the title, author, and genre, then organizes books into **Child** and **Adult** sections automatically. Everything lives in a single, clean dashboard that is **publicly hosted and shareable** via a link.

## 2. Goals

- Provide a fast, simple way to catalog personal books by snapping a photo.
- Automatically extract book metadata (title, author, genre) from uploaded images using AI/OCR.
- Automatically categorize books into Child or Adult sections based on detected genre/content.
- Offer a searchable, filterable dashboard that works well on both desktop and mobile browsers.
- Host the dashboard publicly so it can be shared with others via a simple link.
- Require no login — the app is a single-user personal tool (owner manages books; visitors can browse).

## 3. User Stories

- **As a user**, I want to upload a photo of a book's title/cover so I can quickly add it to my collection without typing everything manually.
- **As a user**, I want the app to auto-detect the title, author, and genre from my photo so cataloging is effortless.
- **As a user**, I want to correct or edit any auto-extracted information in case the AI gets something wrong.
- **As a user**, I want my books automatically sorted into Child and Adult sections so I can browse each collection separately.
- **As a user**, I want to manually override the Child/Adult categorization if the AI gets it wrong.
- **As a user**, I want to search across all my books by title, author, or genre so I can quickly find a specific book.
- **As a user**, I want to see a visual dashboard of my books (with cover photos) so browsing feels natural and familiar.
- **As a user**, I want the app to work on my phone and my laptop so I can add books from anywhere.
- **As a user**, I want to share my bookshelf with friends or family via a public link so they can browse my collection.

## 4. Functional Requirements

1. **Photo Upload:** The system must allow users to upload a photo (camera capture or file picker) of a book's title or cover.
2. **AI Extraction:** Upon upload, the system must use AI/OCR to extract the book's title, author, and genre/category from the image.
3. **Manual Correction:** After extraction, the system must present the detected fields (title, author, genre) in an editable form so the user can review and correct them before saving.
4. **Auto-Categorization:** The system must automatically assign each book to the **Child** or **Adult** section based on the AI-detected genre/content (e.g., "Children's Fiction" → Child, "Thriller" → Adult).
5. **Manual Section Override:** The system must allow users to manually change a book's Child/Adult categorization at any time (during initial review and later via edit).
6. **Book Record Storage:** Each book record must store: title, author, genre/category, section (Child/Adult), the uploaded photo, and a generated thumbnail.
6. **Dashboard View:** The system must display all books in a single dashboard with:
   - A grid/card layout showing the book photo, title, and author.
   - Section tabs or filters for **All**, **Child**, and **Adult**.
8. **Search:** The system must provide a search bar that filters books by title, author, or genre in real time.
9. **Edit/Delete:** The system must allow users to edit a book's details or remove a book from the collection.
10. **Responsive Design:** The UI must be fully responsive, working well on mobile phones, tablets, and desktops.
11. **Public & Shareable:** The dashboard must be publicly accessible via a URL so anyone with the link can browse the collection.
12. **No Authentication:** The app requires no login or account — the owner manages books directly, and visitors can view/search the collection.

## 5. Non-Goals (Out of Scope)

- Multi-user support or user accounts.
- Barcode/ISBN scanning (may be a future enhancement).
- Integration with external book databases (e.g., Google Books, Open Library).
- Reading progress tracking, reviews, or social features.
- E-book or audiobook management.
- Offline/PWA support (first version is online only).

## 6. Design Considerations

- **Dashboard layout:** Card-based grid with book cover photos as the primary visual. Each card shows the photo, title, and author. Clicking a card opens a detail/edit view.
- **Section navigation:** Tabs or toggle at the top of the dashboard for All / Child / Adult.
- **Upload flow:** A prominent "Add Book" button opens a modal or page where the user can take/upload a photo, review the AI-extracted fields, make corrections, and save.
- **Search bar:** Sticky at the top of the dashboard for quick access.
- **Color/style:** Clean, modern, minimal design. Use warm, library-inspired tones.

## 7. Technical Considerations

- **AI/OCR:** Use **OpenAI Vision (GPT-4 Vision)** to extract title, author, and genre from the uploaded photo. The same call determines if the book is for children or adults.
- **Image Handling:** Store the original uploaded photo and generate a **thumbnail** for faster dashboard loading. The dashboard grid uses thumbnails; the full image is shown in detail/edit views.
- **Storage:** A lightweight database (e.g., SQLite, or a simple JSON-based store) for book records. Uploaded images and thumbnails stored locally on disk or in a cloud bucket.
- **Framework:** A modern web framework with server-side and client-side rendering (e.g., Next.js, or a Python backend + React frontend) to keep things simple and responsive.
- **Deployment:** Deploy to a public hosting platform (e.g., Vercel) so the dashboard is accessible via a shareable URL.
- **No auth overhead:** Since there is no login, the app can serve a single data store directly. The owner manages books; anyone with the link can browse.

## 8. Success Metrics

- A user can go from photo upload to saved book entry in under 30 seconds.
- AI extraction correctly identifies title and author at least 80% of the time.
- Search returns relevant results instantly (< 500ms).
- The dashboard is fully usable on a mobile phone screen.

## 9. Open Questions

All resolved — no remaining open questions.
