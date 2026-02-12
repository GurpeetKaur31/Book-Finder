import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ConfirmLogoutModal from "../Components/ConfirmLogoutModal";

const BookRecommenderNavbar = () => {
  const [open, setOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const onLogoutClick = () => setShowConfirm(true);
  const onConfirmLogout = () => {
    localStorage.clear();
    setShowConfirm(false);
    navigate("/");
  };
  const onCancelLogout = () => setShowConfirm(false);

  const username = localStorage.getItem("username") || "Recommender";
  const role = localStorage.getItem("role");

  useEffect(() => {
    const onDocClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Theme Toggle
useEffect(() => {
  const saved = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", saved);

  const icon = document.getElementById("themeIcon");
  if (icon) icon.className = saved === "dark" ? "bi bi-sun" : "bi bi-moon-stars";
}, []);

const toggleTheme = () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);

  const icon = document.getElementById("themeIcon");
  if (icon) icon.className = next === "dark" ? "bi bi-sun" : "bi bi-moon-stars";
};


  return (
    <>
      <nav className="navbar navbar-expand-lg bf-navbar sticky-top">
        <div className="container">
          <Link to="/home" className="navbar-brand bf-brand">
            BookFinder <span className="dot"></span>
          </Link>

          <button
            className="navbar-toggler text-white"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#recNav"
          >
            <span className="bi bi-list"></span>
          </button>

          <div className="collapse navbar-collapse" id="recNav">
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-3">

              {/* ---- Username moved BEFORE Home button ---- */}
              <li className="nav-item d-flex align-items-center">
              <span className="bf-greet small me-2">Hi,</span>
                <span className="bf-user-badge me-3">{username}/BookRecommender</span>
              </li>

              <li className="nav-item">
                <Link to="/home" className="nav-link text-white-50">Home</Link>
              </li>

              {role === "BookRecommender" && (
                <li className="nav-item dropdown" ref={dropdownRef}>
                  <button
                    className="btn btn-outline-glass dropdown-toggle"
                    onClick={() => setOpen((v) => !v)}
                    aria-haspopup="menu"
                    aria-expanded={open}
                    id="bookMenuBtn"
                  >
                    Book
                  </button>

                  <ul
                    className={`dropdown-menu dropdown-menu-end ${open ? "show" : ""}`}
                    aria-labelledby="bookMenuBtn"
                    style={{
                      background: "rgba(15,16,38,.95)",
                      border: "1px solid rgba(255,255,255,.12)"
                    }}
                  >
                    <li><Link to="/add" className="dropdown-item text-white">Add Book</Link></li>
                    <li><Link to="/books" className="dropdown-item text-white">View Book</Link></li>
                  </ul>
                </li>
              )}

              <li className="nav-item d-flex align-items-center">
                <button className="btn btn-outline-glass" onClick={onLogoutClick}>Logout</button>
              </li>

              <li className="nav-item d-flex align-items-center">
  <button
    className="btn btn-outline-glass d-flex align-items-center gap-2"
    onClick={() => toggleTheme()}
  >
    <i className="bi bi-moon-stars" id="themeIcon"></i>
    <span className="d-none d-lg-inline">Theme</span>
  </button>
</li>



            </ul>
          </div>
        </div>
      </nav>

      <ConfirmLogoutModal
        open={showConfirm}
        onConfirm={onConfirmLogout}
        onCancel={onCancelLogout}
      />
    </>
  );
};

export default BookRecommenderNavbar;
