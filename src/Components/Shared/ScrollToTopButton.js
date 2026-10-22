import React, { useEffect, useRef, useState } from "react";
import "./ScrollToTopButton.css";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const scrolling = useRef(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setVisible(window.scrollY > 300);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTop = () => {
    if (scrolling.current) return;
    scrolling.current = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.setTimeout(() => {
      scrolling.current = false;
    }, 700);
  };

  return (
    <button
      type="button"
      className={`ltin-scroll-top${visible ? " show" : ""}`}
      onClick={goTop}
      aria-label="Scroll to top"
    >
      <i className="bi bi-arrow-up-short" />
    </button>
  );
}
