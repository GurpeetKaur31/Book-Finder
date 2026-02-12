
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../axiosInstance";
import BookRecommenderNavbar from "./BookRecommenderNavbar";
import ResultModal from "../Components/ResultModal";

const BookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState({
    title: "",
    author: "",
    genre: "",
    publishedDate: "",
    coverImage: "",
  });

  const [imageBase64, setImageBase64] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(!!id);

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await api.get(`/api/books/${id}`);
        const b = res.data || {};
        const cover = b.coverImage ?? b.CoverImage ?? "";
        setBook({
          title: b.title ?? b.Title ?? "",
          author: b.author ?? b.Author ?? "",
          genre: b.genre ?? b.Genre ?? "",
          publishedDate: b.publishedDate
            ? new Date(b.publishedDate).toISOString().slice(0, 10)
            : "",
          coverImage: cover,
        });
        setPreview(cover);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({ ...prev, [name]: value }));
  };

  // Drag & Drop
  const onFileSelected = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      setImageBase64(dataUrl);
      setPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };  

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    onFileSelected(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    onFileSelected(file);
    e.currentTarget.classList.remove("highlight");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add("highlight");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("highlight");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const finalCover = imageBase64 || book.coverImage || "";
      const payload = {
        title: book.title,
        author: book.author,
        genre: book.genre,
        publishedDate: book.publishedDate,
        coverImage: finalCover,
      };

      if (id) {
        await api.put(`/api/books/${id}`, payload);
        setSuccessMessage("Book updated successfully!");
        setShowSuccess(true);
      } else {
        await api.post("/api/books", payload);
        setSuccessMessage("Book added successfully!");
        setShowSuccess(true);
      }
    } catch (err) {
      console.error("Save failed", err?.response || err);
      alert("Save failed. Please try again.");
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate("/books");
  };

  if (loading) {
    return (
      <>
        <BookRecommenderNavbar />
        <div className="container mt-4">Loading…</div>
      </>
    );
  }

  return (
    <>
      <BookRecommenderNavbar />
      <div className="container py-4" style={{ maxWidth: 920 }}>
        <div className="glass-lg p-3 p-md-4">
          <h3 className="mb-3" style={{ fontFamily: "Playfair Display, serif" }}>
            {id ? "Edit Book" : "Create New Book"}
          </h3>

          <div className="row g-4">
            <div className="col-lg-7">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    className="form-control"
                    name="title"
                    placeholder="Title *"
                    value={book.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Author</label>
                  <input
                    className="form-control"
                    name="author"
                    placeholder="Author *"
                    value={book.author}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Genre</label>
                  <input
                    className="form-control"
                    name="genre"
                    placeholder="Genre *"
                    value={book.genre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Published Date</label>
                  <input
                    className="form-control"
                    type="date"
                    name="publishedDate"
                    value={book.publishedDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div
                  className="dropzone mb-3"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <div className="d-flex flex-column align-items-center gap-2">
                    <i className="bi bi-cloud-arrow-up fs-4"></i>
                    <div>Drag &amp; drop cover image here, or click to select</div>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={handleFileInput}
                      required={!id && !book.coverImage}
                      style={{ maxWidth: 360 }}
                    />
                  </div>
                </div>

                <button className="btn btn-glow w-100">
                  {id ? "Update Book" : "Add Book"}
                </button>
              </form>
            </div>

            <div className="col-lg-5">
              <div className="book-card">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="book-cover"
                    style={{ height: 320, objectFit: "contain" }}
                  />
                ) : (
                  <div className="book-cover d-flex align-items-center justify-content-center text-muted" style={{ height: 320 }}>
                    Preview
                  </div>
                )}
                <div className="p-3">
                  <div className="book-title">{book.title || "Book title"}</div>
                  <div className="book-meta">{book.author || "Author"}</div>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <small className="text-muted">{book.publishedDate || "YYYY-MM-DD"}</small>
                    <span className="badge rounded-pill" style={{ background: "linear-gradient(90deg, #6dd3ff, #a179ff)", color: "#111" }}>
                      {book.genre || "Genre"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-muted small mt-2">
                Tip: Use a square or portrait image for best results.
              </div>
            </div>
          </div>
        </div>
      </div>

      <ResultModal
        open={showSuccess}
        message={successMessage}
        okText="Close"
        onClose={handleSuccessClose}
      />
    </>
  );
};

export default BookForm;
