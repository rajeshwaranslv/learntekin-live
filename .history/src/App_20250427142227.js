// Packages used
import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Helmet } from "react-helmet";

import Navbar from "./Components/Home/Navbar";
import Footer from "./Components/Footer/Footer";

import InternshipList from "./Components/InternshipList/InternshipList";
import InternshipApplication from "./Components/forms/InternshipApplication";

import { AuthProvider } from "./Components/auth/authContext";
import ProtectedRoute from "./Components/auth/ProtectedRoute";
import Login from "./Components/auth/Login";
import Register from "./Components/auth/Register";

import WIPPopup from "./Components/Warnings/WIPPopup";

import "./App.css";

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

          <Navbar />

          <main id="main">
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <ProtectedRoute exact path="/InternshipApplication" component={InternshipApplication} />
              <ProtectedRoute exact path="/InternshipList" component={InternshipList} />
            </Switch>
          </main>

          <Footer />

          <a href="#" className="back-to-top d-flex align-items-center justify-content-center">
            <i className="bi bi-arrow-up-short"></i>
          </a>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
