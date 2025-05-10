// Packages used
import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import courseDetails from "./Components/Products/courseDetails";

import { Helmet } from "react-helmet";
// Component Splitted
import Navbar from "./Components/Home/Navbar";
import Services from "./Components/Services/Services";
import Hero from "./Components/About/Hero";
import About from "./Components/About/About";
import Products from "./Components/Products/Products";
import Footer from "./Components/Footer/Footer";
import End from "./Components/Footer/End";
import Careers from "./Components/forms/Careers";
import Contact from "./Components/forms/Contact";
import Blogs from "./Components/Blogs/Blog";


//autentication
import { AuthProvider } from "./Components/auth/authContext";
import ProtectedRoute from "./Components/auth/protectedRoute";
import Login from "./Components/auth/Login";
import Register from "./Components/auth/Register";
import { useState } from "react";
// warning popup
import WIPPopup from "./Components/Warnings/WIPPopup";
import ThoughtLeadersScreen from "./Components/About/ThoughtLeadersScreen"

import FAQSection from "./Components/Blogs/FAQSection";

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

          <Route exact path="/" component={Hero} />
          
          <Route exact path="/" component={ThoughtLeadersScreen} />


          <Switch>
            <main id="main">
              <Route path="/About" component={About} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              {/* <ProtectedRoute path="/home" component={Home}/> */}
              <Route exact path="/Services" component={Services} />

              <ProtectedRoute exact path="/Careers" component={Careers} />
              <ProtectedRoute exact path="/Contact" component={Contact} />
              <Route exact path="/Products" component={Products} />
              <ProtectedRoute
                exact
                path="/courseDetails"
                component={courseDetails}
              />
              <ProtectedRoute exact path="/Blogs" component={Blogs} />
              <ProtectedRoute exact path="/faq" component={FAQSection} />
            </main>
          </Switch>

          {/* Footer Section */}

          <footer id="footer">
            <div class="footer-top">
              <Footer />
            </div>
            <End />
          </footer>

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
