import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { buildApiUrl } from "../../utils/api";
import "./LMSPage.css";

// ─── API endpoints ─────────────────────────────────────────────────────────────
const API_COURSES   = (params = "") => buildApiUrl(`/api/courses${params}`);
const API_ENROLL    = (id)          => buildApiUrl(`/api/courses/${id}/enroll`);

// ─── Constants ─────────────────────────────────────────────────────────────────
const CATEGORIES = ["All", "Technology", "Business", "Design", "Data Science"];
const LEVELS     = ["All", "Beginner", "Intermediate", "Advanced"];

const CATEGORY_ICONS = {
  Technology:    "bi-cpu",
  Business:      "bi-briefcase",
  Design:        "bi-palette",
  "Data Science": "bi-bar-chart-line",
  Default:       "bi-book",
};

const LEVEL_CLASS = {
  Beginner:     "lms-badge--beginner",
  Intermediate: "lms-badge--intermediate",
  Advanced:     "lms-badge--advanced",
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

// ─── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCourseCard() {
  return (
    <div className="lms-card lms-card--skeleton" aria-hidden="true">
      <div className="lms-card__thumb lms-skeleton" />
      <div className="lms-card__body">
        <div className="lms-skeleton lms-skeleton--line" style={{ width: "60%" }} />
        <div className="lms-skeleton lms-skeleton--line lms-skeleton--sm" style={{ width: "40%" }} />
        <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.6rem" }}>
          <div className="lms-skeleton lms-skeleton--chip" />
          <div className="lms-skeleton lms-skeleton--chip" />
        </div>
        <div className="lms-skeleton lms-skeleton--line lms-skeleton--sm" style={{ width: "55%", marginTop: "0.7rem" }} />
        <div className="lms-skeleton lms-skeleton--btn" style={{ marginTop: "1rem" }} />
      </div>
    </div>
  );
}

// ─── Course thumbnail ──────────────────────────────────────────────────────────
function CourseThumbnail({ course }) {
  const [imgError, setImgError] = useState(false);
  const icon = CATEGORY_ICONS[course.category] || CATEGORY_ICONS.Default;

  if (course.thumbnailUrl && !imgError) {
    return (
      <img
        className="lms-card__thumb"
        src={course.thumbnailUrl}
        alt={course.title}
        loading="lazy"
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div className={`lms-card__thumb lms-card__thumb--placeholder lms-card__thumb--${(course.category || "default").toLowerCase().replace(/\s+/g, "-")}`}>
      <i className={`bi ${icon}`} aria-hidden="true" />
    </div>
  );
}

// ─── Course card ───────────────────────────────────────────────────────────────
function CourseCard({ course, onEnroll }) {
  const isFree = !course.price || course.price === 0;

  return (
    <article className="lms-card" tabIndex={0}>
      <CourseThumbnail course={course} />

      <div className="lms-card__body">
        {/* badges row */}
        <div className="lms-card__badges">
          {course.category && (
            <span className="lms-badge lms-badge--category">{course.category}</span>
          )}
          {course.level && (
            <span className={`lms-badge ${LEVEL_CLASS[course.level] || ""}`}>
              {course.level}
            </span>
          )}
          {isFree ? (
            <span className="lms-badge lms-badge--free">Free</span>
          ) : (
            <span className="lms-badge lms-badge--paid">{formatINR(course.price)}</span>
          )}
        </div>

        {/* title + instructor */}
        <h3 className="lms-card__title">{course.title}</h3>
        {course.instructor && (
          <p className="lms-card__instructor">
            <i className="bi bi-person-circle" aria-hidden="true" /> {course.instructor}
          </p>
        )}

        {/* meta row */}
        <div className="lms-card__meta">
          {course.duration && (
            <span>
              <i className="bi bi-clock" aria-hidden="true" /> {course.duration}
            </span>
          )}
          {course.modulesCount != null && (
            <span>
              <i className="bi bi-collection-play" aria-hidden="true" /> {course.modulesCount} modules
            </span>
          )}
          {course.enrollmentCount != null && (
            <span>
              <i className="bi bi-people" aria-hidden="true" /> {course.enrollmentCount.toLocaleString("en-IN")} enrolled
            </span>
          )}
        </div>

        {/* description snippet */}
        {course.description && (
          <p className="lms-card__desc">{course.description}</p>
        )}

        <button
          className="lms-btn lms-btn--primary lms-card__cta"
          onClick={() => onEnroll(course)}
          aria-label={`Enroll in ${course.title}`}
        >
          <i className="bi bi-pencil-square" aria-hidden="true" /> Enroll Now
        </button>
      </div>
    </article>
  );
}

// ─── Enrollment modal ──────────────────────────────────────────────────────────
function EnrollModal({ course, onClose }) {
  const [form, setForm]       = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors]   = useState({});
  const [submitting, setSub]  = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiErr] = useState("");
  const firstInputRef         = useRef(null);

  useEffect(() => {
    firstInputRef.current?.focus();
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const validate = () => {
    const e = {};
    if (!form.name.trim())                       e.name  = "Name is required.";
    if (!form.email.trim())                      e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (form.phone && !/^\+?[\d\s\-()]{7,15}$/.test(form.phone)) e.phone = "Enter a valid phone number.";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
    setApiErr("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSub(true);
    setApiErr("");
    try {
      await axios.post(API_ENROLL(course._id), {
        studentName:  form.name.trim(),
        email:        form.email.trim(),
        phone:        form.phone.trim() || undefined,
      });
      setSuccess(true);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error   ||
        "Enrollment failed. Please try again.";
      setApiErr(msg);
    } finally {
      setSub(false);
    }
  };

  return (
    <div
      className="lms-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enroll-modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="lms-modal">
        <button className="lms-modal__close" onClick={onClose} aria-label="Close modal">
          <i className="bi bi-x-lg" aria-hidden="true" />
        </button>

        {success ? (
          <div className="lms-modal__success">
            <div className="lms-modal__success-icon">
              <i className="bi bi-check-circle-fill" aria-hidden="true" />
            </div>
            <h2>You&apos;re Enrolled!</h2>
            <p>
              You have successfully enrolled in{" "}
              <strong>{course.title}</strong>.
            </p>
            <p className="lms-modal__success-sub">
              Check your email for further instructions.
            </p>
            <button className="lms-btn lms-btn--primary" onClick={onClose}>
              Continue Browsing
            </button>
          </div>
        ) : (
          <>
            <div className="lms-modal__header">
              <span className="lms-modal__kicker">Enrollment</span>
              <h2 id="enroll-modal-title" className="lms-modal__title">
                {course.title}
              </h2>
              {course.instructor && (
                <p className="lms-modal__sub">
                  <i className="bi bi-person-circle" aria-hidden="true" /> {course.instructor}
                </p>
              )}
            </div>

            <form className="lms-form" onSubmit={handleSubmit} noValidate>
              {apiError && (
                <div className="lms-form__api-error" role="alert">
                  <i className="bi bi-exclamation-circle" aria-hidden="true" /> {apiError}
                </div>
              )}

              <div className="lms-form__group">
                <label className="lms-form__label" htmlFor="enroll-name">
                  Student Name <span aria-hidden="true">*</span>
                </label>
                <input
                  ref={firstInputRef}
                  id="enroll-name"
                  className={`lms-form__input${errors.name ? " lms-form__input--error" : ""}`}
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  autoComplete="name"
                />
                {errors.name && <span className="lms-form__error">{errors.name}</span>}
              </div>

              <div className="lms-form__group">
                <label className="lms-form__label" htmlFor="enroll-email">
                  Email Address <span aria-hidden="true">*</span>
                </label>
                <input
                  id="enroll-email"
                  className={`lms-form__input${errors.email ? " lms-form__input--error" : ""}`}
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                {errors.email && <span className="lms-form__error">{errors.email}</span>}
              </div>

              <div className="lms-form__group">
                <label className="lms-form__label" htmlFor="enroll-phone">
                  Phone Number <span className="lms-form__optional">(optional)</span>
                </label>
                <input
                  id="enroll-phone"
                  className={`lms-form__input${errors.phone ? " lms-form__input--error" : ""}`}
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                />
                {errors.phone && <span className="lms-form__error">{errors.phone}</span>}
              </div>

              <button
                className="lms-btn lms-btn--primary lms-btn--full"
                type="submit"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="lms-spinner" aria-hidden="true" /> Enrolling&hellip;
                  </>
                ) : (
                  <>
                    <i className="bi bi-check2-circle" aria-hidden="true" /> Confirm Enrollment
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function LMSPage() {
  const [courses, setCourses]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [search, setSearch]         = useState("");
  const [category, setCategory]     = useState("All");
  const [level, setLevel]           = useState("All");
  const [freeOnly, setFreeOnly]     = useState(false);
  const [enrollCourse, setEnroll]   = useState(null);
  const searchRef                   = useRef(null);

  // ── fetch courses ────────────────────────────────────────────────────────────
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res  = await axios.get(API_COURSES());
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.courses)
        ? res.data.courses
        : [];
      setCourses(data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Could not load courses. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  // ── derived / filtered list ──────────────────────────────────────────────────
  const filtered = courses.filter((c) => {
    const q   = search.toLowerCase();
    const matchSearch =
      !q ||
      c.title?.toLowerCase().includes(q) ||
      c.instructor?.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q) ||
      c.category?.toLowerCase().includes(q);
    const matchCat   = category === "All" || c.category === category;
    const matchLevel = level    === "All" || c.level    === level;
    const matchFree  = !freeOnly || !c.price || c.price === 0;
    return matchSearch && matchCat && matchLevel && matchFree;
  });

  const SKELETON_COUNT = 6;

  return (
    <div className="lms-page">
      <div className="container lms-shell">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <header className="lms-hero">
          <p className="lms-hero__kicker">
            <i className="bi bi-mortarboard-fill" aria-hidden="true" /> LEARN TEK IN — LMS
          </p>
          <h1 className="lms-hero__heading">Learn with Learn TEK In</h1>
          <p className="lms-hero__sub">
            Explore expert-led courses in technology, business, design, and data science.
            Grow your skills and advance your career.
          </p>

          {/* search */}
          <div className="lms-search-wrap">
            <label htmlFor="lms-search" className="visually-hidden">Search courses</label>
            <i className="bi bi-search lms-search__icon" aria-hidden="true" />
            <input
              ref={searchRef}
              id="lms-search"
              className="lms-search__input"
              type="search"
              placeholder="Search by title, instructor, or keyword…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                className="lms-search__clear"
                onClick={() => { setSearch(""); searchRef.current?.focus(); }}
                aria-label="Clear search"
              >
                <i className="bi bi-x" aria-hidden="true" />
              </button>
            )}
          </div>
        </header>

        {/* ── Filters row ──────────────────────────────────────────────────── */}
        <div className="lms-filters">
          {/* category pills */}
          <div className="lms-pills" role="group" aria-label="Filter by category">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`lms-pill${category === cat ? " lms-pill--active" : ""}`}
                onClick={() => setCategory(cat)}
                aria-pressed={category === cat}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="lms-filters__right">
            {/* level select */}
            <label className="lms-filter-label" htmlFor="lms-level-filter">
              <i className="bi bi-bar-chart" aria-hidden="true" /> Level
            </label>
            <select
              id="lms-level-filter"
              className="lms-select"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>

            {/* free only toggle */}
            <label className="lms-toggle" htmlFor="lms-free-toggle">
              <input
                id="lms-free-toggle"
                type="checkbox"
                checked={freeOnly}
                onChange={(e) => setFreeOnly(e.target.checked)}
              />
              <span className="lms-toggle__track" aria-hidden="true" />
              Free only
            </label>
          </div>
        </div>

        {/* ── Results summary ───────────────────────────────────────────────── */}
        {!loading && !error && (
          <p className="lms-results-count" aria-live="polite">
            {filtered.length === 0
              ? "No courses match your filters."
              : `Showing ${filtered.length} course${filtered.length !== 1 ? "s" : ""}`}
          </p>
        )}

        {/* ── Error state ───────────────────────────────────────────────────── */}
        {error && (
          <div className="lms-state lms-state--error" role="alert">
            <i className="bi bi-exclamation-triangle-fill" aria-hidden="true" />
            <p>{error}</p>
            <button className="lms-btn lms-btn--outline" onClick={fetchCourses}>
              <i className="bi bi-arrow-clockwise" aria-hidden="true" /> Retry
            </button>
          </div>
        )}

        {/* ── Course grid ───────────────────────────────────────────────────── */}
        <div className="lms-grid" aria-label="Course catalog">
          {loading
            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <SkeletonCourseCard key={i} />
              ))
            : filtered.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  onEnroll={setEnroll}
                />
              ))}
        </div>

        {/* ── Empty state ───────────────────────────────────────────────────── */}
        {!loading && !error && filtered.length === 0 && courses.length > 0 && (
          <div className="lms-state lms-state--empty">
            <i className="bi bi-search" aria-hidden="true" />
            <p>No courses match your current filters.</p>
            <button
              className="lms-btn lms-btn--outline"
              onClick={() => { setSearch(""); setCategory("All"); setLevel("All"); setFreeOnly(false); }}
            >
              Clear filters
            </button>
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <div className="lms-state lms-state--empty">
            <i className="bi bi-journal-x" aria-hidden="true" />
            <p>No courses available yet. Check back soon!</p>
          </div>
        )}
      </div>

      {/* ── Enrollment modal ─────────────────────────────────────────────────── */}
      {enrollCourse && (
        <EnrollModal course={enrollCourse} onClose={() => setEnroll(null)} />
      )}
    </div>
  );
}
