import React from "react";
import { motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./auth-ui.css";

const containerMotion = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: "easeOut" },
  },
};

const panelMotion = {
  hidden: { opacity: 0, x: -18 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.44, delay: 0.06, ease: "easeOut" },
  },
};

const formMotion = {
  hidden: { opacity: 0, x: 18 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.44, delay: 0.1, ease: "easeOut" },
  },
};

function AuthLayout({ formTitle, formSubtitle, children }) {
  return (
    <section className="auth-ui-shell">
      <div className="auth-ui-bg-layer" aria-hidden="true"></div>

      <div className="auth-ui-container">
        <motion.article
          variants={containerMotion}
          initial="hidden"
          animate="visible"
          className="auth-ui-card"
        >
          <motion.aside variants={panelMotion} className="auth-ui-brand-panel">
            <div className="auth-ui-badge">Enterprise Learning Access</div>

            <div className="auth-ui-logo-card">
              <img
                src="/assets/img/logo.png"
                alt="LearnTEK"
                className="auth-ui-logo"
              />
              <div>
                <p className="auth-ui-logo-title">learntekin.co.in</p>
                <p className="auth-ui-logo-subtitle">Learning by building</p>
              </div>
            </div>

            <h1 className="auth-ui-brand-title">Learn. Build. Grow.</h1>
            <p className="auth-ui-brand-copy">
              Build practical skills with mentorship, guided projects, and
              career-aligned learning paths for modern tech roles.
            </p>

            <ul className="auth-ui-feature-list">
              <li>Role-based training tracks</li>
              <li>Production-focused curriculum</li>
              <li>Guided outcomes and verification</li>
            </ul>

            <div className="auth-ui-trust">
              <p className="auth-ui-trust-title">Trusted by learners and mentors</p>
              <p className="auth-ui-trust-copy">
                Structured programs in Web, Android, Data, and Testing with
                measurable progress and industry-ready outcomes.
              </p>
            </div>
          </motion.aside>

          <motion.main variants={formMotion} className="auth-ui-form-panel">
            <div className="auth-ui-form-inner">
              <div className="auth-ui-form-head">
                <p className="auth-ui-kicker">Learn TEK In Account</p>
                <h2>{formTitle}</h2>
                <p>{formSubtitle}</p>
              </div>
              {children}
            </div>
          </motion.main>
        </motion.article>
      </div>

      <ToastContainer position="bottom-right" autoClose={2800} />
    </section>
  );
}

export default AuthLayout;
