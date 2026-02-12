
// App.js
import React from "react";
// React Router components for navigation and route protection
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Global CSS frameworks and theme
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/theme.css";

// Page & feature components
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import PrivateRoute from "./Components/PrivateRoute";
import ViewBook from "./BookRecommenderComponents/ViewBook";
import BookForm from "./BookRecommenderComponents/BookForm";
import BookReaderViewBook from "./BookReaderComponents/BookReaderViewBook";
import HomePage from "./Components/HomePage";
import ErrorPage from "./Components/ErrorPage";

function App() {
  // Simple auth check: if a token exists in localStorage, we treat the user as logged in.
  // NOTE: This is client-side only and can be spoofed; real apps also validate tokens on the backend.
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  return (
    // BrowserRouter enables HTML5 history-based routing (clean URLs without hash)
    <BrowserRouter>
      {/* Routes groups all <Route> definitions */}
      <Routes>
        {/* Public routes (no login required) */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected route: /home accessible to any logged-in user */}
        <Route
          path="/home"
          element={
            // PrivateRoute wraps the element and ensures the user is authenticated
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />

        {/* Protected + Role-restricted routes for Book Recommender users */}
        <Route
          path="/books"
          element={
            // Only users with role "BookRecommender" can see the books management view
            <PrivateRoute role="BookRecommender">
              <ViewBook />
            </PrivateRoute>
          }
        />
        <Route
          path="/add"
          element={
            // Same role restriction for adding a new book
            <PrivateRoute role="BookRecommender">
              <BookForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            // Edit uses a dynamic URL param ":id" to load a specific book into the form
            <PrivateRoute role="BookRecommender">
              <BookForm />
            </PrivateRoute>
          }
        />

        {/* Protected + Role-restricted route for Book Reader users */}
        <Route
          path="/reader/books"
          element={
            // Only users with role "BookReader" can access the reader view
            <PrivateRoute role="BookReader">
              <BookReaderViewBook />
            </PrivateRoute>
          }
        />

        {/* Error page (also protected so only logged-in users can see it directly) */}
        <Route
          path="/error"
          element={
            <PrivateRoute>
              <ErrorPage />
            </PrivateRoute>
          }
        />

        {/* Catch-all route for any undefined paths:
            - If logged in: show the error page (so they know it’s a bad URL)
            - If not logged in: redirect to login
        */}
        <Route
          path="*"
          element={isLoggedIn ? <ErrorPage /> : <Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
