import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./NotFound.css";

const cardMotion = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

function NotFound() {
  return (
    <section className="nf-page">
      <div className="nf-bg" aria-hidden="true"></div>

      <motion.article
        variants={cardMotion}
        initial="hidden"
        animate="visible"
        className="nf-card"
      >
        <p className="nf-code">404</p>
        <h1>Page Not Found</h1>
        <p className="nf-copy">
          The page you requested is unavailable or moved. Use one of the quick
          actions below to continue browsing Learn TEK In.
        </p>

        <div className="nf-actions">
          <Link to="/" className="gfg-btn">
            Go Home
          </Link>
          <button
            type="button"
            className="gfg-btn gfg-btn-outline"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>

        <p className="nf-footnote">
          Need account access? <Link to="/login">Go to Login</Link>
        </p>
      </motion.article>
    </section>
  );
}

export default NotFound;
