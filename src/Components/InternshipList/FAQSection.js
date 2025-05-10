import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchFaqs } from "../../store/faqActions"; // Adjust path as needed
import { Spin } from "antd";  // Import Spin component from Ant Design

class FAQSection extends Component {
  componentDidMount() {
    // Dispatch the action to fetch FAQs when component mounts
    this.props.fetchFaqs();
  }

  render() {
    const { loading, faqs, error } = this.props;

    // Show loading state using Ant Design's Spin component
    if (loading) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Spin size="large" />
        </div>
      );
    }

    // Show error message if there's any
    if (error) {
      return <div>{error}</div>;
    }

    // Render the FAQ section
    return (
      <section id="faq" className="faq" style={{ marginTop: "4rem" }}>
        <div className="container-fluid" data-aos="fade-up">
          <div className="section-title">
            <h2>Frequently Asked Questions</h2>
          </div>

          <ul className="faq-list accordion" data-aos="fade-up">
            {faqs.length > 0 ? (
              faqs.map((faq, index) => (
                <li key={index}>
                  <a
                    data-bs-toggle="collapse"
                    className="collapsed"
                    data-bs-target={`#faq${index}`}
                  >
                    {faq.question}
                    <i className="bx bx-chevron-down icon-show"></i>
                    <i className="bx bx-x icon-close"></i>
                  </a>
                  <div
                    id={`faq${index}`}
                    className="collapse"
                    data-bs-parent=".faq-list"
                  >
                    <p>{faq.answer}</p>
                  </div>
                </li>
              ))
            ) : (
              <li>No FAQs available</li>
            )}
          </ul>
        </div>
      </section>
    );
  }
}

// Map state to props
const mapStateToProps = (state) => ({
  faqs: state.faqs.faqs,
  loading: state.faqs.loading,
  error: state.faqs.error
});

// Map dispatch to props
const mapDispatchToProps = {
  fetchFaqs
};

export default connect(mapStateToProps, mapDispatchToProps)(FAQSection);
