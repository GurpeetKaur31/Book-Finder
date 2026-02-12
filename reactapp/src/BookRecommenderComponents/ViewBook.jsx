import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosInstance";
import BookRecommenderNavbar from "./BookRecommenderNavbar";
import ConfirmDeleteModal from "../Components/ConfirmDeleteModal";

const ViewBook = () => {
  const [books, setBooks] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const toDataUrl = (raw, mime = "image/png") =>
    raw && !String(raw).startsWith("data:")
      ? `data:${mime};base64,${raw}`
      : raw || "";

  const normalize = (raw) =>
    (raw || []).map((b) => ({
      id: b.bookId ?? b.BookId ?? b.id ?? b._id,
      title: b.title ?? b.Title ?? "",
      author: b.author ?? b.Author ?? "",
      genre: b.genre ?? b.Genre ?? "",
      coverImageBase64:
        b.coverImageBase64 ?? b.CoverImageBase64 ?? b.imageBase64 ?? b.ImageBase64 ?? "",
      coverImage: b.coverImage ?? b.CoverImage ?? b.imageUrl ?? b.ImageUrl ?? "",
    }));

  const loadBooks = async () => {
    const res = await api.get("/api/books");
    const list = Array.isArray(res.data)
      ? res.data
      : Array.isArray(res.data?.items)
        ? res.data.items
        : [];
    setBooks(normalize(list));
  };

  useEffect(() => { loadBooks(); }, []);

  const onAskDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const onConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await api.delete(`/api/books/${deleteId}`);
      setShowDeleteModal(false);
      setDeleteId(null);
      await loadBooks();
    } catch (err) {
      console.error("Delete failed", err?.response || err);
      alert("Delete failed. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const onCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const filtered = books.filter((b) => {
    const s = q.trim().toLowerCase();
    if (!s) return true;
    return (
      b.title.toLowerCase().includes(s) ||
      b.author.toLowerCase().includes(s) ||
      b.genre.toLowerCase().includes(s)
    );
  });

  return (
    <>
      <BookRecommenderNavbar />

      <div className="container py-4">
        <div className="glass-lg p-3 p-md-4">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
            <h3 className="mb-0" style={{ fontFamily: "Playfair Display, serif" }}>
              All <span className="brand-gradient">Books</span>
            </h3>
            <div className="input-group" style={{ maxWidth: 320 }}>
              <span className="input-group-text bg-transparent text-white-50 border-end-0">
                <i className="bi bi-search"></i>
              </span>
              <input
                className="form-control border-start-0"
                placeholder="Search..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>

          <hr className="border-secondary-subtle" />



          {books.length === 0 ? (
            <div className="d-flex justify-content-center py-5">
              <div className="book-loader"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center text-muted py-4">No books found</div>
          ) : (


            <div className="row g-4">
              {filtered.map((b) => {
                const src = b.coverImageBase64 ? toDataUrl(b.coverImageBase64) : b.coverImage || "";
                return (
                  <div className="col-sm-6 col-lg-4" key={b.id}>
                    <div className="book-card h-100">
                      {src ? (
                        <img src={src} alt="cover" className="book-cover" />
                      ) : (
                        <div className="book-cover d-flex align-items-center justify-content-center text-muted">No image</div>
                      )}

                      <div className="p-3">
                        <div className="book-title">{b.title}</div>
                        <div className="book-meta">{b.author}</div>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <span className="badge rounded-pill" style={{ background: "linear-gradient(90deg, #6dd3ff, #a179ff)", color: "#111" }}>
                            {b.genre || "General"}
                          </span>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-outline-glass"
                              onClick={() => navigate(`/edit/${b.id}`)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-glass"
                              onClick={() => onAskDelete(b.id)}
                              disabled={deleting && b.id === deleteId}
                            >
                              {deleting && b.id === deleteId ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ConfirmDeleteModal
        open={showDeleteModal}
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
        title="Are you sure you want to delete this book?"
      />
    </>
  );
};

export default ViewBook;
