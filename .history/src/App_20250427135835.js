// Packages used
import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";


import { Helmet } from "react-helmet";
// Component Splitted
import Navbar from "./Components/Home/Navbar";





import InternshipList from "./Components/InternshipList/InternshipList";
import InternshipApplication from "./Components/forms/InternshipApplication";


//autentication
import { AuthProvider } from "./Components/auth/authContext";
import ProtectedRoute from "./Components/auth/protectedRoute";
import Login from "./Components/auth/Login";
import Register from "./Components/auth/Register";
import { useState } from "react";
// warning popup
import WIPPopup from "./Components/Warnings/WIPPopup";



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
          {/* Script config files */}
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

          

          <Switch>
            <main id="main">
              
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              {/* <ProtectedRoute path="/home" component={Home}/> */}
              

              <ProtectedRoute exact path="/InternshipApplication" component={InternshipApplication} />
              
              
              <ProtectedRoute exact path="/InternshipList" component={InternshipList} />
              
            </main>
          </Switch>

          {/* Footer Section */}

          

          <a
            href="#"
            class="back-to-top d-flex align-items-center justify-content-center"
          >
            <i class="bi bi-arrow-up-short"></i>
          </a>
        </div>
      </Router>
    </AuthProvider>
  );
}
export default App;
