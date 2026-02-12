
import React from "react";
import { Link } from "react-router-dom";
import "./ErrorPage.css";

const ErrorPage = () => {
  return (
    <div className="error-page">
      <div className="error-card">
        <h2 className="error-title">Oops! Something Went Wrong</h2>
        <p className="error-subtitle">Please try again later.</p>

        {/* Image served from /public/alert.png */}
        <img
          src="/alert.png"
          alt="Error"
          className="error-image"
        />

        {/* Optional: a safe way back */}
        <div className="error-actions">
          <Link to="/" className="error-btn">Go to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
