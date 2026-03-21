import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./about.css";

const stats = [
  { label: "Active Tracks", value: "12+" },
  { label: "Placed Learners", value: "100+" },
  { label: "Mentor Network", value: "20+" },
  { label: "Live Projects", value: "30+" },
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
  useEffect(() => {
    document.title = "About";
  }, []);

  return (
    <section id="about" className="about-page">
      <div className="container-fluid about-shell">
        <header className="about-hero">
          <div className="about-hero-copy">
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

          <div className="about-stat-grid">
            {stats.map((item) => (
              <article key={item.label} className="about-stat-card">
                <p>{item.value}</p>
                <span>{item.label}</span>
              </article>
            ))}
          </div>
        </header>

        <section className="about-section">
          <div className="about-section-head">
            <h2>Why Learners Choose Learn TEK In</h2>
            <p>
              Clean structure, mentor accountability, and measurable progress at
              every stage.
            </p>
          </div>
          <div className="row g-4">
            {pillars.map((pillar) => (
              <div className="col-lg-4 col-md-6" key={pillar.title}>
                <article className="about-pillar-card h-100">
                  <h3>{pillar.title}</h3>
                  <p>{pillar.description}</p>
                </article>
              </div>
            ))}
          </div>
        </section>

        <section className="about-section">
          <div className="about-section-head">
            <h2>Programs in Progress</h2>
            <p>
              Choose a pathway aligned with your experience level and target
              role.
            </p>
          </div>
          <div className="about-program-grid">
            {pathways.map((item) => (
              <article key={item.title} className="about-program-card">
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
          <div className="about-section-head">
            <h2>Leadership Team</h2>
            <p>
              Experienced mentors and leaders committed to learner growth and
              industry impact.
            </p>
          </div>
          <div className="row g-4">
            {leaders.map((leader) => (
              <div className="col-xl-4 col-lg-6" key={leader.name}>
                <article className="about-leader-card h-100">
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
      </div>
    </section>
  );
}

export default About;
