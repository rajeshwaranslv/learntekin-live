import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const QUICK_LINKS = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/About" },
  { label: "Careers", to: "/Careers" },
  { label: "Blogs", to: "/Blogs" },
  { label: "Contact", to: "/Contact" },
  { label: "FAQ", to: "/faq" },
];

const SERVICES = [
  { label: "Web & App Development", to: "/Services" },
  { label: "UI/UX Design", to: "/Services" },
  { label: "Business Development", to: "/Services" },
  { label: "Data Analytics & Science", to: "/Services" },
  { label: "Networking & Testing", to: "/Services" },
];

const PRODUCTS = [
  { label: "LMS Courses", to: "/Products/lms" },
  { label: "PC Factory", to: "/Products/pc-factory" },
  { label: "Digital Library", to: "/Products/library" },
  { label: "eSeva Portal", to: "/eseva" },
  {
    label: "financeFrenzy",
    href: "https://financefrenzy-biz.web.app/",
  },
  {
    label: "SriSasta",
    href: "https://play.google.com/store/apps/details?id=com.learntekin.srisasta.srisastaapp&hl=en",
  },
  {
    label: "CareGuard",
    href: "https://play.google.com/store/apps/details?id=com.learntekin.healthpredicct&hl=en",
  },
  {
    label: "mummyDaddyCars",
    href: "https://mummydaddycars.learntekin.co.in/",
  },
  {
    label: "Bee-Kart",
    href: "https://whatsapp.com/channel/0029VatfXYQG3R3k6xYOC63w",
  },
];

const SOCIALS = [
  {
    icon: "bi-instagram",
    href: "https://www.instagram.com/learntekin",
    label: "Instagram",
    hoverClass: "ft-social--instagram",
  },
  {
    icon: "bi-linkedin",
    href: "https://www.linkedin.com/groups/14199617/",
    label: "LinkedIn",
    hoverClass: "ft-social--linkedin",
  },
  {
    icon: "bi-youtube",
    href: "https://www.youtube.com/@learntekindia",
    label: "YouTube",
    hoverClass: "ft-social--youtube",
  },
  {
    icon: "bi-whatsapp",
    href: "http://wa.me/+916382422474",
    label: "WhatsApp",
    hoverClass: "ft-social--whatsapp",
  },
  {
    icon: "bi-twitter",
    href: "https://x.com/LearnTekin",
    label: "X (Twitter)",
    hoverClass: "ft-social--x",
  },
];

function FooterLink({ to, href, children }) {
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return <Link to={to}>{children}</Link>;
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  const year = new Date().getFullYear();

  return (
    <footer className="ft" role="contentinfo">
      {/* ── Wave divider ── */}
      <div className="ft-wave" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path
            d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* ── Main footer ── */}
      <div className="ft-body">
        <div className="ft-container">
          <div className="ft-grid">
            {/* Brand column */}
            <div className="ft-brand">
              <Link to="/" className="ft-logo-link">
                <img
                  src="/logo.png"
                  alt="Learn TEK In"
                  className="ft-logo"
                  loading="lazy"
                />
                <span className="ft-logo-text">Learn TEK In</span>
              </Link>
              <p className="ft-brand-desc">
                Empowering learners through technology, innovation, and
                real-world skills. From software development to business
                analytics — build your future with us.
              </p>

              {/* Social links */}
              <div className="ft-socials">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`ft-social-icon ${s.hoverClass}`}
                    aria-label={s.label}
                  >
                    <i className={`bi ${s.icon}`} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="ft-col">
              <h4 className="ft-heading">Quick Links</h4>
              <ul className="ft-list">
                {QUICK_LINKS.map((link) => (
                  <li key={link.label}>
                    <FooterLink to={link.to}>
                      <i className="bi bi-chevron-right ft-chevron" />
                      {link.label}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="ft-col">
              <h4 className="ft-heading">Our Services</h4>
              <ul className="ft-list">
                {SERVICES.map((link) => (
                  <li key={link.label}>
                    <FooterLink to={link.to}>
                      <i className="bi bi-chevron-right ft-chevron" />
                      {link.label}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products */}
            <div className="ft-col">
              <h4 className="ft-heading">Products</h4>
              <ul className="ft-list">
                {PRODUCTS.map((link) => (
                  <li key={link.label}>
                    <FooterLink to={link.to} href={link.href}>
                      <i className="bi bi-chevron-right ft-chevron" />
                      {link.label}
                      {link.href && (
                        <i className="bi bi-box-arrow-up-right ft-ext" />
                      )}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter + Contact */}
            <div className="ft-col ft-col--wide">
              <h4 className="ft-heading">Stay Connected</h4>
              <p className="ft-newsletter-desc">
                Get learning updates, internships, and product launches
                delivered to your inbox.
              </p>

              <form
                className="ft-subscribe"
                onSubmit={handleSubscribe}
                noValidate
              >
                <div className="ft-subscribe-wrap">
                  <i className="bi bi-envelope ft-subscribe-icon" />
                  <input
                    type="email"
                    className="ft-subscribe-input"
                    placeholder="you@example.com"
                    aria-label="Email address for newsletter"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="ft-subscribe-btn">
                    {subscribed ? (
                      <>
                        <i className="bi bi-check-lg" /> Subscribed
                      </>
                    ) : (
                      <>
                        Subscribe <i className="bi bi-arrow-right" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Contact details */}
              <div className="ft-contact">
                <a href="mailto:learntekin@gmail.com" className="ft-contact-item">
                  <i className="bi bi-envelope-fill" />
                  <span>learntekin@gmail.com</span>
                </a>
                <a href="tel:+914142218974" className="ft-contact-item">
                  <i className="bi bi-telephone-fill" />
                  <span>+91 4142 218974</span>
                </a>
                <div className="ft-contact-item">
                  <i className="bi bi-geo-alt-fill" />
                  <span>HQ: Charlotte, NC | Branches: Panruti, Chennai, Villupuram, Cuddalore</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="ft-bottom">
        <div className="ft-container ft-bottom-inner">
          <p className="ft-copyright">
            &copy; {year} Learn TEK In Private Limited. All rights reserved.
          </p>
          <div className="ft-bottom-links">
            <Link to="/faq">Privacy Policy</Link>
            <span className="ft-dot" aria-hidden="true" />
            <Link to="/faq">Terms of Service</Link>
            <span className="ft-dot" aria-hidden="true" />
            <a
              href="https://www.linkedin.com/company/learntekin"
              target="_blank"
              rel="noopener noreferrer"
            >
              Designed by <strong>Learn TEK In</strong>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
