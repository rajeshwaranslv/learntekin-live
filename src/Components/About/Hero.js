import React, { useEffect } from "react";
import "./Hero.css";

function Hero() {
  useEffect(() => {
    document.title = "Welcome to LearnTEK In";
  }, []);

  return (
    <section id="hero" className="d-flex align-items-center">
      <div className="container-fluid hero-content" data-aos="zoom-out" data-aos-delay="100">
        <div className="row">
          <div className="col-xl-12 text-center">
            <h4 className="hero-welcome-text">Welcome, Learn TEK In!</h4>
            <h1 className="hero-title">
              <span className="hero-title-line">
                We <span className="hero-emphasis">Construct</span> your dream path
              </span>
              <span className="hero-title-line">
                to the <span className="hero-emphasis">Digital world!</span>
              </span>
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
