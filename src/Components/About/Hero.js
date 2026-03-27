import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

/* ── Animated counter ── */
function Counter({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const step = Math.ceil(to / 40);
          const tick = setInterval(() => {
            start = Math.min(start + step, to);
            setVal(start);
            if (start >= to) clearInterval(tick);
          }, 38);
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);

  return <span ref={ref}>{val}{suffix}</span>;
}

const FLOATING_TAGS = [
  { label: "React", icon: "bi-lightning-charge-fill", delay: "0s", pos: "top-left" },
  { label: "Node.js", icon: "bi-server", delay: "0.6s", pos: "top-right" },
  { label: "MongoDB", icon: "bi-database-fill", delay: "1.2s", pos: "mid-right" },
  { label: "Python", icon: "bi-code-slash", delay: "0.3s", pos: "bot-left" },
  { label: "Git", icon: "bi-git", delay: "0.9s", pos: "bot-right" },
];

export default function Hero() {
  useEffect(() => {
    document.title = "Welcome to LearnTEK In";
  }, []);

  return (
    <section id="hero" aria-label="Hero section">
      {/* ── background layers ── */}
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-bg-mesh" />
        <span className="hero-orb hero-orb-1" />
        <span className="hero-orb hero-orb-2" />
        <span className="hero-orb hero-orb-3" />
        <div className="hero-grid-lines" />
      </div>

      {/* ── floating tech tags (decorative) ── */}
      <div className="hero-floats" aria-hidden="true">
        {FLOATING_TAGS.map((t) => (
          <div
            key={t.label}
            className={`hero-float-tag hero-float-tag--${t.pos}`}
            style={{ animationDelay: t.delay }}
          >
            <i className={`bi ${t.icon}`} />
            {t.label}
          </div>
        ))}
      </div>

      {/* ── main content ── */}
      <div className="hero-content-wrap">
        <div className="hero-inner">
          {/* Kicker badge */}
          <div className="hero-kicker" data-aos="fade-down" data-aos-delay="0">
            <span className="hero-kicker-dot" />
            India's Practical Tech Career Platform
          </div>

          {/* Headline */}
          <h1 className="hero-headline" data-aos="fade-up" data-aos-delay="80">
            We <span className="hero-hl">Construct</span> Your
            <br className="hero-br" />
            Dream Path to the{" "}
            <span className="hero-hl hero-hl--glow">Digital World</span>
          </h1>

          {/* Subtext */}
          <p className="hero-sub" data-aos="fade-up" data-aos-delay="160">
            Learn real-world tech skills, build with mentors, and get placed —
            all under one platform. Fellowship &amp; Internship programs across
            Web, Android, Data, and more.
          </p>

          {/* CTA row */}
          <div className="hero-actions" data-aos="fade-up" data-aos-delay="240">
            <Link to="/Products" className="hero-btn hero-btn--primary">
              <i className="bi bi-lightning-charge-fill" />
              Start Your Journey
            </Link>
            <Link to="/About" className="hero-btn hero-btn--outline">
              <i className="bi bi-play-circle" />
              About Us
            </Link>
          </div>

          {/* Stats row */}
          <div className="hero-stats" data-aos="fade-up" data-aos-delay="320">
            <div className="hero-stat">
              <strong><Counter to={50} suffix="+" /></strong>
              <span>Learners Placed</span>
            </div>
            <div className="hero-stat-sep" />
            <div className="hero-stat">
              <strong><Counter to={3} suffix="+" /></strong>
              <span>Years Running</span>
            </div>
            <div className="hero-stat-sep" />
            <div className="hero-stat">
              <strong>100%</strong>
              <span>Mentor Support</span>
            </div>
            <div className="hero-stat-sep" />
            <div className="hero-stat">
              <strong><Counter to={5} suffix="+" /></strong>
              <span>Tech Domains</span>
            </div>
          </div>
        </div>

        {/* ── right panel: code mockup ── */}
        <div className="hero-visual" data-aos="zoom-in" data-aos-delay="100" aria-hidden="true">
          <div className="hero-card hero-card--terminal">
            <div className="hero-card-bar">
              <span /><span /><span />
              <em>learning_path.js</em>
            </div>
            <div className="hero-terminal-body">
              <div className="hero-line hero-line--comment"> Your tech career starts here</div>
              <div className="hero-line">
                <span className="ht-kw">const</span>{" "}
                <span className="ht-var">track</span>{" "}
                <span className="ht-op">=</span>{" "}
                <span className="ht-str">"FullStack Dev"</span><span className="ht-op">;</span>
              </div>
              <div className="hero-line">
                <span className="ht-kw">const</span>{" "}
                <span className="ht-var">mentors</span>{" "}
                <span className="ht-op">=</span>{" "}
                <span className="ht-bool">true</span><span className="ht-op">;</span>
              </div>
              <div className="hero-line hero-line--blank" />
              <div className="hero-line">
                <span className="ht-fn">enroll</span>
                <span className="ht-op">(</span>
                <span className="ht-str">"LearnTEKIn"</span>
                <span className="ht-op">).</span>
                <span className="ht-fn">then</span>
                <span className="ht-op">(()</span>
                <span className="ht-kw"> =&gt;</span>
                <span className="ht-op"> {"{"}</span>
              </div>
              <div className="hero-line hero-line--indent">
                <span className="ht-fn">build</span>
                <span className="ht-op">(</span>
                <span className="ht-var">projects</span>
                <span className="ht-op">);</span>
              </div>
              <div className="hero-line hero-line--indent">
                <span className="ht-fn">getPlaced</span>
                <span className="ht-op">(</span>
                <span className="ht-var">dream_company</span>
                <span className="ht-op">);</span>
              </div>
              <div className="hero-line"><span className="ht-op">{"}"});</span></div>
              <div className="hero-line hero-line--blank" />
              <div className="hero-line hero-line--output">
                <i className="bi bi-check-circle-fill" />
                &nbsp;Placement confirmed ✓
              </div>
              <div className="hero-cursor-line">
                <span className="hero-blink-cursor" />
              </div>
            </div>
          </div>

          {/* Floating achievement chips */}
          <div className="hero-chip hero-chip--a">
            <i className="bi bi-award-fill" /> Certificate Issued
          </div>
          <div className="hero-chip hero-chip--b">
            <i className="bi bi-briefcase-fill" /> Placed at TCS
          </div>
          <div className="hero-chip hero-chip--c">
            <i className="bi bi-star-fill" /> Mentor Review ★★★★★
          </div>
        </div>
      </div>

      {/* ── scroll indicator ── */}
      <div className="hero-scroll-hint" aria-hidden="true">
        <div className="hero-scroll-mouse">
          <span className="hero-scroll-wheel" />
        </div>
        <span>Scroll</span>
      </div>

      {/* ── bottom wave ── */}
      <div className="hero-wave" aria-hidden="true">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <rect width="1440" height="60" fill="#2d7a4f" />
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#f5f8f7" />
        </svg>
      </div>
    </section>
  );
}
