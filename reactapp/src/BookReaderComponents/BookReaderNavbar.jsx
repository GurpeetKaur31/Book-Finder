import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ConfirmLogoutModal from "../Components/ConfirmLogoutModal";

const BookReaderNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showConfirm, setShowConfirm] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  const onLogoutClick = () => setShowConfirm(true);
  const onConfirmLogout = () => {
    localStorage.clear();
    setShowConfirm(false);
    navigate("/");
  };
  const onCancelLogout = () => setShowConfirm(false);

  const username = localStorage.getItem("username") || "Reader";

  // initialize theme on mount
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path);

  return (
    <>
      <nav className="navbar navbar-expand-lg bf-navbar sticky-top">
        <div className="container">
          <Link to="/home" className="navbar-brand bf-brand">
            BookFinder <span className="dot"></span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#readerNav"
            aria-controls="readerNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="bi bi-list"></span>
          </button>

          <div className="collapse navbar-collapse" id="readerNav">
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-3">

              {/* Greeting + Username (theme-aware) */}
              <li className="nav-item d-flex align-items-center">
                <span className="bf-greet small me-2">Hi,</span>
                <span className="bf-user-badge me-3">{username}/BookReader</span>
              </li>

              
              <li className="nav-item">
                <Link
                  to="/reader/books"
                  className={`nav-link ${isActive("/home") ? "active" : ""}`}
                >
                  Home
                </Link>
              </li>

              {/* Books */}
              {/* <li className="nav-item">
                <Link
                  to="/reader/books"
                  className={`nav-link ${isActive("/reader/books") ? "active" : ""}`}
                >
                  Books
                </Link>
              </li> */}

              {/* Logout */}
              <li className="nav-item d-flex align-items-center">
                <button className="btn btn-outline-glass" onClick={onLogoutClick}>
                  Logout
                </button>
              </li>

              {/* Theme Toggle */}
              <li className="nav-item d-flex align-items-center">
                <button
                  type="button"
                  className="btn btn-outline-glass d-flex align-items-center gap-2"
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                >
                  <i className={`bi ${theme === "dark" ? "bi-sun" : "bi-moon-stars"}`} />
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

export default BookReaderNavbar;
