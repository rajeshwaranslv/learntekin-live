// Packages used
import React, { Suspense, lazy, useEffect, useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
} from "react-router-dom";

// Component Splitted
import Navbar from "./Components/Home/Navbar";
import Footer from "./Components/Footer/Footer";
import End from "./Components/Footer/End";


//autentication
import { AuthProvider } from "./Components/auth/authContext";
// warning popup
import WIPPopup from "./Components/Warnings/WIPPopup";
import PublicSplash from "./Components/Warnings/PublicSplash";
import Chatbot from "./Components/Chatbot/Chatbot";

const Hero = lazy(() => import("./Components/About/Hero"));
const ThoughtLeadersScreen = lazy(() =>
  import("./Components/About/ThoughtLeadersScreen")
);
const About = lazy(() => import("./Components/About/About"));
const Login = lazy(() => import("./Components/auth/Login"));
const Register = lazy(() => import("./Components/auth/Register"));
const Services = lazy(() => import("./Components/Services/Services"));
const Careers = lazy(() => import("./Components/forms/Careers"));
const Contact = lazy(() => import("./Components/forms/Contact"));
const Eseva = lazy(() => import("./Components/Products/Eseva/Eseva"));
const Products = lazy(() => import("./Components/Products/Products"));
const CourseDetails = lazy(() => import("./Components/Products/courseDetails"));
const Blogs = lazy(() => import("./Components/Blogs/Blog"));
const FAQSection = lazy(() => import("./Components/Blogs/FAQSection"));
const NotFound = lazy(() => import("./Components/Warnings/NotFound"));
const Unauthorized = lazy(() => import("./Components/Warnings/Unauthorized"));
const Internships = lazy(() => import("./Components/Internship/Internships"));
const PCBuilder = lazy(() => import("./Components/PCFactory/PCBuilder"));
const LMSPage = lazy(() => import("./Components/LMS/LMSPage"));
const LibraryPage = lazy(() => import("./Components/Library/LibraryPage"));
const YoutubePromoForm = lazy(() => import("./Components/Services/YoutubePromoForm"));

const refreshAos = () => {
  if (!window.AOS) {
    return;
  }

  if (typeof window.AOS.refreshHard === "function") {
    window.AOS.refreshHard();
    return;
  }

  if (typeof window.AOS.refresh === "function") {
    window.AOS.refresh();
  }
};

const ensureAosVisibility = () => {
  if (typeof document === "undefined") {
    return;
  }

  const nodes = document.querySelectorAll("[data-aos]");
  nodes.forEach((node) => {
    node.style.opacity = "1";
    node.style.visibility = "visible";
    node.style.transform = "none";
  });
};

function AppShell({ showWIPPopup, closeWIPPopup, routeFallback }) {
  const location = useLocation();

  useEffect(() => {
    ensureAosVisibility();
    const firstPassTimer = window.setTimeout(ensureAosVisibility, 80);
    const secondPassTimer = window.setTimeout(ensureAosVisibility, 260);
    refreshAos();

    return () => {
      window.clearTimeout(firstPassTimer);
      window.clearTimeout(secondPassTimer);
    };
  }, [location.pathname]);

  return (
    <div className="App">
      <WIPPopup visible={showWIPPopup} onClose={closeWIPPopup} />

      <Navbar />

      <Suspense fallback={routeFallback}>
        <main id="main">
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <>
                  <Hero />
                  <ThoughtLeadersScreen />
                </>
              )}
            />
            <Route exact path="/About" component={About} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/Services" component={Services} />
            <Route exact path="/Careers" component={Careers} />
            <Route exact path="/Contact" component={Contact} />
            <Route exact path={["/eseva", "/ESeva"]} component={Eseva} />
            <Route exact path="/Products" component={Products} />
            <Route exact path="/courseDetails" component={CourseDetails} />
            <Route exact path="/Blogs" component={Blogs} />
            <Route exact path="/faq" component={FAQSection} />
            <Route exact path="/internships" component={Internships} />
            <Route exact path="/Products/pc-factory" component={PCBuilder} />
            <Route exact path="/Products/lms" component={LMSPage} />
            <Route exact path="/Products/library" component={LibraryPage} />
            <Route exact path="/Services/youtube-promo" component={YoutubePromoForm} />
            <Route exact path="/unauthorized" component={Unauthorized} />
            <Route path="*" component={NotFound} />
          </Switch>
        </main>
      </Suspense>

      {/* Footer Section */}

      <footer id="footer">
        <div className="footer-top">
          <Footer />
        </div>
        <End />
      </footer>

      <Chatbot />

      <a
        href="#"
        className="back-to-top d-flex align-items-center justify-content-center"
      >
        <i className="bi bi-arrow-up-short"></i>
      </a>
    </div>
  );
}

function App() {
  const [showWIPPopup, setShowWIPPopup] = useState(false);

  const closeWIPPopup = () => {
    setShowWIPPopup(false);
  };

  const routeFallback = <PublicSplash />;

  useEffect(() => {
    let attempts = 0;
    let cancelled = false;
    let timerId;

    const initAos = () => {
      if (!window.AOS || typeof window.AOS.init !== "function") {
        ensureAosVisibility();
        return false;
      }

      window.AOS.init({
        duration: 650,
        easing: "ease-out-cubic",
        once: true,
      });

      document.body.classList.add("aos-enabled");
      ensureAosVisibility();
      refreshAos();
      return true;
    };

    if (initAos()) {
      return undefined;
    }

    timerId = window.setInterval(() => {
      if (cancelled) {
        return;
      }

      attempts += 1;
      const initialized = initAos();
      if (initialized || attempts >= 40) {
        window.clearInterval(timerId);
      }
    }, 250);

    return () => {
      cancelled = true;
      if (timerId) {
        window.clearInterval(timerId);
      }
    };
  }, []);

  return (
    <AuthProvider>
      <Router>
        <AppShell
          showWIPPopup={showWIPPopup}
          closeWIPPopup={closeWIPPopup}
          routeFallback={routeFallback}
        />
      </Router>
    </AuthProvider>
  );
}
export default App;
