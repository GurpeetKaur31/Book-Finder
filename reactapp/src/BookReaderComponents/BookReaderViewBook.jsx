import React, { useEffect, useMemo, useState, useRef } from "react";
import api from "../axiosInstance";
import BookReaderNavbar from "./BookReaderNavbar";
import "./BookReaderViewBook.css"; // external styles for this view (theme-aware)

export default function BookReaderViewBook() {
  const [books, setBooks] = useState([]);
  const [rawSearch, setRawSearch] = useState("");     // immediate input
  const [search, setSearch] = useState("");           // debounced input
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const debounceRef = useRef(null);

  // Debounce search input (keeps typing snappy on large lists)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearch(rawSearch), 250);
    return () => clearTimeout(debounceRef.current);
  }, [rawSearch]);

  // Fetch books once on mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/books");

        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.items)
          ? res.data.items
          : [];

        setBooks(list);
        setError("");
      } catch (err) {
        setError("Failed to load books. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Normalize incoming shapes
  const cleanBooks = useMemo(() => {
    const normalize = (b) => ({
      id:
        b.BookId ??
        b.bookId ??
        b.id ??
        `${b.Title ?? b.title ?? "book"}-${b.Author ?? b.author ?? "unknown"}`,
      title: b.Title ?? b.title ?? "",
      author: b.Author ?? b.author ?? "",
      genre: b.Genre ?? b.genre ?? "",
      cover: b.CoverImage ?? b.coverImage ?? "",
    });
    return books.map(normalize);
  }, [books]);

  // Filter by search query (title/author/genre)
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return cleanBooks;
    return cleanBooks.filter((b) => {
      const t = (b.title || "").toLowerCase();
      const a = (b.author || "").toLowerCase();
      const g = (b.genre || "").toLowerCase();
      return t.includes(q) || a.includes(q) || g.includes(q);
    });
  }, [search, cleanBooks]);

  // Accessible retry handler for errors
  const handleRetry = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/books");
      const list = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.items)
        ? res.data.items
        : [];
      setBooks(list);
    } catch (e) {
      setError("Still couldn’t load books. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BookReaderNavbar />

      {/* ---- HERO ---- */}
      <section className="br-hero-banner">
        <div className="container text-center py-5">
          <h1 className="br-hero-title">
            Your <span className="brand-gradient">Personalized Reading </span> Universe
          </h1>
          <p className="text-muted mb-0">Find bestsellers, classics and the books you'll love.</p>

          {/* Search bar */}
          <div className="d-flex justify-content-center mt-4">
            <form
              className="input-group br-searchbar"
              role="search"
              onSubmit={(e) => e.preventDefault()}
              aria-label="Search books by title, author, or genre"
            >
              <span className="input-group-text bg-transparent border-end-0" aria-hidden="true">
                <i className="bi bi-search" />
              </span>
              <label htmlFor="br-search-input" className="visually-hidden">
                Search books by title, author, or genre
              </label>
              <input
                id="br-search-input"
                type="search"
                className="form-control border-start-0"
                placeholder="Search by title, author, or genre"
                value={rawSearch}
                onChange={(e) => setRawSearch(e.target.value)}
                inputMode="search"
                autoComplete="off"
              />
              <button className="btn btn-warning px-4" type="submit">
                Search
              </button>
            </form>
          </div>

{/* Features row */}
<div className="row text-center g-3 mt-5">
  {[
    { icon: "bi-stars", title: "Smart Suggestions", sub: "Personalized picks for you" },
    { icon: "bi-fire", title: "Trending Reads", sub: "Hot books right now" },
    { icon: "bi-journal-bookmark", title: "Free Library Picks", sub: "Read without limits" },
    { icon: "bi-shield-check", title: "Verified & Safe", sub: "Trusted content & secure" },
  ].map((f) => (
    <div className="col-6 col-md-3" key={f.title}>
      <div className="br-feature glass p-3 h-100" role="note" aria-label={f.title}>
        <i className={`bi ${f.icon} fs-4 mb-2`} aria-hidden="true" />
        <div className="fw-semibold">{f.title}</div>
        <div className="text-muted small mt-1">{f.sub}</div>
      </div>
    </div>
  ))}
</div>
        </div>
      </section>

      {/* ---- BOOK LIST ---- */}
      <div className="container py-5">
        <h3 className="text-center fw-bold mb-4">Bestselling Books</h3>

        {loading ? (
          // Skeleton grid while loading
          <div className="br-grid" aria-live="polite" aria-busy="true">
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="br-card skeleton" key={`sk-${i}`} aria-hidden="true">
                <div className="br-cover-wrap skeleton-block" />
                <div className="br-body p-3">
                  <div className="skeleton-line w-75 mb-2" />
                  <div className="skeleton-line w-50" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-danger mb-3" role="alert">{error}</p>
            <button className="btn btn-outline-primary" onClick={handleRetry}>
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-muted text-center">No books found</p>
        ) : (
          <div className="br-grid" role="list">
            {filtered.map((b) => (
              <article className="br-card" key={b.id} role="listitem">
                <div className="br-cover-wrap" aria-hidden={!b.cover}>
                  {b.cover ? (
                    <img
                      src={b.cover}
                      alt={b.title ? `${b.title} cover` : "Book cover"}
                      className="br-cover"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        // Hide broken image
                        e.currentTarget.style.display = "none";
                        // Turn wrapper into a monogram fallback
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.classList.add("br-cover-fallback");
                          const firstChar = (b.title?.trim()?.[0] || "B").toUpperCase();
                          parent.setAttribute("data-fallback", firstChar);
                        }
                      }}
                    />
                  ) : (
                    <div className="br-cover br-placeholder" aria-label="No image available">
                      No Image
                    </div>
                  )}
                </div>

                <div className="br-body p-3">
                  <div className="br-title" title={b.title || "Untitled"}>
                    {b.title || "Untitled"}
                  </div>
                  <div className="br-author text-muted small">
                    {b.author || "Unknown"}
                  </div>
                  <span className="badge br-genre-pill mt-2" title={b.genre || "General"}>
                    {b.genre || "General"}
                  </span>
                </div>
              </article>
            ))}
          </div>
          
        )}
        <br></br>
        
      </div>
      <div>
      <footer className="footer">
  <div className="container py-3">
    <div className="d-flex justify-content-center align-items-center gap-4 flex-wrap">
      <span className="fw-semibold">Contact Us</span>
      <span className="text-muted">
        Email: <a href="mailto:BookFinder@2026.com" className="text-muted">BookFinder@2026.com</a>
      </span>
      <span className="text-muted">Phone: +1 (123) 456‑7890</span>
    </div>

    <div className="text-center mt-2 text-muted small">
    © 2026 BookFinder. All rights reserved. Developed and maintained by Team Diamond.
    </div>
  </div>
</footer>
        </div>
    </>
  );
}
