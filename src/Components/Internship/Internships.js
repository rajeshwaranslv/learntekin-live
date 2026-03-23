import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./internships.css";

const API_BASE = "https://lte-node.onrender.com";

const TYPE_LABEL = { internship: "Internship", fellowship: "Fellowship" };

const Internships = () => {
  const [postings, setPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | internship | fellowship
  const [applyModal, setApplyModal] = useState(null); // the posting
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ applicantName:"", email:"", phone:"", college:"", graduation:"", coverLetter:"" });

  useEffect(() => {
    const url = filter === "all"
      ? `${API_BASE}/api/internships`
      : `${API_BASE}/api/internships?type=${filter}`;
    setLoading(true);
    axios.get(url)
      .then(r => setPostings(r.data))
      .catch(() => setPostings([]))
      .finally(() => setLoading(false));
  }, [filter]);

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await axios.post(`${API_BASE}/api/internships/${applyModal._id}/apply`, form);
      Swal.fire({
        icon: "success",
        title: "Application Submitted!",
        html: `Your Application ID: <strong>${data.applicationId}</strong><br/>We will get back to you soon.`,
        confirmButtonText: "Got it",
        confirmButtonColor: "#1a5b31",
      });
      setApplyModal(null);
      setForm({ applicantName:"", email:"", phone:"", college:"", graduation:"", coverLetter:"" });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Submission Failed", text: err.response?.data?.message || "Please try again." });
    } finally { setSubmitting(false); }
  };

  const deadlinePassed = (d) => new Date(d) < new Date();

  return (
    <section className="internship-section">
      <div className="internship-hero">
        <h1>Internships & Fellowships</h1>
        <p>Join Learn TEK In — gain real-world experience, build skills, and accelerate your career.</p>
        <div className="internship-filters">
          {["all","internship","fellowship"].map(f => (
            <button key={f} className={`filter-btn${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
              {f === "all" ? "All Opportunities" : TYPE_LABEL[f]}
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
            <p>Check back soon — new opportunities are added regularly.</p>
          </div>
        ) : (
          <div className="internship-grid">
            {postings.map(p => (
              <div key={p._id} className={`internship-card${deadlinePassed(p.deadline) ? " expired" : ""}`}>
                <div className="ic-header">
                  <span className={`ic-type-badge ${p.type}`}>{TYPE_LABEL[p.type]}</span>
                  {deadlinePassed(p.deadline) && <span className="ic-expired-badge">Closed</span>}
                </div>
                <h3 className="ic-title">{p.title}</h3>
                <p className="ic-domain"><i className="bi bi-tag" /> {p.domain}</p>
                <p className="ic-desc">{p.description}</p>
                <div className="ic-meta">
                  <span><i className="bi bi-clock" /> {p.duration}</span>
                  <span><i className="bi bi-currency-rupee" /> {p.stipend || "Unpaid"}</span>
                  <span><i className="bi bi-people" /> {p.openings} opening{p.openings !== 1 ? "s" : ""}</span>
                  <span><i className="bi bi-calendar-event" /> {new Date(p.deadline).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}</span>
                </div>
                {p.requirements?.length > 0 && (
                  <ul className="ic-requirements">
                    {p.requirements.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                )}
                <button
                  className={`ic-apply-btn${deadlinePassed(p.deadline) ? " disabled" : ""}`}
                  disabled={deadlinePassed(p.deadline)}
                  onClick={() => !deadlinePassed(p.deadline) && setApplyModal(p)}
                >
                  {deadlinePassed(p.deadline) ? "Closed" : "Apply Now"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {applyModal && (
        <div className="intern-modal-overlay" onClick={() => setApplyModal(null)}>
          <div className="intern-modal" onClick={e => e.stopPropagation()}>
            <div className="intern-modal-header">
              <div>
                <h2>Apply — {applyModal.title}</h2>
                <p>{applyModal.domain} · {applyModal.duration}</p>
              </div>
              <button className="intern-modal-close" onClick={() => setApplyModal(null)}>×</button>
            </div>
            <form onSubmit={handleApply} className="intern-apply-form">
              <div className="iaf-row">
                <div className="iaf-field">
                  <label>Full Name *</label>
                  <input type="text" value={form.applicantName} onChange={e => setForm(p=>({...p,applicantName:e.target.value}))} required placeholder="Your full name" />
                </div>
                <div className="iaf-field">
                  <label>Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm(p=>({...p,email:e.target.value}))} required placeholder="your@email.com" />
                </div>
              </div>
              <div className="iaf-row">
                <div className="iaf-field">
                  <label>Phone *</label>
                  <input type="tel" value={form.phone} onChange={e => setForm(p=>({...p,phone:e.target.value}))} required placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className="iaf-field">
                  <label>College / Institution *</label>
                  <input type="text" value={form.college} onChange={e => setForm(p=>({...p,college:e.target.value}))} required placeholder="College name" />
                </div>
              </div>
              <div className="iaf-field">
                <label>Graduation Year *</label>
                <input type="text" value={form.graduation} onChange={e => setForm(p=>({...p,graduation:e.target.value}))} required placeholder="e.g. 2025 or Pursuing 2026" />
              </div>
              <div className="iaf-field">
                <label>Cover Letter / Message</label>
                <textarea rows={4} value={form.coverLetter} onChange={e => setForm(p=>({...p,coverLetter:e.target.value}))} placeholder="Tell us why you want to join and what you bring..." />
              </div>
              <button type="submit" className="iaf-submit-btn" disabled={submitting}>
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
