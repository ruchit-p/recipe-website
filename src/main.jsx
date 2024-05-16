import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./AuthContext";
import Bookmarks from "./pages/Bookmarks.jsx";
import Details from "./pages/Details.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/recipe-website/" element={<App />} />
          <Route path="/recipe-website/bookmarks" element={<Bookmarks />} />
          <Route path="/recipe-website/details/:id" element={<Details />} />
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);
