import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./about.css";

const CountUp = ({ target, duration = 1400 }) => {
  const [display, setDisplay] = useState("0");
  const ref = useRef(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const num = parseInt(target, 10);
    const suffix = target.replace(/[0-9]/g, "");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true;
          let startTime = null;
          const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.floor(eased * num) + suffix);
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return <strong ref={ref}>{display}</strong>;
};

const stats = [
  { label: "Placed Students", value: "14+" },
  { label: "Happy Customers", value: "100+" },
  { label: "Mentor Network", value: "20+" },
  { label: "Live Projects", value: "10+" },
];

const successMetrics = [
  { label: "Websites Delivered", count: "4+", icon: "bi-globe2" },
  { label: "Android Apps", count: "2+", icon: "bi-phone-fill" },
  { label: "Happy Clients", count: "2+", icon: "bi-people-fill" },
  { label: "Countries Presence", count: "2+", icon: "bi-geo-alt-fill" },
  { label: "Happy Customers", count: "100+", icon: "bi-emoji-smile-fill" },
  { label: "Placed Students", count: "14+", icon: "bi-mortarboard-fill" },
  { label: "Years of Experience", count: "1+", icon: "bi-award-fill" },
  { label: "Live Projects", count: "10+", icon: "bi-lightning-charge-fill" },
  { label: "Non-Billable Projects", count: "20+", icon: "bi-folder2-open" },
  { label: "Billable Projects", count: "2+", icon: "bi-currency-rupee" },
];

const pillars = [
  {
    title: "Career-First Learning",
    description:
      "Every module is designed around job readiness with practical tasks, reviews, and interview-aligned outcomes.",
  },
  {
    title: "Mentor-Guided Delivery",
    description:
      "Learners receive structured guidance from industry professionals with progress checkpoints and performance feedback.",
  },
  {
    title: "Business + Tech Thinking",
    description:
      "Beyond coding, we train problem framing, communication, and solution delivery expected in real teams.",
  },
];

const pathways = [
  {
    title: "Fellowship Program",
    image: "/assets/img/fellowship.png",
    description:
      "Structured full-stack and domain tracks with project milestones, mentor review loops, and certification.",
  },
  {
    title: "Internship Program",
    image: "/assets/img/internship.png",
    description:
      "Hands-on product tasks, implementation sprints, and role-focused assignments for industry preparedness.",
  },
  {
    title: "Naan Mudhalvan Program",
    image: "/assets/img/nm.png",
    description:
      "State-aligned upskilling initiatives focused on employability, domain confidence, and practical outcomes.",
  },
];

const mission = {
  mission:
    "To make industry-relevant tech education accessible, structured, and outcome-driven for every learner — regardless of background.",
  vision:
    "To build the most trusted practical learning ecosystem in India, where every graduate is job-ready from day one.",
};

const goals = [
  {
    icon: "bi-bullseye",
    title: "Bridge the Skills Gap",
    description:
      "Close the gap between academic learning and real industry expectations through project-driven, mentor-reviewed training.",
    target: "10+ Domains",
  },
  {
    icon: "bi-people-fill",
    title: "Scale Affordable Education",
    description:
      "Make high-quality, industry-aligned tech education accessible to every learner regardless of financial background.",
    target: "100+ Learners",
  },
  {
    icon: "bi-patch-check-fill",
    title: "Achieve 80%+ Placement Rate",
    description:
      "Ensure at least 8 out of 10 program graduates secure a role, internship, or freelance opportunity within 6 months.",
    target: "80% Placement",
  },
  {
    icon: "bi-diagram-3-fill",
    title: "Grow the Mentor Network",
    description:
      "Expand our 1:1 mentor-learner network to 50+ industry professionals across web, data, Android, and business domains.",
    target: "50+ Mentors",
  },
  {
    icon: "bi-globe2",
    title: "National Reach",
    description:
      "Extend Learn TEK In programs to learners in Tier 2 and Tier 3 cities across India through online and hybrid formats.",
    target: "5+ States",
  },
  {
    icon: "bi-award-fill",
    title: "Recognised Certifications",
    description:
      "Partner with leading platforms and companies to issue certifications that are valued and recognised by top employers.",
    target: "10+ Partners",
  },
];

const technologies = [
  { label: "React", icon: "bi-filetype-jsx" },
  { label: "Node.js", icon: "bi-server" },
  { label: "MongoDB", icon: "bi-database-fill" },
  { label: "Android", icon: "bi-phone-fill" },
  { label: "Python", icon: "bi-filetype-py" },
  { label: "SQL", icon: "bi-table" },
  { label: "Git", icon: "bi-git" },
  { label: "REST APIs", icon: "bi-arrow-left-right" },
  { label: "Firebase", icon: "bi-fire" },
  { label: "UI/UX", icon: "bi-palette-fill" },
];


const API_BASE = (import.meta?.env?.VITE_API_BASE_URL || "").trim().replace(/\/$/, "");

function PlacementAvatar({ img, name }) {
  const [failed, setFailed] = useState(false);
  if (!img || failed) {
    return (
      <div className="about-testimonial-avatar about-placement-avatar-fallback">
        {(name || "?")[0].toUpperCase()}
      </div>
    );
  }
  return (
    <img
      src={img}
      alt={name}
      className="about-testimonial-avatar"
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

async function fetchPlacements() {
  // Dev: relative URL → Vite proxy (configured in vite.config.js) → local backend
  // Prod: absolute URL from VITE_API_BASE_URL env var
  const url = import.meta.env.DEV
    ? "/api/placed-people"
    : (API_BASE ? `${API_BASE}/api/placed-people` : "/api/placed-people");
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    const data = await r.json();
    return Array.isArray(data) && data.length ? data : null;
  } catch {
    return null;
  }
}

function usePlacements() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchPlacements()
      .then((data) => { if (data) setPlacements(data); })
      .finally(() => setLoading(false));
  }, []);
  return { placements, loading };
}

const clients = [
  { name: "Zoho", icon: "bi-building" },
  { name: "Cisco", icon: "bi-hdd-network-fill" },
  { name: "IBM", icon: "bi-cpu-fill" },
  { name: "Google", icon: "bi-google" },
  { name: "Oracle", icon: "bi-database-fill" },
  { name: "2M Cars", icon: "bi-car-front-fill" },
  { name: "Zone Cars Chennai", icon: "bi-geo-alt-fill" },
];

const companies = [
  { name: "Zoho", img: "/assets/img/companies/zoho.jpg" },
  { name: "TCS", img: "/assets/img/companies/tcs.jpg" },
  { name: "Wipro", img: "/assets/img/companies/wipro.jpg" },
  { name: "Infosys", img: "/assets/img/companies/infosys.jpg" },
  { name: "Accenture", img: "/assets/img/companies/accenture.jpg" },
  { name: "Cognizant", img: "/assets/img/companies/cognizant.jpg" },
  { name: "Capgemini", img: "/assets/img/companies/capgemini.jpg" },
  { name: "Outlier AI", img: "/assets/img/companies/outlierai.jpg" },
  { name: "Soul AI", img: "/assets/img/companies/soulai.jpg" },
  { name: "Avenstek", img: "/assets/img/companies/avenstek.png" },
  { name: "93Shoppers", img: "/assets/img/companies/93shoppers.jpg" },
  { name: "HEPL", img: "/assets/img/companies/hepl.jpg" },
  { name: "APT", img: "/assets/img/companies/apt.jpg" },
  { name: "UEM", img: "/assets/img/companies/uem.jpg" },
  { name: "VVT", img: "/assets/img/companies/vvt.jpg" },
  { name: "KrisCaseFactory", img: "/assets/img/companies/kriscasefactory.jpg" },
];

const leaders = [
  {
    name: "Selvavel Shanmugam",
    role: "Founder | Chairman",
    link: "https://www.linkedin.com/in/selvavel/",
  },
  {
    name: "Rajeshwaran Selvam",
    role: "SDE at Outlier AI | Mentor",
    link: "https://www.linkedin.com/in/rajeshwaranslv07/",
  },
  {
    name: "Gopi Krishnan M",
    role: "Business Head",
    link: "https://www.linkedin.com/in/gopi-krishnan-8038a5242/",
  },
  {
    name: "Chella Kumar Murugan",
    role: "Business Analyst",
    link: "https://www.linkedin.com/in/chella-kumar-6448a1190/",
  },
  {
    name: "Jaya Abirami Selvam",
    role: "Mentor",
    link: "https://www.linkedin.com/in/jayaabirami/",
  },
  {
    name: "Jaya Sivagami Selvam",
    role: "Co-Founder | Mentor",
    link: "https://www.linkedin.com/company/learntekin",
  },
];

function About() {
  const { placements, loading: placementsLoading } = usePlacements();

  useEffect(() => {
    document.title = "About";
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    const els = document.querySelectorAll(".about-animate:not(.in-view)");
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [placements]);

  return (
    <section id="about" className="about-page">
      <div className="container-fluid about-shell">
        <header className="about-hero">
          <div className="about-hero-copy about-animate">
            <p className="about-kicker">ABOUT LEARN TEK IN</p>
            <h1>A practical learning ecosystem built for outcomes</h1>
            <p>
              Learn TEK In bridges the gap between academics and industry through
              structured training in web development, Android, testing, data,
              and business-focused technology skills.
            </p>
            <div className="about-hero-actions">
              <Link to="/Products" className="gfg-btn">
                Explore Programs
              </Link>
              <Link to="/Contact" className="gfg-btn gfg-btn-outline">
                Talk to Team
              </Link>
            </div>
          </div>

          <div className="about-stat-grid about-animate" style={{ "--delay": "0.15s" }}>
            {stats.map((item, i) => (
              <article key={item.label} className="about-stat-card about-animate" style={{ "--delay": `${i * 0.1}s` }}>
                <p>{item.value}</p>
                <span>{item.label}</span>
              </article>
            ))}
          </div>
        </header>

        {/* ── Mission & Vision ── */}
        <section className="about-section about-mv-section">
          <div className="about-mv-grid">
            <article className="about-mv-card about-animate from-left">
              <span className="about-mv-label">Our Mission</span>
              <p>{mission.mission}</p>
            </article>
            <article className="about-mv-card about-mv-card--vision about-animate from-right" style={{ "--delay": "0.1s" }}>
              <span className="about-mv-label">Our Vision</span>
              <p>{mission.vision}</p>
            </article>
          </div>
        </section>

        {/* ── Goals ── */}
        <section className="about-section">
          <div className="about-section-head about-animate">
            <h2>Our Goals</h2>
            <p>The milestones we are working toward — measurable, meaningful, and mission-aligned.</p>
          </div>
          <div className="about-goals-grid">
            {goals.map((goal, i) => (
              <article
                key={goal.title}
                className="about-goal-card about-animate scale"
                style={{ "--delay": `${i * 0.08}s` }}
              >
                <div className="about-goal-icon">
                  <i className={`bi ${goal.icon}`} aria-hidden="true" />
                </div>
                <span className="about-goal-target">{goal.target}</span>
                <h3>{goal.title}</h3>
                <p>{goal.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section">
          <div className="about-section-head about-animate">
            <h2>Why Learners Choose Learn TEK In</h2>
            <p>
              Clean structure, mentor accountability, and measurable progress at
              every stage.
            </p>
          </div>
          <div className="row g-4">
            {pillars.map((pillar, i) => (
              <div className="col-lg-4 col-md-6" key={pillar.title}>
                <article className="about-pillar-card h-100 about-animate" style={{ "--delay": `${i * 0.12}s` }}>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.description}</p>
                </article>
              </div>
            ))}
          </div>
        </section>

        {/* ── Success Metrics Dashboard ── */}
        <section className="about-section">
          <div className="about-section-head about-animate">
            <h2>Our Success Metrics</h2>
            <p>Achievements that define our journey.</p>
          </div>
          <div className="about-metrics-grid">
            {successMetrics.map((m, i) => (
              <article key={m.label} className="about-metric-card about-animate" style={{ "--delay": `${i * 0.07}s` }}>
                <i className={`bi ${m.icon}`} aria-hidden="true" />
                <CountUp target={m.count} />
                <span>{m.label}</span>
              </article>
            ))}
          </div>
        </section>

        {/* ── Technologies ── */}
        <section className="about-section">
          <div className="about-section-head about-animate">
            <h2>Technologies We Teach</h2>
            <p>Industry-standard tools and frameworks across every learning track.</p>
          </div>
          <div className="about-tech-grid">
            {technologies.map((tech, i) => (
              <article key={tech.label} className="about-tech-chip about-animate scale" style={{ "--delay": `${i * 0.05}s` }}>
                <i className={`bi ${tech.icon}`} aria-hidden="true" />
                <span>{tech.label}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section">
          <div className="about-section-head about-animate">
            <h2>Programs in Progress</h2>
            <p>
              Choose a pathway aligned with your experience level and target
              role.
            </p>
          </div>
          <div className="about-program-grid">
            {pathways.map((item, i) => (
              <article key={item.title} className={`about-program-card about-animate ${i % 2 === 0 ? "from-left" : "from-right"}`} style={{ "--delay": `${i * 0.1}s` }}>
                <img src={item.image} alt={item.title} loading="lazy" />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section">
          <div className="about-section-head about-animate">
            <h2>Leadership Team</h2>
            <p>
              Experienced mentors and leaders committed to learner growth and
              industry impact.
            </p>
          </div>
          <div className="row g-4">
            {leaders.map((leader, i) => (
              <div className="col-xl-4 col-lg-6" key={leader.name}>
                <article className="about-leader-card h-100 about-animate" style={{ "--delay": `${i * 0.1}s` }}>
                  <h4>{leader.name}</h4>
                  <p>{leader.role}</p>
                  <a
                    href={leader.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="about-leader-link"
                  >
                    View Profile
                  </a>
                </article>
              </div>
            ))}
          </div>
        </section>
        {/* ── Placed Learners ── */}
        <section className="about-section">
          <div className="about-section-head about-animate">
            <h2>Placed Learners</h2>
            <p>Real outcomes from real people who went through our programs.</p>
          </div>
          {placementsLoading ? (
            <div className="about-placements-ticker-wrap">
              <div className="about-placements-ticker" style={{ animationPlayState: "paused" }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <article className="about-testimonial-card about-placement-slide" key={i} style={{ opacity: 0.35 }}>
                    <div style={{ height: 56, background: "#e8f0eb", borderRadius: 8, marginBottom: 16 }} />
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#e8f0eb", flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ height: 14, background: "#e8f0eb", borderRadius: 4, marginBottom: 6, width: "60%" }} />
                        <div style={{ height: 12, background: "#e8f0eb", borderRadius: 4, width: "80%" }} />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : placements.length === 0 ? (
            <p style={{ color: "#999", textAlign: "center", marginTop: "1rem" }}>No placements to show yet.</p>
          ) : (
            <div className="about-placements-ticker-wrap">
              <div className="about-placements-ticker">
                {[...placements, ...placements].map((p, i) => (
                  <article className="about-testimonial-card about-placement-slide" key={i}>
                    {/* Identity header */}
                    <div className="about-placement-header">
                      <PlacementAvatar img={p.img} name={p.name} />
                      <div className="about-placement-identity">
                        <strong className="about-placement-name">{p.name}</strong>
                        <span className="about-placement-role">{p.role}</span>
                        <div className="about-placement-company" title={p.company}>
                          <i className="bi bi-building-fill" />
                          <span>{p.company}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quote */}
                    <p className="about-testimonial-quote">"{p.quote}"</p>

                    {/* Meta: dates + LinkedIn */}
                    <div className="about-placement-meta">
                      <div className="about-testimonial-dates">
                        {p.placedDate && (
                          <span className="about-testimonial-date-badge">
                            <i className="bi bi-briefcase-fill" />
                            {new Date(p.placedDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                          </span>
                        )}
                        {p.createdAt && (
                          <span className="about-testimonial-date-badge about-testimonial-date-posted">
                            <i className="bi bi-calendar3" />
                            {new Date(p.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                          </span>
                        )}
                      </div>
                      {p.linkedIn && (
                        <a
                          href={p.linkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="about-testimonial-linkedin"
                        >
                          <i className="bi bi-linkedin" /> LinkedIn
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ── Clients ── */}
        <section className="about-section">
          <div className="about-section-head about-animate">
            <h2>Our Partnerships</h2>
            <p>Organisations we collaborate and deliver with.</p>
          </div>
          <div className="about-clients-grid">
            {clients.map((c, i) => (
              <div key={c.name} className="about-client-card about-animate scale" style={{ "--delay": `${i * 0.07}s` }}>
                <i className={`bi ${c.icon}`} aria-hidden="true" />
                <span>{c.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Where Our Learners Work ── */}
        <section className="about-section">
          <div className="about-section-head about-animate">
            <h2>Where Our Learners Work</h2>
            <p>Companies that have hired Learn TEK In alumni.</p>
          </div>
          <div className="about-clients-ticker-wrap">
            <div className="about-clients-ticker">
              {[...companies, ...companies].map((c, i) => (
                <div key={i} className="about-company-chip">
                  <img src={c.img} alt={c.name} loading="lazy" />
                  <span>{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="about-section about-cta-section about-animate">
          <h2>Ready to start your journey?</h2>
          <p>Join a program, talk to a mentor, or explore our learning tracks — take the first step today.</p>
          <div className="about-hero-actions" style={{ justifyContent: "center" }}>
            <Link to="/Products" className="gfg-btn">Explore Programs</Link>
            <Link to="/Contact" className="gfg-btn gfg-btn-outline">Talk to Team</Link>
          </div>
        </section>

      </div>
    </section>
  );
}

export default About;
