import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Unauthorized.css";

const panelMotion = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

function Unauthorized() {
  return (
    <section className="unauth-page">
      <div className="unauth-bg" aria-hidden="true"></div>

      <motion.article
        variants={panelMotion}
        initial="hidden"
        animate="visible"
        className="unauth-card"
      >
        <p className="unauth-code">401</p>
        <h1>Unauthorized Access</h1>
        <p>
          You need to login with a valid account to access this page. Please
          continue with one of the actions below.
        </p>

        <div className="unauth-actions">
          <Link to="/login" className="gfg-btn">
            Login
          </Link>
          <Link to="/register" className="gfg-btn gfg-btn-outline">
            Register
          </Link>
        </div>
      </motion.article>
    </section>
  );
}

export default Unauthorized;
