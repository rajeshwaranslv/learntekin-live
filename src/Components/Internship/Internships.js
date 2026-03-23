import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./internships.css";
import { buildApiUrl } from "../../utils/api";
import {
  getInternshipPostingId,
  normalizeInternshipPostings,
} from "../../utils/internshipPostings";
import { toDisplayLabel, toPlainText } from "../../utils/text";
import { sendWorkflowEmail } from "../../utils/workflowEmail";
import {
  createAdminWorkflowNotification,
  createLiveWorkflowNotification,
} from "../../utils/workflowNotifications";

const INTERNSHIPS_URL = buildApiUrl("/api/internships");

const TYPE_LABEL = { internship: "Internship", fellowship: "Fellowship" };

const EMPTY_FORM = {
  applicantName: "",
  email: "",
  phone: "",
  college: "",
  graduation: "",
  coverLetter: "",
};

const Internships = () => {
  const [postings, setPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [applyModal, setApplyModal] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    setLoading(true);
    const params = filter === "all" ? undefined : { type: filter };

    axios
      .get(INTERNSHIPS_URL, { params })
      .then((response) =>
        setPostings(normalizeInternshipPostings(response.data))
      )
      .catch(() => setPostings([]))
      .finally(() => setLoading(false));
  }, [filter]);

  const handleApply = async (event) => {
    event.preventDefault();
    const postingId = getInternshipPostingId(applyModal);

    if (!postingId) {
      Swal.fire({
        icon: "error",
        title: "Posting unavailable",
        text: "This internship posting could not be identified. Please refresh the page and try again.",
      });
      return;
    }

    setSubmitting(true);

    try {
      const { data } = await axios.post(
        buildApiUrl(`/api/internships/${postingId}/apply`),
        form
      );

      await Promise.allSettled([
        createAdminWorkflowNotification({
          type: "internship_applied",
          title: "New Internship Application",
          message: `${form.applicantName} applied for "${applyModal.title}".`,
          entityId: data.applicationId,
          entityName: form.applicantName,
          metadata: {
            postingId,
            postingTitle: applyModal.title,
            postingType: applyModal.type,
          },
        }),
        createLiveWorkflowNotification({
          type: "internship_application_submitted",
          title: "Application Submitted",
          message: `Your application for "${applyModal.title}" has been received successfully.`,
          recipientEmail: form.email,
          entityId: data.applicationId,
          entityName: applyModal.title,
        }),
        sendWorkflowEmail({
          toEmail: form.email,
          toName: form.applicantName,
          subject: `Application received - ${applyModal.title}`,
          message: `We have received your application for "${applyModal.title}". Keep your application ID handy for future follow-ups.`,
          actionLabel: "View Opportunities",
          actionUrl: `${window.location.origin}/internships`,
          templateParams: {
            application_id: data.applicationId,
            posting_title: applyModal.title,
            posting_type: toDisplayLabel(applyModal.type),
          },
        }),
      ]);

      Swal.fire({
        icon: "success",
        title: "Application Submitted!",
        html: `Your Application ID: <strong>${data.applicationId}</strong><br/>We will get back to you soon.`,
        confirmButtonText: "Got it",
        confirmButtonColor: "#1a5b31",
      });

      setApplyModal(null);
      setForm(EMPTY_FORM);
    } catch (error) {
      const message =
        error.response?.status === 404
          ? "This posting is no longer available. Please refresh and choose an active opportunity."
          : error.response?.data?.message || "Please try again.";

      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const deadlinePassed = (deadline) => new Date(deadline) < new Date();

  return (
    <section className="internship-section">
      <div className="internship-hero">
        <h1>Internships & Fellowships</h1>
        <p>
          Join Learn TEK In - gain real-world experience, build skills, and
          accelerate your career.
        </p>
        <div className="internship-filters">
          {["all", "internship", "fellowship"].map((value) => (
            <button
              key={value}
              className={`filter-btn${filter === value ? " active" : ""}`}
              onClick={() => setFilter(value)}
            >
              {value === "all" ? "All Opportunities" : TYPE_LABEL[value]}
            </button>
          ))}
        </div>
      </div>

      <div className="internship-container">
        {loading ? (
          <div className="internship-loading">
            <div className="internship-spinner" />
            <p>Loading opportunities...</p>
          </div>
        ) : postings.length === 0 ? (
          <div className="internship-empty">
            <i className="bi bi-briefcase" />
            <h3>No openings right now</h3>
            <p>Check back soon - new opportunities are added regularly.</p>
          </div>
        ) : (
          <div className="internship-grid">
            {postings.map((posting) => (
              <div
                key={
                  getInternshipPostingId(posting) ||
                  `${posting.title}-${posting.deadline}`
                }
                className={`internship-card${
                  deadlinePassed(posting.deadline) ? " expired" : ""
                }`}
              >
                <div className="ic-header">
                  <span className={`ic-type-badge ${posting.type}`}>
                    {TYPE_LABEL[posting.type] || toDisplayLabel(posting.type)}
                  </span>
                  {deadlinePassed(posting.deadline) && (
                    <span className="ic-expired-badge">Closed</span>
                  )}
                </div>
                <h3 className="ic-title">{posting.title}</h3>
                <p className="ic-domain">
                  <i className="bi bi-tag" /> {posting.domain}
                </p>
                <p className="ic-desc">{toPlainText(posting.description)}</p>
                <div className="ic-meta">
                  <span>
                    <i className="bi bi-clock" /> {posting.duration}
                  </span>
                  <span>
                    <i className="bi bi-currency-rupee" />{" "}
                    {posting.stipend || "Unpaid"}
                  </span>
                  <span>
                    <i className="bi bi-people" /> {posting.openings} opening
                    {posting.openings !== 1 ? "s" : ""}
                  </span>
                  <span>
                    <i className="bi bi-calendar-event" />{" "}
                    {new Date(posting.deadline).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {posting.requirements?.length > 0 && (
                  <ul className="ic-requirements">
                    {posting.requirements.map((requirement, index) => (
                      <li key={index}>{toPlainText(requirement)}</li>
                    ))}
                  </ul>
                )}
                <button
                  className={`ic-apply-btn${
                    deadlinePassed(posting.deadline) ? " disabled" : ""
                  }`}
                  disabled={deadlinePassed(posting.deadline)}
                  onClick={() =>
                    !deadlinePassed(posting.deadline) && setApplyModal(posting)
                  }
                >
                  {deadlinePassed(posting.deadline) ? "Closed" : "Apply Now"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {applyModal && (
        <div
          className="intern-modal-overlay"
          onClick={() => setApplyModal(null)}
        >
          <div className="intern-modal" onClick={(event) => event.stopPropagation()}>
            <div className="intern-modal-header">
              <div>
                <h2>Apply - {applyModal.title}</h2>
                <p>
                  {applyModal.domain} - {applyModal.duration}
                </p>
              </div>
              <button
                className="intern-modal-close"
                onClick={() => setApplyModal(null)}
                type="button"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleApply} className="intern-apply-form">
              <div className="iaf-row">
                <div className="iaf-field">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={form.applicantName}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        applicantName: event.target.value,
                      }))
                    }
                    required
                    placeholder="Your full name"
                  />
                </div>
                <div className="iaf-field">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        email: event.target.value,
                      }))
                    }
                    required
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div className="iaf-row">
                <div className="iaf-field">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        phone: event.target.value,
                      }))
                    }
                    required
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div className="iaf-field">
                  <label>College / Institution *</label>
                  <input
                    type="text"
                    value={form.college}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        college: event.target.value,
                      }))
                    }
                    required
                    placeholder="College name"
                  />
                </div>
              </div>
              <div className="iaf-field">
                <label>Graduation Year *</label>
                <input
                  type="text"
                  value={form.graduation}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      graduation: event.target.value,
                    }))
                  }
                  required
                  placeholder="e.g. 2025 or Pursuing 2026"
                />
              </div>
              <div className="iaf-field">
                <label>Cover Letter / Message</label>
                <textarea
                  rows={4}
                  value={form.coverLetter}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      coverLetter: event.target.value,
                    }))
                  }
                  placeholder="Tell us why you want to join and what you bring..."
                />
              </div>
              <button
                type="submit"
                className="iaf-submit-btn"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Internships;
