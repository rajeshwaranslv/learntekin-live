import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { fetchFaqs } from "../../store/faqActions";
import "./FAQSection.css";

const extractTextFromRaw = (raw = {}) => {
  const values = Object.values(raw).filter(
    (value) => typeof value === "string" && value.trim() !== ""
  );
  return values.length > 0 ? values.join(" | ") : "";
};

const resolveQuestion = (faq, index) =>
  faq.question?.trim() ||
  faq.raw?.question ||
  faq.raw?.Question ||
  faq.raw?.title ||
  faq.raw?.Title ||
  `FAQ ${index + 1}`;

const resolveAnswer = (faq) =>
  faq.answer?.trim() ||
  faq.raw?.answer ||
  faq.raw?.Answer ||
  faq.raw?.description ||
  faq.raw?.Description ||
  extractTextFromRaw(faq.raw) ||
  "Answer not available.";

function FAQSection({ fetchFaqs: loadFaqs, loading, faqs, error }) {
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    loadFaqs();
  }, [loadFaqs]);

  const displayFaqs = useMemo(
    () => (Array.isArray(faqs) ? faqs : []),
    [faqs]
  );

  useEffect(() => {
    if (displayFaqs.length === 0) {
      setOpenIndex(-1);
      return;
    }

    if (openIndex < 0 || openIndex > displayFaqs.length - 1) {
      setOpenIndex(0);
    }
  }, [displayFaqs, openIndex]);

  const toggleFaq = (index) => {
    setOpenIndex((currentOpenIndex) =>
      currentOpenIndex === index ? -1 : index
    );
  };

  return (
    <section id="faq" className="faq faq-restored">
      <div className="container-fluid" data-aos="fade-up">
        <div className="section-title">
          <h2>Frequently Asked Questions</h2>
        </div>

        {error ? <div className="faq-alert">{error}</div> : null}

        {loading ? (
          <div className="faq-loading">Loading FAQs...</div>
        ) : (
          <ul className="faq-list accordion" data-aos="fade-up">
            {displayFaqs.length > 0 ? (
              displayFaqs.map((faq, index) => {
                const isOpen = openIndex === index;

                return (
                  <li key={faq.id || index} className={isOpen ? "faq-active" : ""}>
                    <button
                      type="button"
                      className={`faq-toggle ${isOpen ? "" : "collapsed"}`.trim()}
                      onClick={() => toggleFaq(index)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-item-${index}`}
                    >
                      <span>{resolveQuestion(faq, index)}</span>
                      <i
                        className={`bx ${
                          isOpen ? "bx-chevron-up" : "bx-chevron-down"
                        } faq-icon`}
                        aria-hidden="true"
                      ></i>
                    </button>

                    <div
                      id={`faq-item-${index}`}
                      className={`faq-answer ${isOpen ? "open" : ""}`.trim()}
                    >
                      <p>{resolveAnswer(faq)}</p>
                    </div>
                  </li>
                );
              })
            ) : (
              <li className="faq-empty">No FAQs available.</li>
            )}
          </ul>
        )}
      </div>
    </section>
  );
}

const mapStateToProps = (state) => ({
  faqs: state.faqs.faqs,
  loading: state.faqs.loading,
  error: state.faqs.error,
});

const mapDispatchToProps = {
  fetchFaqs,
};

export default connect(mapStateToProps, mapDispatchToProps)(FAQSection);
