// Packages used
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Updated Switch -> Routes
import { Helmet } from "react-helmet";

import Navbar from "./Components/Home/Navbar";
import Footer from "./Components/Footer/Footer"; // Assuming you have Footer component

import InternshipList from "./Components/InternshipList/InternshipList";
import InternshipApplication from "./Components/forms/InternshipApplication";

// Authentication
import { AuthProvider } from "./Components/auth/authContext";
import ProtectedRoute from "./Components/auth/protectedRoute";
import Login from "./Components/auth/Login";
import Register from "./Components/auth/Register";

// Warning popup
import WIPPopup from "./Components/Warnings/WIPPopup";

import "./App.css"; // CSS import

function App() {
  const [showWIPPopup, setShowWIPPopup] = useState(false);

  const closeWIPPopup = () => {
    setShowWIPPopup(false);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <WIPPopup visible={showWIPPopup} onClose={closeWIPPopup} />

          {/* Helmet scripts */}
          <Helmet>
            <script src="assets/vendor/purecounter/purecounter.js" />
            <script src="assets/vendor/aos/aos.js" />
            <script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js" />
            <script src="assets/vendor/glightbox/js/glightbox.min.js" />
            <script src="assets/vendor/isotope-layout/isotope.pkgd.min.js" />
            <script src="assets/vendor/swiper/swiper-bundle.min.js" />
            <script src="assets/vendor/php-email-form/validate.js" />
            <script src="assets/js/main.js" type="text/javascript" />
          </Helmet>

          {/* Navbar always visible */}
          <Navbar />

          {/* Main Section */}
          <main id="main">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/InternshipApplication"
                element={<ProtectedRoute><InternshipApplication /></ProtectedRoute>}
              />
              <Route
                path="/InternshipList"
                element={<ProtectedRoute><InternshipList /></ProtectedRoute>}
              />
            </Routes>
          </main>

          {/* Footer (optional) */}
          <Footer />

          {/* Back to top button */}
          <a href="#" className="back-to-top d-flex align-items-center justify-content-center">
            <i className="bi bi-arrow-up-short"></i>
          </a>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
