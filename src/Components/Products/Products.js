import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { verifyCertificate } from "../../Components/actions/verifyCertificate";
import { buildApiUrl } from "../../utils/api";
import { normalizeInternshipPostings } from "../../utils/internshipPostings";
import { toDisplayLabel, toPlainText } from "../../utils/text";
import "./product.css";

const INTERNSHIP_API = buildApiUrl("/api/internships");

const formatCertificateDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const learningTracks = [
  {
    type: "Fellowship",
    title: "Website Development Fellowship",
    duration: "1 week to 6 months",
    description:
      "Build production-grade web applications with full-stack practices, mentor reviews, and delivery milestones.",
    points: [
      "Mentor-guided project workflow",
      "Milestone evaluations and feedback",
      "Certification and profile support",
      "Placement preparation assistance",
    ],
    roadmap: "https://roadmap.sh/full-stack",
    joinLink: "https://forms.gle/MWZy2xVp6v3jHLoJ8",
  },
  {
    type: "Fellowship",
    title: "Android Development Fellowship",
    duration: "1 week to 6 months",
    description:
      "Learn Android foundations to advanced app delivery, including architecture, APIs, and performance optimization.",
    points: [
      "Real implementation tasks",
      "Project-based assessments",
      "Mentor review checkpoints",
      "Interview readiness modules",
    ],
    roadmap: "https://roadmap.sh/android",
    joinLink: "https://forms.gle/MWZy2xVp6v3jHLoJ8",
  },
  {
    type: "Fellowship",
    title: "Data & Analytics Fellowship",
    duration: "4 weeks to 6 months",
    description:
      "Master analytics through practical datasets, SQL workflows, reporting, and decision-support projects.",
    points: [
      "Dashboard and reporting practice",
      "Business-case analysis",
      "Mentored SQL and data skills",
      "Completion + excellence certificates",
    ],
    roadmap: "https://roadmap.sh/data-analyst",
    joinLink: "https://forms.gle/MWZy2xVp6v3jHLoJ8",
  },
  {
    type: "Internship",
    title: "Website Development Internship",
    duration: "1 week to 6 months",
    description:
      "Work on delivery-oriented tasks with a product mindset and strengthen execution quality.",
    points: [
      "Project and internship certificates",
      "Community and mentor support",
      "Performance-based stipend pathways",
      "Profile and interview guidance",
    ],
    joinLink: "https://forms.gle/KY7gWBv78dzy3MC48",
  },
  {
    type: "Internship",
    title: "Android Development Internship",
    duration: "1 week to 6 months",
    description:
      "Build and improve Android modules with debugging practice and mentor-based delivery feedback.",
    points: [
      "Hands-on module development",
      "Debugging and quality checks",
      "Project + internship certification",
      "Placement support tracks",
    ],
    joinLink: "https://forms.gle/KY7gWBv78dzy3MC48",
  },
];

const platformServices = [
  {
    key: "pc-factory",
    icon: "bi-pc-display-horizontal",
    title: "PC Factory",
    description:
      "Build your custom PC by choosing from curated CPU, GPU, RAM, storage, motherboard, cabinet and PSU components. Get real-time compatibility checks and pay online.",
    points: [
      "Step-by-step component selector",
      "Automatic compatibility verification",
      "Live price summary",
      "Secure Razorpay checkout",
    ],
    link: "/Products/pc-factory",
    cta: "Build Your PC",
    internal: true,
  },
  {
    key: "lms",
    icon: "bi-mortarboard-fill",
    title: "Learning Management",
    description:
      "Browse and enroll in courses across Technology, Business, Design, and Data Science. Track your progress and earn certificates on completion.",
    points: [
      "Structured course modules",
      "Beginner to Advanced levels",
      "Free and paid courses",
      "Enrollment confirmation by email",
    ],
    link: "/Products/lms",
    cta: "Browse Courses",
    internal: true,
  },
  {
    key: "library",
    icon: "bi-book-half",
    title: "Digital Library",
    description:
      "Access our curated collection of physical and digital books. Borrow physical copies or read digital editions instantly online.",
    points: [
      "Physical borrow with due-date tracking",
      "Instant digital access",
      "Search by title, author, or category",
      "Borrow history lookup",
    ],
    link: "/Products/library",
    cta: "Explore Library",
    internal: true,
  },
];

const solutions = [
  {
    title: "financeFrenzy",
    description:
      "A focused platform for financial planning, investment pathways, and goal-based wealth guidance.",
    points: [
      "Personalized planning support",
      "Mutual funds, ETFs, stocks guidance",
      "Retirement and wealth strategy",
      "Consultation from experienced advisors",
    ],
    link: "https://financefrenzy-biz.web.app/",
    cta: "Explore financeFrenzy",
  },
  {
    title: "mummyDaddyCars",
    description:
      "Affordable and flexible car booking options for city rides, family travel, and long-distance trips.",
    points: [
      "Transparent pricing",
      "Flexible rental options",
      "Multiple vehicle categories",
      "Simple booking with support",
    ],
    link: "https://mummydaddycars.learntekin.co.in/",
    cta: "Book a Car Now",
  },
];

class Products extends Component {
  state = {
    certificateId: "",
    verifyMessage: "",
    verifiedCertificate: null,
    verifyStatus: "idle",
    autoDownloadRequested: false,
    liveOpportunities: [],
    liveLoading: true,
    liveFilter: "all",
  };

  componentDidMount() {
    document.title = "Products";
    fetch(INTERNSHIP_API)
      .then((r) => r.json())
      .then((data) =>
        this.setState({
          liveOpportunities: normalizeInternshipPostings(data),
          liveLoading: false,
        })
      )
      .catch(() => this.setState({ liveOpportunities: [], liveLoading: false }));

    const searchParams = new URLSearchParams(window.location.search);
    const certificateId = searchParams.get("certificateId")?.trim();
    const autoDownloadRequested = searchParams.get("download") === "1";

    if (certificateId) {
      this.setState(
        {
          certificateId,
          autoDownloadRequested,
        },
        () => {
          this.runCertificateVerification(certificateId, {
            autoDownload: autoDownloadRequested,
          });
        }
      );
    }
  }

  handleCertificateIdChange = (event) => {
    this.setState({ certificateId: event.target.value });
  };

  runCertificateVerification = async (certificateId, options = {}) => {
    const { verifyCertificate } = this.props;
    const normalizedCertificateId = certificateId.trim();

    if (!normalizedCertificateId) {
      this.setState({
        verifyStatus: "error",
        verifyMessage: "Please enter a certificate ID.",
        verifiedCertificate: null,
      });
      return null;
    }

    this.setState({
      verifyStatus: "loading",
      verifyMessage: "",
      verifiedCertificate: null,
    });

    try {
      const certificate = await verifyCertificate(normalizedCertificateId);
      this.setState({
        verifyStatus: "success",
        verifyMessage: `Certificate found: ${certificate.candidateName}`,
        verifiedCertificate: certificate,
      });
      if (options.autoDownload && certificate?.pdfDataUri) {
        this.downloadCertificatePdf(certificate);
      }
      return certificate;
    } catch {
      this.setState({
        verifyStatus: "error",
        verifyMessage: "Certificate not found. Please verify the ID and try again.",
        verifiedCertificate: null,
      });
      return null;
    }
  };

  handleVerifyCertificate = async (event) => {
    event.preventDefault();
    await this.runCertificateVerification(this.state.certificateId);
  };

  downloadCertificatePdf = (certificate) => {
    if (!certificate?.pdfDataUri || typeof document === "undefined") {
      return;
    }

    const anchor = document.createElement("a");
    anchor.href = certificate.pdfDataUri;
    anchor.download = `${certificate.certificateId || "certificate"}.pdf`;
    anchor.click();
  };

  render() {
    const {
      certificateId, verifyMessage, verifiedCertificate, verifyStatus,
      liveOpportunities, liveLoading, liveFilter,
    } = this.state;

    const visibleOpps = liveFilter === "all"
      ? liveOpportunities
      : liveOpportunities.filter(
          (o) => String(o.type || "").toLowerCase() === liveFilter
        );

    return (
      <section id="pricing" className="products-page">
        <div className="container-fluid products-shell">
          <header className="products-hero">
            <p className="products-kicker">PRODUCTS BUCKET LIST</p>
            <h1>Programs, Verification, and Solutions</h1>
            <p>
              Explore fellowship and internship tracks, verify certificates, and
              discover high-value solutions from the Learn TEK In ecosystem.
            </p>
            <div className="products-hero-actions">
              <Link to="/Contact" className="gfg-btn">
                Talk to Team
              </Link>
              <Link to="/Blogs" className="gfg-btn gfg-btn-outline">
                Explore Blogs
              </Link>
            </div>
          </header>

          <section className="products-section">
            <div className="products-section-head">
              <h2>Learning Tracks</h2>
              <p>
                Choose your learning journey based on role, duration, and career
                outcome.
              </p>
            </div>
            <div className="row g-4">
              {learningTracks.map((track) => (
                <div className="col-xl-4 col-lg-6" key={track.title}>
                  <article className="products-track-card h-100">
                    <div className="products-track-head">
                      <span className={`products-tag ${track.type.toLowerCase()}`}>
                        {track.type}
                      </span>
                      <small>{track.duration}</small>
                    </div>
                    <h3>{track.title}</h3>
                    <p>{track.description}</p>
                    <ul>
                      {track.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                    <div className="products-actions">
                      <a
                        href={track.joinLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gfg-btn"
                      >
                        Apply Now
                      </a>
                      {track.roadmap ? (
                        <a
                          href={track.roadmap}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="products-link"
                        >
                          View Roadmap
                        </a>
                      ) : null}
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </section>

          {/* ── Live Internship / Fellowship Openings ── */}
          <section className="products-section">
            <div className="products-section-head">
              <div className="products-openings-head">
                <div>
                  <h2>Current Openings</h2>
                  <p>Live internship &amp; fellowship positions — apply directly from here.</p>
                </div>
                <div className="products-openings-filters">
                  {["all", "internship", "fellowship"].map((f) => (
                    <button
                      key={f}
                      className={`products-opening-filter${liveFilter === f ? " active" : ""}`}
                      onClick={() => this.setState({ liveFilter: f })}
                    >
                      {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {liveLoading ? (
              <div className="products-openings-loading">
                <div className="products-openings-spinner" />
                <span>Loading opportunities…</span>
              </div>
            ) : visibleOpps.length === 0 ? (
              <div className="products-openings-empty">
                <i className="bi bi-briefcase" />
                <p>No open positions at the moment — check back soon.</p>
              </div>
            ) : (
              <div className="row g-3">
                {visibleOpps.map((opp) => {
                  const isExpired = new Date(opp.deadline) < new Date();
                  return (
                    <div
                      className="col-xl-4 col-lg-6"
                      key={opp._id || opp.id || `${opp.title}-${opp.deadline}`}
                    >
                      <article className={`products-opening-card h-100${isExpired ? " expired" : ""}`}>
                        <div className="products-track-head">
                          <span className={`products-tag ${opp.type}`}>
                            {toDisplayLabel(opp.type)}
                          </span>
                          {isExpired && <span className="products-tag products-tag-closed">Closed</span>}
                        </div>
                        <h3>{opp.title}</h3>
                        <p className="products-opening-domain">
                          <i className="bi bi-tag-fill" /> {opp.domain}
                        </p>
                        <p>{toPlainText(opp.description)}</p>
                        <div className="products-opening-meta">
                          <span><i className="bi bi-clock" /> {opp.duration}</span>
                          <span><i className="bi bi-currency-rupee" /> {opp.stipend || "Unpaid"}</span>
                          <span><i className="bi bi-people" /> {opp.openings} opening{opp.openings !== 1 ? "s" : ""}</span>
                          <span><i className="bi bi-calendar-event" /> {new Date(opp.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                        </div>
                        {opp.requirements?.length > 0 && (
                          <ul>
                            {opp.requirements.slice(0, 3).map((r, i) => (
                              <li key={i}>{toPlainText(r)}</li>
                            ))}
                          </ul>
                        )}
                        <div className="products-actions">
                          <Link
                            to="/internships"
                            className={`gfg-btn${isExpired ? " gfg-btn-disabled" : ""}`}
                            style={isExpired ? { pointerEvents: "none", opacity: 0.55 } : {}}
                          >
                            {isExpired ? "Closed" : "Apply Now"}
                          </Link>
                        </div>
                      </article>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="products-section products-verify">
            <div className="products-section-head products-section-head-center">
              <h2>Certificate Verification</h2>
              <p>
                Enter your certificate ID to instantly validate completion and
                learner details.
              </p>
            </div>

            <form onSubmit={this.handleVerifyCertificate} className="products-verify-form">
              <label htmlFor="certificate-id">Certificate ID</label>
              <div className="products-verify-row">
                <input
                  id="certificate-id"
                  type="text"
                  value={certificateId}
                  onChange={this.handleCertificateIdChange}
                  placeholder="e.g. LTIN2025XXXX"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="gfg-btn"
                  disabled={verifyStatus === "loading"}
                >
                  {verifyStatus === "loading" ? "Verifying..." : "Verify"}
                </button>
              </div>
              <p className="products-helper">
                Use your official certificate ID exactly as issued by Learn TEK In.
              </p>
            </form>

            {verifyMessage ? (
              <p
                className={`products-verify-message ${
                  verifiedCertificate ? "success" : "error"
                }`}
              >
                {verifyMessage}
              </p>
            ) : null}

            {verifiedCertificate ? (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  borderRadius: "16px",
                  border: "1px solid #d8eee1",
                  background: "linear-gradient(135deg, #f7fcf9, #eef8f1)",
                }}
              >
                <div className="row g-3">
                  <div className="col-md-6">
                    <strong>Candidate</strong>
                    <p style={{ marginBottom: 0 }}>{verifiedCertificate.candidateName}</p>
                  </div>
                  <div className="col-md-6">
                    <strong>Domain</strong>
                    <p style={{ marginBottom: 0 }}>{verifiedCertificate.domain}</p>
                  </div>
                  <div className="col-md-4">
                    <strong>Start Date</strong>
                    <p style={{ marginBottom: 0 }}>
                      {formatCertificateDate(verifiedCertificate.startDate)}
                    </p>
                  </div>
                  <div className="col-md-4">
                    <strong>End Date</strong>
                    <p style={{ marginBottom: 0 }}>
                      {formatCertificateDate(
                        verifiedCertificate.endDate ||
                          verifiedCertificate.dateOfCompletion
                      )}
                    </p>
                  </div>
                  <div className="col-md-4">
                    <strong>Certificate ID</strong>
                    <p style={{ marginBottom: 0 }}>{verifiedCertificate.certificateId}</p>
                  </div>
                </div>

                {verifiedCertificate.pdfDataUri ? (
                  <div style={{ marginTop: "1rem" }}>
                    <button
                      type="button"
                      className="gfg-btn"
                      onClick={() => this.downloadCertificatePdf(verifiedCertificate)}
                    >
                      Download Certificate PDF
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </section>

          {/* ── LTIN Platform Services ── */}
          <section className="products-section">
            <div className="products-section-head">
              <h2>Platform Services</h2>
              <p>
                Tools built into the Learn TEK In platform — PC building, courses, and a digital library.
              </p>
            </div>
            <div className="row g-4">
              {platformServices.map((svc) => (
                <div className="col-lg-4 col-md-6" key={svc.key}>
                  <article className="products-solution-card products-platform-card h-100">
                    <div className="products-platform-icon">
                      <i className={`bi ${svc.icon}`} aria-hidden="true" />
                    </div>
                    <h3>{svc.title}</h3>
                    <p>{svc.description}</p>
                    <ul>
                      {svc.points.map((pt) => (
                        <li key={pt}>{pt}</li>
                      ))}
                    </ul>
                    <Link to={svc.link} className="gfg-btn">
                      {svc.cta}
                    </Link>
                  </article>
                </div>
              ))}
            </div>
          </section>

          <section className="products-section">
            <div className="products-section-head">
              <h2>Products and Solutions</h2>
              <p>
                Business-ready platforms from the Learn TEK In ecosystem for
                finance and mobility needs.
              </p>
            </div>
            <div className="row g-4">
              {solutions.map((solution) => (
                <div className="col-lg-6" key={solution.title}>
                  <article className="products-solution-card h-100">
                    <h3>{solution.title}</h3>
                    <p>{solution.description}</p>
                    <ul>
                      {solution.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                    <a
                      href={solution.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gfg-btn"
                    >
                      {solution.cta}
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
}

const mapDispatchToProps = {
  verifyCertificate,
};

export default connect(null, mapDispatchToProps)(Products);
