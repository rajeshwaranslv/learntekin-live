import React, { useState, useEffect } from "react";
import "./YoutubePromoForm.css";

const API_BASE = (import.meta?.env?.VITE_API_BASE_URL || "").trim().replace(/\/$/, "");
const CONFIG_URL = API_BASE ? `${API_BASE}/api/youtube-promo/configs` : "/api/youtube-promo/configs";
const REQUEST_URL = API_BASE ? `${API_BASE}/api/youtube-promo/requests` : "/api/youtube-promo/requests";

const PLATFORM_ICONS = {
  YouTube: "bi-youtube",
  Instagram: "bi-instagram",
  LinkedIn: "bi-linkedin",
  "Twitter / X": "bi-twitter",
  Facebook: "bi-facebook",
  Podcast: "bi-mic-fill",
};

// Shown when backend has no configs yet
const DEFAULT_CONFIGS = [
  { _id: "yt", platformType: "YouTube",    title: "YouTube Promotion",    basePrice: 99, minCount: 1, maxCount: 100, pricingTiers: [] },
  { _id: "ig", platformType: "Instagram",  title: "Instagram Promotion",  basePrice: 99, minCount: 1, maxCount: 100, pricingTiers: [] },
  { _id: "li", platformType: "LinkedIn",   title: "LinkedIn Promotion",   basePrice: 99, minCount: 1, maxCount: 100, pricingTiers: [] },
  { _id: "fb", platformType: "Facebook",   title: "Facebook Promotion",   basePrice: 99, minCount: 1, maxCount: 100, pricingTiers: [] },
  { _id: "tw", platformType: "Twitter / X",title: "Twitter/X Promotion",  basePrice: 99, minCount: 1, maxCount: 100, pricingTiers: [] },
];

export default function YoutubePromoForm() {
  const [configs, setConfigs] = useState([]);
  const [loadingConfigs, setLoadingConfigs] = useState(true);

  const [form, setForm] = useState({
    title: "",
    targetType: "company",
    platformType: "",
    count: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(CONFIG_URL)
      .then((r) => r.json())
      .then((data) => setConfigs(Array.isArray(data) && data.length ? data : DEFAULT_CONFIGS))
      .catch(() => setConfigs(DEFAULT_CONFIGS))
      .finally(() => setLoadingConfigs(false));
  }, []);

  const selectedConfig = configs.find((c) => c.platformType === form.platformType);
  const count = parseInt(form.count) || 0;
  const basePrice = selectedConfig?.basePrice ?? 99;
  const minCount = selectedConfig?.minCount ?? 1;
  const maxCount = selectedConfig?.maxCount ?? 100;
  // Volume discount tier takes priority if count matches exactly
  const matchingTier = selectedConfig?.pricingTiers?.find((t) => t.count === count);
  const calculatedAmount = count >= minCount ? (matchingTier ? matchingTier.amount : basePrice * count) : null;

  // Keep urls array in sync with count
  const urls = form.urls || [];
  const syncedUrls = Array.from({ length: count || 0 }, (_, i) => urls[i] || "");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "platformType" ? { count: "", urls: [] } : {}),
      ...(name === "count" ? { urls: [] } : {}),
    }));
  };

  const handleUrlChange = (index, value) => {
    const next = [...syncedUrls];
    next[index] = value;
    setForm((prev) => ({ ...prev, urls: next }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.platformType || count < minCount) {
      setError(`Please select a platform and enter a count of at least ${minCount}.`);
      return;
    }
    if (!calculatedAmount) {
      setError("Unable to calculate amount. Please check your inputs.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(REQUEST_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, count: Number(form.count), amount: calculatedAmount, urls: syncedUrls }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Submission failed");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="yt-promo-success">
        <div className="yt-promo-success-icon">
          <i className="bi bi-check-circle-fill" />
        </div>
        <h2>Request Submitted!</h2>
        <p>We'll review your promotional request and get back to you shortly.</p>
        <button className="yt-promo-btn" onClick={() => { setSubmitted(false); setForm({ title: "", targetType: "company", platformType: "", count: "", contactName: "", contactEmail: "", contactPhone: "", notes: "" }); }}>
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <section className="yt-promo-section">
      <div className="yt-promo-shell">
        {/* Header */}
        <div className="yt-promo-header">
          <span className="yt-promo-kicker">PROMOTIONAL SERVICES</span>
          <h1>Promote Your Brand</h1>
          <p>Reach thousands of learners and professionals through our content channels. Choose your platform, pick a package, and we'll take care of the rest.</p>
        </div>

        <div className="yt-promo-layout">
          {/* Form */}
          <form className="yt-promo-form" onSubmit={handleSubmit} noValidate>
            {/* Platform selection */}
            <div className="yt-promo-section-label">1. Choose Platform</div>
            {loadingConfigs ? (
              <div className="yt-promo-platform-grid yt-promo-loading">Loading platforms…</div>
            ) : (
              <div className="yt-promo-platform-grid">
                {configs.map((c) => (
                  <button
                    key={c._id}
                    type="button"
                    className={`yt-promo-platform-card${form.platformType === c.platformType ? " active" : ""}`}
                    onClick={() => setForm((p) => ({ ...p, platformType: c.platformType, count: "" }))}
                  >
                    <i className={`bi ${PLATFORM_ICONS[c.platformType] || "bi-broadcast"}`} />
                    <span>{c.platformType}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Count input + live price */}
            {selectedConfig && (
              <>
                <div className="yt-promo-section-label">2. How Many?</div>
                <div className="yt-promo-count-row">
                  <div className="yt-promo-count-wrap">
                    <button type="button" className="yt-promo-count-btn" onClick={() => setForm((p) => ({ ...p, count: String(Math.max(minCount, (parseInt(p.count) || 1) - 1) ) }))}>−</button>
                    <input
                      name="count"
                      type="number"
                      min={minCount}
                      max={maxCount}
                      value={form.count}
                      onChange={handleChange}
                      className="yt-promo-count-input"
                      placeholder="1"
                    />
                    <button type="button" className="yt-promo-count-btn" onClick={() => setForm((p) => ({ ...p, count: String(Math.min(maxCount, (parseInt(p.count) || 0) + 1)) }))}>+</button>
                  </div>

                  <div className="yt-promo-price-display">
                    <span className="yt-promo-price-formula">
                      {count >= minCount
                        ? matchingTier
                          ? `Special tier: ${matchingTier.label}`
                          : `₹${basePrice} × ${count}`
                        : `Starts at ₹${basePrice} / unit`}
                    </span>
                    {calculatedAmount !== null && (
                      <span className="yt-promo-price-total">₹{calculatedAmount.toLocaleString("en-IN")}</span>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Step 3 — only shown after platform + valid count chosen */}
            {calculatedAmount !== null && (
              <>
                <div className="yt-promo-section-label">3. Your Details</div>

                <div className="yt-promo-field-row">
                  <div className="yt-promo-field">
                    <label>Promotion Title <span>*</span></label>
                    <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Brand awareness campaign" required />
                  </div>
                  <div className="yt-promo-field">
                    <label>You are promoting as <span>*</span></label>
                    <div className="yt-promo-toggle">
                      <button type="button" className={form.targetType === "company" ? "active" : ""} onClick={() => setForm((p) => ({ ...p, targetType: "company" }))}>
                        <i className="bi bi-building" /> Company
                      </button>
                      <button type="button" className={form.targetType === "individual" ? "active" : ""} onClick={() => setForm((p) => ({ ...p, targetType: "individual" }))}>
                        <i className="bi bi-person-fill" /> Individual
                      </button>
                    </div>
                  </div>
                </div>

                <div className="yt-promo-field-row">
                  <div className="yt-promo-field">
                    <label>Contact Name <span>*</span></label>
                    <input name="contactName" value={form.contactName} onChange={handleChange} placeholder="Your full name" required />
                  </div>
                  <div className="yt-promo-field">
                    <label>Email <span>*</span></label>
                    <input name="contactEmail" type="email" value={form.contactEmail} onChange={handleChange} placeholder="you@example.com" required />
                  </div>
                </div>

                <div className="yt-promo-field-row">
                  <div className="yt-promo-field">
                    <label>Phone (optional)</label>
                    <input name="contactPhone" value={form.contactPhone} onChange={handleChange} placeholder="+91 98765 43210" />
                  </div>
                  <div className="yt-promo-field">
                    <label>Notes (optional)</label>
                    <input name="notes" value={form.notes} onChange={handleChange} placeholder="Any specific requirements?" />
                  </div>
                </div>

                {/* Dynamic URL inputs — one per count */}
                <div className="yt-promo-section-label" style={{ marginTop: "0.4rem" }}>
                  Content URLs <span style={{ fontWeight: 400, fontSize: "0.7rem", color: "#7ba892", textTransform: "none", letterSpacing: 0 }}>(paste the link for each video/post)</span>
                </div>
                <div className="yt-promo-url-list">
                  {syncedUrls.map((url, i) => (
                    <div key={i} className="yt-promo-url-row">
                      <span className="yt-promo-url-label">
                        <i className={`bi ${PLATFORM_ICONS[form.platformType] || "bi-broadcast"}`} />
                        {form.platformType} URL {i + 1}
                      </span>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => handleUrlChange(i, e.target.value)}
                        placeholder={`Paste your ${form.platformType} link here…`}
                        className="yt-promo-url-input"
                      />
                    </div>
                  ))}
                </div>

                {error && <div className="yt-promo-error"><i className="bi bi-exclamation-circle" /> {error}</div>}

                <div className="yt-promo-summary">
                  <span>
                    <b>{form.platformType}</b> · {count} unit{count !== 1 ? "s" : ""} · {form.targetType}
                  </span>
                  <span className="yt-promo-summary-amount">₹{calculatedAmount.toLocaleString("en-IN")}</span>
                </div>

                <button
                  type="submit"
                  className="yt-promo-submit-btn"
                  disabled={submitting}
                >
                  {submitting ? "Submitting…" : "Submit Request"}
                  {!submitting && <i className="bi bi-arrow-right" />}
                </button>
              </>
            )}
          </form>

          {/* Sidebar info */}
          <aside className="yt-promo-aside">
            <div className="yt-promo-aside-card">
              <i className="bi bi-lightning-charge-fill yt-promo-aside-icon" />
              <h3>Why Advertise With Us?</h3>
              <ul>
                <li><i className="bi bi-check2" /> Direct reach to tech learners & professionals</li>
                <li><i className="bi bi-check2" /> Dedicated campaign content creation</li>
                <li><i className="bi bi-check2" /> Transparent pricing, no hidden fees</li>
                <li><i className="bi bi-check2" /> Multiple platform options</li>
                <li><i className="bi bi-check2" /> Quick turnaround — 3–5 business days</li>
              </ul>
            </div>

            <div className="yt-promo-aside-card yt-promo-aside-contact">
              <h3>Have Questions?</h3>
              <p>Reach out to us directly and we'll build a custom package for you.</p>
              <a href="/Contact" className="yt-promo-contact-link">
                <i className="bi bi-chat-dots-fill" /> Contact Us
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
