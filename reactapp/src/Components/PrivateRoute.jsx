
// src/Components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

const isTokenValid = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return false;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch {
    return false;
  }
};

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // Not logged in → redirect
  if (!token) return <Navigate to="/" replace />;

  // Token expired → redirect
  if (!isTokenValid(token)) {
    localStorage.clear();
    return <Navigate to="/" replace />;
  }

  // Wrong role → redirect
  if (role && role !== userRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
