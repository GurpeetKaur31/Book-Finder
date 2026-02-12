import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../apiConfig";
import { useNavigate, Link } from "react-router-dom";
import ResultModal from "../Components/ResultModal";

const Signup = () => {
  const navigate = useNavigate();

  // form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
    userRole: "BookReader",
  });

  // UI toggles
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  // submit/success state
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("User Registration is Successful!");

  // touched flags (for inline errors)
  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
    mobileNumber: false,
  });

  // show password rules after first typing
  const [pwdTyped, setPwdTyped] = useState(false);

  // handle input updates
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "password" && value.length > 0 && !pwdTyped) setPwdTyped(true);
    setFormData((p) => ({ ...p, [name]: value }));
  };

  // trim on blur + set touched
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (["username", "email", "mobileNumber"].includes(name)) {
      setFormData((p) => ({ ...p, [name]: value.trim() }));
    }
  };

  // --- validation ---
  const emailValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email || ""),
    [formData.email]
  );

  const mobileDigits = useMemo(
    () => (formData.mobileNumber || "").replace(/\s+/g, ""),
    [formData.mobileNumber]
  );

  const mobileValid = useMemo(() => /^\d{10}$/.test(mobileDigits), [mobileDigits]);

  const rules = useMemo(() => {
    const p = formData.password || "";
    return {
      length: p.length >= 8,
      upper: /[A-Z]/.test(p),
      lower: /[a-z]/.test(p),
      number: /[0-9]/.test(p),
      special: /[^A-Za-z0-9]/.test(p),
    };
  }, [formData.password]);

  const allPwdRulesPass =
    rules.length && rules.upper && rules.lower && rules.number && rules.special;

  const passwordsMatch =
    formData.password.length > 0 &&
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  // error visibility
  const showUsernameError = touched.username && !formData.username?.trim();
  const showEmailError = touched.email && (!!formData.email ? !emailValid : true);
  const showPasswordRequired = touched.password && !formData.password;
  const showConfirmRequired = touched.confirmPassword && !formData.confirmPassword;
  const showConfirmError = touched.confirmPassword && !!formData.confirmPassword && !passwordsMatch;
  const showMobileError = touched.mobileNumber && (!!formData.mobileNumber ? !mobileValid : true);

  // visual enable only (button stays clickable)
  const canSubmitVisual =
    formData.username &&
    emailValid &&
    mobileValid &&
    allPwdRulesPass &&
    passwordsMatch &&
    !submitting;

  // final guard before API
  const hasAnyError = () => {
    if (!formData.username) return true;
    if (!formData.email || !emailValid) return true;
    if (!formData.password || !allPwdRulesPass) return true;
    if (!formData.confirmPassword || !passwordsMatch) return true;
    if (!mobileDigits || !mobileValid) return true;
    return false;
  };

  // submit
  const handleSignup = async (e) => {
    e.preventDefault();

    // surface errors
    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
      mobileNumber: true,
    });

    if (hasAnyError()) return;

    try {
      setSubmitting(true);
      const payload = {
        username: (formData.username || "").trim(),
        email: (formData.email || "").trim(),
        password: formData.password,
        mobileNumber: mobileDigits,
        userRole: formData.userRole,
      };

      await axios.post(`${API_BASE_URL}/api/Authentication/register`, payload);
      setSuccessMessage("User Registration is Successful!");
      setShowSuccess(true);
    } catch (err) {
      const msg =
        err?.response?.data?.Error ||
        err?.response?.data?.message ||
        "Registration failed";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // close success modal
  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate("/");
  };

  // inline style for rule items
  const ruleStyle = (ok) => ({
    color: ok ? "#9feaab" : "#c9d3ffb0",
    fontSize: "0.9rem",
    marginBottom: 6,
    listStyleType: "disc",
  });

  // theme init
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", saved);
    const icon = document.getElementById("themeIcon");
    if (icon) icon.className = saved === "dark" ? "bi bi-sun" : "bi bi-moon-stars";
  }, []);

  // theme toggle
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
        <div className="col-lg-7">
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
              <p></p>
            </div>

            <h2 className="mb-1" style={{ fontFamily: "Playfair Display, serif" }}>
              Create your <span className="brand-gradient">BookFinder</span> account
            </h2>
            <p className="text-muted mb-4">It only takes a minute.</p>

            {/* form */}
            <form onSubmit={handleSignup} noValidate>
              <div className="row g-3">
                {/* username */}
                <div className="col-md-6">
                  <label className="form-label" htmlFor="sf-username">Username</label>
                  <input
                    id="sf-username"
                    type="text"
                    name="username"
                    className="form-control"
                    placeholder="Your name"
                    value={formData.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="name"
                    maxLength={64}
                    required
                    disabled={submitting || showSuccess}
                    aria-required="true"
                    aria-invalid={showUsernameError ? "true" : "false"}
                    aria-describedby={showUsernameError ? "sf-username-err" : undefined}
                  />
                  {showUsernameError && (
                    <div id="sf-username-err" className="text-danger small mt-1">
                      Username is required.
                    </div>
                  )}
                </div>

                {/* email */}
                <div className="col-md-6">
                  <label className="form-label" htmlFor="sf-email">Email</label>
                  <input
                    id="sf-email"
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="email"
                    required
                    disabled={submitting || showSuccess}
                    aria-invalid={showEmailError ? "true" : "false"}
                    aria-describedby={showEmailError ? "sf-email-err" : undefined}
                  />
                  {showEmailError && (
                    <div id="sf-email-err" className="text-danger small mt-1">
                      {formData.email ? "Please enter a valid email." : "Email is required."}
                    </div>
                  )}
                </div>

                {/* password */}
                <div className="col-md-6">
                  <label className="form-label" htmlFor="sf-password">Password</label>
                  <div className="position-relative">
                    <input
                      id="sf-password"
                      type={showPwd ? "text" : "password"}
                      name="password"
                      className="form-control"
                      placeholder="Create password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      autoComplete="new-password"
                      disabled={submitting || showSuccess}
                      aria-required="true"
                    />
                    {/* eye toggle */}
                    <button
                      type="button"
                      className="btn btn-outline-glass position-absolute top-50 end-0 translate-middle-y me-2 py-1 px-2"
                      onClick={() => setShowPwd((v) => !v)}
                      aria-label={showPwd ? "Hide password" : "Show password"}
                      disabled={submitting || showSuccess}
                    >
                      <i className={`bi ${showPwd ? "bi-eye-slash" : "bi-eye"}`}></i>
                    </button>
                  </div>
                  {showPasswordRequired && (
                    <div className="text-danger small mt-1">
                      Password is required.
                    </div>
                  )}
                </div>

                {/* confirm password */}
                <div className="col-md-6">
                  <label className="form-label" htmlFor="sf-confirm">Confirm Password</label>
                  <div className="position-relative">
                    <input
                      id="sf-confirm"
                      type={showConfirmPwd ? "text" : "password"}
                      name="confirmPassword"
                      className="form-control"
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      autoComplete="new-password"
                      disabled={submitting || showSuccess}
                      aria-invalid={(showConfirmError || showConfirmRequired) ? "true" : "false"}
                      aria-describedby={(showConfirmError || showConfirmRequired) ? "sf-confirm-err" : undefined}
                    />
                    {/* eye toggle */}
                    <button
                      type="button"
                      className="btn btn-outline-glass position-absolute top-50 end-0 translate-middle-y me-2 py-1 px-2"
                      onClick={() => setShowConfirmPwd((v) => !v)}
                      aria-label={showConfirmPwd ? "Hide confirm password" : "Show confirm password"}
                      disabled={submitting || showSuccess}
                    >
                      <i className={`bi ${showConfirmPwd ? "bi-eye-slash" : "bi-eye"}`}></i>
                    </button>
                  </div>
                  {(showConfirmRequired || showConfirmError) && (
                    <div id="sf-confirm-err" className="text-danger small mt-1">
                      {showConfirmRequired ? "Please confirm your password." : "Passwords do not match."}
                    </div>
                  )}
                </div>

                {/* mobile */}
                <div className="col-md-6">
                  <label className="form-label" htmlFor="sf-mobile">Mobile Number</label>
                  <input
                    id="sf-mobile"
                    type="tel"
                    name="mobileNumber"
                    className="form-control"
                    placeholder="10 digits"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    inputMode="numeric"
                    pattern="\d{10}"
                    maxLength={10}
                    required
                    disabled={submitting || showSuccess}
                    aria-invalid={showMobileError ? "true" : "false"}
                    aria-describedby={showMobileError ? "sf-mobile-err" : undefined}
                  />
                  {showMobileError && (
                    <div id="sf-mobile-err" className="text-danger small mt-1">
                      {formData.mobileNumber ? "Please enter a valid 10-digit mobile number." : "Mobile number is required."}
                    </div>
                  )}
                </div>

                {/* role */}
                <div className="col-md-6">
                  <label className="form-label" htmlFor="sf-role">Role</label>
                  <select
                    id="sf-role"
                    name="userRole"
                    className="form-select"
                    onChange={handleChange}
                    value={formData.userRole}
                    disabled={submitting || showSuccess}
                    aria-label="Select role"
                  >
                    <option value="BookReader">Book Reader</option>
                    <option value="BookRecommender">Book Recommender</option>
                  </select>
                </div>
              </div>

              {/* hints + rules */}
              {!pwdTyped && (
                <div className="text-muted small mt-3">
                  Tip: Use at least 8 characters with uppercase, lowercase, number & symbol.
                </div>
              )}

              {pwdTyped && (
                <div className="glass p-3 mt-3" aria-live="polite">
                  <ul className="mb-0 ps-4">
                    <li style={ruleStyle(rules.length)}>At least 8 characters</li>
                    <li style={ruleStyle(rules.upper)}>At least one uppercase letter</li>
                    <li style={ruleStyle(rules.lower)}>At least one lowercase letter</li>
                    <li style={ruleStyle(rules.number)}>At least one number</li>
                    <li style={ruleStyle(rules.special)}>At least one special character</li>
                  </ul>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-glow w-100 mt-4"
                style={{ opacity: canSubmitVisual ? 1 : 0.75 }}
                disabled={submitting || showSuccess}
                aria-disabled={submitting || showSuccess}
              >
                {submitting ? "Submitting..." : "Register"}
              </button>
            </form>

            <p className="text-center mt-3 text-muted">
              Already have an account? <Link to="/">Login</Link>
            </p>

            {/* success modal */}
            <ResultModal
              open={showSuccess}
              message={successMessage}
              okText="OK"
              onClose={handleSuccessClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
