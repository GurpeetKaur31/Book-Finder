import React from "react";
import BookRecommenderNavbar from "../BookRecommenderComponents/BookRecommenderNavbar";
import BookReaderNavbar from "../BookReaderComponents/BookReaderNavbar";
import { trendingBooks } from "../Data/trendingBooks";


const HomePage = () => {
  const role = localStorage.getItem("role");
  

  return (
    <div>
      {role === "BookRecommender" ? (
        <BookRecommenderNavbar />
      ) : role === "BookReader" ? (
        <BookReaderNavbar />
      ) : null}

      <section className="hero position-relative overflow-hidden">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>

        <div className="container">
          <div className="row align-items-center gy-5">
            <div className="col-lg-6">
              <h1 className="hero-title">
                What <span className="brand-gradient">Book</span> Are You Looking For?
              </h1>
              <p className="hero-sub mt-3">
                Discover, explore, and recommend books tailored to your reading preferences. 
                Dive into curated collections and trending titles handpicked for you.
              </p>

              <div className="d-flex gap-3 mt-4">
                <a href={role === "BookRecommender" ? "/books" : "/reader/books"} className="btn btn-glow">
                  Explore Now
                </a>
                <a href="/home#trending" className="btn btn-outline-glass">
                  Top Trending
                </a>
              </div>

              <div className="d-flex align-items-center gap-3 mt-4">
                <div className="badge-pulse"></div>
                <span className="text-muted">Fast, secure &amp; delightful reading experience</span>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="position-relative">
                <img
                  className="floating shadow-soft round-20 w-100"
                  alt="Floating E-book"
                  src="https://themewagon.github.io/kindle/assets/images/ebook.png"
                  style={{ maxWidth: 460 }}
                />
                <img
                  className="floating-slow position-absolute end-0 bottom-0 shadow-soft round-20"
                  alt="Book header"
                  src="https://themewagon.github.io/book/img/header-img.png"
                  style={{ width: 220, transform: "translate(16%, 16%)" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending section (anchor target) */}
      <section id="trending" className="py-5">
        <div className="container">
          <h2 className="text-center mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
            Top Trending <span className="brand-gradient">Books</span>
          </h2>

          <div className="row g-4">
          {trendingBooks.map((b) => (
  <div className="col-sm-6 col-lg-4" key={b.id}>
    <div className="book-card h-100">
      <img className="book-cover" alt={`${b.title} cover`} src={b.cover} />

      <div className="p-3">
        <div className="book-title">{b.title}</div>
        <div className="book-meta mt-1">By {b.author}</div>

        <p className="book-meta mt-2 mb-3" style={{ minHeight: 46 }}>
          {b.desc}
        </p>

        <div className="d-flex justify-content-between align-items-center mt-2">
          <span className="badge bf-pill">{b.tag}</span>

          {/* <a
            href={role === "BookRecommender" ? "/books" : "/reader/books"}
            className="btn btn-sm btn-outline-glass"
          >
            View
          </a> */}
        </div>
      </div>
    </div>
  </div>
))}

          </div>

        </div>
      </section>

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
  );
};

export default HomePage;
