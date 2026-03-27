import React, { useEffect, useState } from "react";
import "./PublicSplash.css";

const TAGS = ["React", "Node.js", "MongoDB", "Python", "Git"];

export default function PublicSplash() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setPhase(1), 350);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`ps-wrap${phase === 1 ? " ps-wrap--ready" : ""}`} role="status" aria-label="Loading">
      {/* background grid */}
      <div className="ps-grid" aria-hidden="true" />

      {/* ambient orbs */}
      <span className="ps-orb ps-orb-1" aria-hidden="true" />
      <span className="ps-orb ps-orb-2" aria-hidden="true" />

      <div className="ps-card">
        {/* Logo ring */}
        <div className="ps-logo-wrap" aria-hidden="true">
          <div className="ps-ring ps-ring-outer" />
          <div className="ps-ring ps-ring-inner" />
          <div className="ps-logo-center">
            <span className="ps-logo-letter">L</span>
          </div>
        </div>

        {/* Brand */}
        <h1 className="ps-brand">
          LearnTEK<span className="ps-brand-dot">.</span>Innovations
        </h1>
        <p className="ps-tagline">We construct your path to the digital world.</p>

        {/* Tech tags */}
        <div className="ps-tags" aria-hidden="true">
          {TAGS.map((tag, i) => (
            <span key={tag} className="ps-tag" style={{ animationDelay: `${i * 0.12}s` }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Progress bar */}
        <div className="ps-progress-wrap" aria-hidden="true">
          <div className="ps-progress-bar" />
        </div>

        <p className="ps-status">Loading experience…</p>

        {/* Bouncing dots */}
        <div className="ps-dots" aria-hidden="true">
          <span /><span /><span />
        </div>
      </div>
    </div>
  );
}
