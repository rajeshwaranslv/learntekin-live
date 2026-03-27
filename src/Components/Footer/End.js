import React, { Component } from "react";

export default class End extends Component {
  render() {
    return (
      <div className="container-fluid d-md-flex py-4 footer-end-wrap">
        <div className="me-md-auto text-center text-md-start footer-legal">
          <div className="copyright">
            ©2023 Learn TEK In, Headquarters: Charlotte, NC
            <br />
            Branches: Panruti | Villupuram | Cuddalore | Chennai
          </div>
          <div className="credits">
            Designed by{" "}
            <a
              className="contact-link"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.linkedin.com/company/learntekin"
            >
              <strong>Learn TEK In</strong>
            </a>
          </div>
        </div>
        <div className="social-links footer-social text-center text-md-end pt-3 pt-md-0">
          <a
            href="https://www.instagram.com/learntekin"
            target="_blank"
            rel="noopener noreferrer"
            className="instagram"
            aria-label="Instagram"
          >
            <i className="bi bi-instagram"></i>
          </a>

          <a
            href="https://www.linkedin.com/groups/14199617/"
            target="_blank"
            rel="noopener noreferrer"
            className="linkedin"
            aria-label="LinkedIn"
          >
            <i className="bi bi-linkedin"></i>
          </a>

          <a
            href="https://www.youtube.com/@learntekindia"
            target="_blank"
            rel="noopener noreferrer"
            className="youtube"
            aria-label="YouTube"
          >
            <i className="bi bi-youtube"></i>
          </a>

          <a
            href="http://wa.me/+916382422474"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp"
            aria-label="WhatsApp"
          >
            <i className="bi bi-whatsapp"></i>
          </a>

          <a
            href="https://x.com/LearnTekin"
            target="_blank"
            rel="noopener noreferrer"
            className="twitter"
            aria-label="X (Twitter)"
          >
            <i className="bi bi-twitter"></i>
          </a>
        </div>
      </div>
    );
  }
}
