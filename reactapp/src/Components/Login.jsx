
import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../apiConfig";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // show/hide password
  const [showPwd, setShowPwd] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // prevent page reload
    try {
      // call login API
      const res = await axios.post(`${API_BASE_URL}/api/Authentication/login`, { email, password });
      const token = res.data.token;

      // persist auth
      localStorage.setItem("token", token);

      // decode JWT payload (base64)
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const username = payload["username"];

      // persist role/username
      localStorage.setItem("role", role);
      if (username) localStorage.setItem("username", username);

      // route by role
      if (role === "BookRecommender") navigate("/home");
      else navigate("/reader/books");
    } catch (err) {
      alert("Invalid email or password");
    }
  };

  // initialize theme on first render
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", saved);

    const icon = document.getElementById("themeIcon");
    if (icon) icon.className = saved === "dark" ? "bi bi-sun" : "bi bi-moon-stars";
  }, []);

  // toggle theme + icon
  const toggleTheme = () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);

    const icon = document.getElementById("themeIcon");
    if (icon) icon.className = next === "dark" ? "bi bi-sun" : "bi bi-moon-stars";
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="glass-lg p-4 p-md-5">
            {/* theme button */}
            <div>
              <button
                className="btn btn-outline-glass d-flex align-items-center gap-2"
                onClick={() => toggleTheme()}
              >
                <i className="bi bi-moon-stars" id="themeIcon"></i>
                <span className="d-none d-lg-inline">Theme</span>
              </button>
              <br></br>
            </div>

            <h2 className="mb-1" style={{ fontFamily: "Playfair Display, serif" }}>
              Welcome back to <span className="brand-gradient">BookFinder</span>
            </h2>
            <p className="text-muted mb-4">Sign in to continue</p>

            {/* login form */}
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Password</label>

                {/* password field + eye toggle */}
                <div className="position-relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    className="form-control"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="btn btn-outline-glass position-absolute top-50 end-0 translate-middle-y me-2 py-1 px-2"
                    onClick={() => setShowPwd((v) => !v)}
                    aria-label={showPwd ? "Hide password" : "Show password"}
                  >
                    <i className={`bi ${showPwd ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-glow w-100">Login</button>
            </form>

            <p className="text-center mt-3 text-muted">
              Don’t have an account? <Link to="/signup">Signup</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
