import React, { Component } from "react";

export default class Footer extends Component {
  render() {
    return (
      <div className="container-fluid footer-content-wrap">
        <div className="row g-4 footer-grid">
          <div className="col-lg-5 col-md-12 footer-newsletter mt-0">
            <h4>Join Our Newsletter</h4>
            <p className="footer-news-copy">
              Get learning updates, internships, and product announcements from
              Learn TEK In.
            </p>

            <form action="" method="post" className="footer-subscribe-form">
              <input
                type="email"
                name="email"
                className="footer-input"
                placeholder="Enter your email"
                aria-label="Email address for newsletter"
                required
              />
              <button
                type="submit"
                className="gfg-btn footer-subscribe-btn"
                aria-label="Subscribe to newsletter"
              >
                Subscribe
              </button>
            </form>
          </div>

          <div className="col-lg-3 col-md-6 footer-links mt-0">
            <h4>Our Services</h4>
            <ul>
              <li>
                <i className="bi bi-chevron-right"></i>{" "}
                <a href="/Services">Website/App Development</a>
              </li>
              <li>
                <i className="bi bi-chevron-right"></i>{" "}
                <a href="/Services">UI/UX Development & Designing</a>
              </li>
              <li>
                <i className="bi bi-chevron-right"></i>{" "}
                <a href="/Services">Business Development</a>
              </li>
              <li>
                <i className="bi bi-chevron-right"></i>{" "}
                <a href="/Services">Data Analytics | Data Science</a>
              </li>
              <li>
                <i className="bi bi-chevron-right"></i>{" "}
                <a href="/Services">Networking | Testing</a>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 footer-links mt-0">
            <h4>Our Products</h4>
            <ul>
              <li>
                <i className="bi bi-chevron-right"></i>{" "}
                <a
                  href="https://financefrenzy-biz.web.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  financeFrenzy
                </a>
              </li>
              <li>
                <i className="bi bi-chevron-right"></i>{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://play.google.com/store/apps/details?id=com.learntekin.srisasta.srisastaapp&hl=en"
                >
                  SriSasta
                </a>
              </li>
              <li>
                <i className="bi bi-chevron-right"></i>{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://play.google.com/store/apps/details?id=com.learntekin.healthpredicct&hl=en"
                >
                  CareGuard
                </a>
              </li>
              <li>
                <i className="bi bi-chevron-right"></i>{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://mummydaddycars.learntekin.co.in/"
                >
                  mummyDaddyCars
                </a>
              </li>
              <li>
                <i className="bi bi-chevron-right"></i>{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://whatsapp.com/channel/0029VatfXYQG3R3k6xYOC63w"
                >
                  Bee-Kart
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
