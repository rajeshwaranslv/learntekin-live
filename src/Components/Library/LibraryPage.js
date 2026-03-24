import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { buildApiUrl } from "../../utils/api";
import "./LibraryPage.css";

// ─── API endpoints ─────────────────────────────────────────────────────────────
const API_BOOKS      = (search = "") =>
  buildApiUrl(`/api/library/books${search ? `?search=${encodeURIComponent(search)}` : ""}`);
const API_BORROW     = (id)    => buildApiUrl(`/api/library/books/${id}/borrow`);
const API_MY_BORROWS = (email) =>
  buildApiUrl(`/api/library/my-borrows?email=${encodeURIComponent(email)}`);

// ─── Constants ─────────────────────────────────────────────────────────────────
const BORROW_DURATIONS = [
  { value: 7,  label: "7 days"  },
  { value: 14, label: "14 days" },
  { value: 21, label: "21 days" },
  { value: 30, label: "30 days" },
];

const BORROW_STATUS_CLASS = {
  active:   "lib-status--active",
  returned: "lib-status--returned",
  overdue:  "lib-status--overdue",
  pending:  "lib-status--pending",
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount || 0);

const formatDate = (dateStr) => {
  if (!dateStr) return "\u2014";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
  } catch (_) {
    return dateStr;
  }
};

// ─── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonBookCard() {
  return (
    <div className="lib-card lib-card--skeleton" aria-hidden="true">
      <div className="lib-card__cover lib-skeleton" />
      <div className="lib-card__body">
        <div className="lib-skeleton lib-skeleton--line" style={{ width: "65%" }} />
        <div className="lib-skeleton lib-skeleton--line lib-skeleton--sm" style={{ width: "42%" }} />
        <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.6rem" }}>
          <div className="lib-skeleton lib-skeleton--chip" />
          <div className="lib-skeleton lib-skeleton--chip" />
        </div>
        <div className="lib-skeleton lib-skeleton--line lib-skeleton--sm" style={{ width: "50%", marginTop: "0.7rem" }} />
        <div className="lib-skeleton lib-skeleton--btn" style={{ marginTop: "1rem" }} />
      </div>
    </div>
  );
}

// ─── Book cover ────────────────────────────────────────────────────────────────
function BookCover({ book }) {
  const [imgError, setImgError] = useState(false);

  if (book.coverUrl && !imgError) {
    return (
      <img
        className="lib-card__cover"
        src={book.coverUrl}
        alt={`Cover of ${book.title}`}
        loading="lazy"
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div className="lib-card__cover lib-card__cover--placeholder">
      <i className="bi bi-book-half" aria-hidden="true" />
      <span className="lib-card__cover-title">{book.title}</span>
    </div>
  );
}

// ─── Availability badge ────────────────────────────────────────────────────────
function AvailBadge({ book }) {
  if (book.isDigital || book.type === "digital") {
    return (
      <span className="lib-avail lib-avail--digital">
        <i className="bi bi-cloud-download" aria-hidden="true" /> Digital
      </span>
    );
  }
  const copies = book.availableCopies ?? book.copies ?? 0;
  if (copies > 0) {
    return (
      <span className="lib-avail lib-avail--available">
        <i className="bi bi-check-circle" aria-hidden="true" /> Available &middot; {copies} {copies === 1 ? "copy" : "copies"}
      </span>
    );
  }
  return (
    <span className="lib-avail lib-avail--unavailable">
      <i className="bi bi-x-circle" aria-hidden="true" /> Out of Stock
    </span>
  );
}

// ─── Book card ─────────────────────────────────────────────────────────────────
function BookCard({ book, onBorrow }) {
  const isDigital = book.isDigital || book.type === "digital";
  const copies    = book.availableCopies ?? book.copies ?? 0;
  const canBorrow = !isDigital && copies > 0;

  return (
    <article className="lib-card" tabIndex={0}>
      <BookCover book={book} />

      <div className="lib-card__body">
        {/* badges */}
        <div className="lib-card__badges">
          {book.category && (
            <span className="lib-badge lib-badge--category">{book.category}</span>
          )}
          <AvailBadge book={book} />
        </div>

        {/* title */}
        <h3 className="lib-card__title">{book.title}</h3>

        {/* author */}
        {book.author && (
          <p className="lib-card__author">
            <i className="bi bi-person-lines-fill" aria-hidden="true" /> {book.author}
          </p>
        )}

        {/* publisher / year */}
        {(book.publisher || book.year || book.publishedYear) && (
          <p className="lib-card__pub">
            <i className="bi bi-building" aria-hidden="true" />
            {[book.publisher, book.year || book.publishedYear]
              .filter(Boolean)
              .join(" \u00B7 ")}
          </p>
        )}

        {/* description snippet */}
        {book.description && (
          <p className="lib-card__desc">{book.description}</p>
        )}

        {/* actions */}
        <div className="lib-card__actions">
          {isDigital && book.digitalUrl && (
            <a
              href={book.digitalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="lib-btn lib-btn--digital"
              aria-label={`Read ${book.title} online`}
            >
              <i className="bi bi-display" aria-hidden="true" /> Read Online
            </a>
          )}
          {!isDigital && (
            <button
              className="lib-btn lib-btn--primary"
              disabled={!canBorrow}
              onClick={() => canBorrow && onBorrow(book)}
              aria-label={canBorrow ? `Borrow ${book.title}` : `${book.title} is out of stock`}
            >
              <i className="bi bi-book" aria-hidden="true" />
              {canBorrow ? "Borrow" : "Unavailable"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

// ─── Borrow modal ──────────────────────────────────────────────────────────────
function BorrowModal({ book, onClose }) {
  const [form, setForm]       = useState({ name: "", email: "", phone: "", duration: 14 });
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
    if (!form.name.trim())  e.name  = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (form.phone && !/^\+?[\d\s\-()]{7,15}$/.test(form.phone)) e.phone = "Enter a valid phone number.";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === "duration" ? Number(value) : value }));
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
      await axios.post(API_BORROW(book._id), {
        borrowerName: form.name.trim(),
        email:        form.email.trim(),
        phone:        form.phone.trim() || undefined,
        durationDays: form.duration,
      });
      setSuccess(true);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error   ||
        "Borrow request failed. Please try again.";
      setApiErr(msg);
    } finally {
      setSub(false);
    }
  };

  const dueDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + form.duration);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  })();

  return (
    <div
      className="lib-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="borrow-modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="lib-modal">
        <button className="lib-modal__close" onClick={onClose} aria-label="Close modal">
          <i className="bi bi-x-lg" aria-hidden="true" />
        </button>

        {success ? (
          <div className="lib-modal__success">
            <div className="lib-modal__success-icon">
              <i className="bi bi-check-circle-fill" aria-hidden="true" />
            </div>
            <h2>Borrow Request Confirmed!</h2>
            <p>
              <strong>{book.title}</strong> has been reserved for you.
            </p>
            <p className="lib-modal__success-sub">
              Due date: <strong>{dueDate}</strong>. Visit the library with your email confirmation to collect.
            </p>
            <button className="lib-btn lib-btn--primary" onClick={onClose}>
              Continue Browsing
            </button>
          </div>
        ) : (
          <>
            <div className="lib-modal__header">
              <span className="lib-modal__kicker">Borrow Book</span>
              <h2 id="borrow-modal-title" className="lib-modal__title">{book.title}</h2>
              {book.author && (
                <p className="lib-modal__sub">
                  <i className="bi bi-person-lines-fill" aria-hidden="true" /> {book.author}
                </p>
              )}
            </div>

            <form className="lib-form" onSubmit={handleSubmit} noValidate>
              {apiError && (
                <div className="lib-form__api-error" role="alert">
                  <i className="bi bi-exclamation-circle" aria-hidden="true" /> {apiError}
                </div>
              )}

              <div className="lib-form__group">
                <label className="lib-form__label" htmlFor="borrow-name">
                  Your Name <span aria-hidden="true">*</span>
                </label>
                <input
                  ref={firstInputRef}
                  id="borrow-name"
                  className={`lib-form__input${errors.name ? " lib-form__input--error" : ""}`}
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  autoComplete="name"
                />
                {errors.name && <span className="lib-form__error">{errors.name}</span>}
              </div>

              <div className="lib-form__group">
                <label className="lib-form__label" htmlFor="borrow-email">
                  Email Address <span aria-hidden="true">*</span>
                </label>
                <input
                  id="borrow-email"
                  className={`lib-form__input${errors.email ? " lib-form__input--error" : ""}`}
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                {errors.email && <span className="lib-form__error">{errors.email}</span>}
              </div>

              <div className="lib-form__group">
                <label className="lib-form__label" htmlFor="borrow-phone">
                  Phone Number <span className="lib-form__optional">(optional)</span>
                </label>
                <input
                  id="borrow-phone"
                  className={`lib-form__input${errors.phone ? " lib-form__input--error" : ""}`}
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                />
                {errors.phone && <span className="lib-form__error">{errors.phone}</span>}
              </div>

              <div className="lib-form__group">
                <label className="lib-form__label" htmlFor="borrow-duration">
                  Borrow Duration
                </label>
                <select
                  id="borrow-duration"
                  className="lib-form__input"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                >
                  {BORROW_DURATIONS.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
                <span className="lib-form__hint">
                  <i className="bi bi-calendar3" aria-hidden="true" /> Due by: <strong>{dueDate}</strong>
                </span>
              </div>

              <button
                className="lib-btn lib-btn--primary lib-btn--full"
                type="submit"
                disabled={submitting}
              >
                {submitting ? (
                  <><span className="lib-spinner" aria-hidden="true" /> Submitting&hellip;</>
                ) : (
                  <><i className="bi bi-check2-circle" aria-hidden="true" /> Confirm Borrow Request</>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ─── My Borrows panel ──────────────────────────────────────────────────────────
function MyBorrows() {
  const [email, setEmail]     = useState("");
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [fetched, setFetched] = useState(false);

  const fetchBorrows = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setError("");
    setFetched(false);
    try {
      const res  = await axios.get(API_MY_BORROWS(email.trim()));
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.borrows)
        ? res.data.borrows
        : [];
      setBorrows(data);
      setFetched(true);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Could not fetch borrow history. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lib-my-borrows">
      <h2 className="lib-my-borrows__heading">
        <i className="bi bi-journal-bookmark-fill" aria-hidden="true" /> My Borrow History
      </h2>
      <p className="lib-my-borrows__sub">
        Enter your registered email to view your active and past borrows.
      </p>

      <form className="lib-my-borrows__form" onSubmit={fetchBorrows} noValidate>
        <div className="lib-my-borrows__input-wrap">
          <label htmlFor="my-borrows-email" className="visually-hidden">Email address</label>
          <input
            id="my-borrows-email"
            className="lib-form__input"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            placeholder="you@example.com"
            autoComplete="email"
          />
          <button className="lib-btn lib-btn--primary" type="submit" disabled={loading}>
            {loading ? (
              <><span className="lib-spinner" aria-hidden="true" /> Loading&hellip;</>
            ) : (
              <><i className="bi bi-search" aria-hidden="true" /> Lookup</>
            )}
          </button>
        </div>
        {error && (
          <p className="lib-my-borrows__error" role="alert">
            <i className="bi bi-exclamation-circle" aria-hidden="true" /> {error}
          </p>
        )}
      </form>

      {fetched && borrows.length === 0 && (
        <div className="lib-state lib-state--empty">
          <i className="bi bi-journal-x" aria-hidden="true" />
          <p>No borrow records found for this email.</p>
        </div>
      )}

      {fetched && borrows.length > 0 && (
        <div className="lib-borrow-list">
          <p className="lib-borrow-list__count">
            {borrows.length} record{borrows.length !== 1 ? "s" : ""} found
          </p>
          {borrows.map((rec, idx) => {
            const statusKey = (rec.status || "pending").toLowerCase();
            return (
              <div key={rec._id || idx} className="lib-borrow-rec">
                <div className="lib-borrow-rec__left">
                  <i className="bi bi-book-half lib-borrow-rec__icon" aria-hidden="true" />
                </div>
                <div className="lib-borrow-rec__main">
                  <p className="lib-borrow-rec__title">
                    {rec.bookTitle || rec.book?.title || "Unknown Book"}
                  </p>
                  <div className="lib-borrow-rec__meta">
                    {rec.borrowDate && (
                      <span>
                        <i className="bi bi-calendar-check" aria-hidden="true" /> Borrowed: {formatDate(rec.borrowDate)}
                      </span>
                    )}
                    {rec.dueDate && (
                      <span>
                        <i className="bi bi-calendar-x" aria-hidden="true" /> Due: {formatDate(rec.dueDate)}
                      </span>
                    )}
                    {rec.returnDate && (
                      <span>
                        <i className="bi bi-calendar2-check" aria-hidden="true" /> Returned: {formatDate(rec.returnDate)}
                      </span>
                    )}
                    {rec.durationDays && (
                      <span>
                        <i className="bi bi-clock" aria-hidden="true" /> {rec.durationDays} days
                      </span>
                    )}
                  </div>
                  {rec.fineAmount > 0 && (
                    <p className="lib-borrow-rec__fine">
                      <i className="bi bi-exclamation-triangle-fill" aria-hidden="true" /> Fine: {formatINR(rec.fineAmount)}
                    </p>
                  )}
                </div>
                <div className="lib-borrow-rec__right">
                  <span className={`lib-status ${BORROW_STATUS_CLASS[statusKey] || "lib-status--pending"}`}>
                    {rec.status || "Pending"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function LibraryPage() {
  const [books, setBooks]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [search, setSearch]       = useState("");
  const [category, setCategory]   = useState("All");
  const [activeTab, setActiveTab] = useState("browse"); // "browse" | "myborrows"
  const [borrowBook, setBorrow]   = useState(null);
  const searchRef                 = useRef(null);
  const debounceRef               = useRef(null);

  // derive category list from loaded books
  const categories = ["All", ...Array.from(
    new Set(books.map((b) => b.category).filter(Boolean))
  ).sort()];

  // fetch books
  const fetchBooks = useCallback(async (q = "") => {
    setLoading(true);
    setError("");
    try {
      const res  = await axios.get(API_BOOKS(q));
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.books)
        ? res.data.books
        : [];
      setBooks(data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Could not load books. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  // debounced search (real-time, 380 ms)
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchBooks(val.trim());
    }, 380);
  };

  const clearSearch = () => {
    setSearch("");
    fetchBooks("");
    searchRef.current?.focus();
  };

  // client-side category filter (on top of server search)
  const filtered = books.filter((b) =>
    category === "All" || b.category === category
  );

  const SKELETON_COUNT = 6;

  return (
    <div className="lib-page">
      <div className="container lib-shell">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <header className="lib-hero">
          <p className="lib-hero__kicker">
            <i className="bi bi-bank" aria-hidden="true" /> LEARN TEK IN &mdash; DIGITAL LIBRARY
          </p>
          <h1 className="lib-hero__heading">LTIN Digital Library</h1>
          <p className="lib-hero__sub">
            Discover books, research materials, and digital resources curated for
            learners and professionals. Borrow physical books or read digital editions online.
          </p>

          {/* search */}
          <div className="lib-search-wrap">
            <label htmlFor="lib-search" className="visually-hidden">Search books</label>
            <i className="bi bi-search lib-search__icon" aria-hidden="true" />
            <input
              ref={searchRef}
              id="lib-search"
              className="lib-search__input"
              type="search"
              placeholder="Search by title, author, or keyword&hellip;"
              value={search}
              onChange={handleSearchChange}
            />
            {search && (
              <button
                className="lib-search__clear"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <i className="bi bi-x" aria-hidden="true" />
              </button>
            )}
          </div>
        </header>

        {/* ── Tab nav ───────────────────────────────────────────────────────── */}
        <div className="lib-tabs" role="tablist" aria-label="Library sections">
          <button
            role="tab"
            className={`lib-tab${activeTab === "browse" ? " lib-tab--active" : ""}`}
            aria-selected={activeTab === "browse"}
            onClick={() => setActiveTab("browse")}
          >
            <i className="bi bi-grid" aria-hidden="true" /> Browse Books
          </button>
          <button
            role="tab"
            className={`lib-tab${activeTab === "myborrows" ? " lib-tab--active" : ""}`}
            aria-selected={activeTab === "myborrows"}
            onClick={() => setActiveTab("myborrows")}
          >
            <i className="bi bi-journal-bookmark" aria-hidden="true" /> My Borrows
          </button>
        </div>

        {/* ── Browse panel ─────────────────────────────────────────────────── */}
        {activeTab === "browse" && (
          <>
            {/* category filter pills — shown once books load */}
            {!loading && !error && categories.length > 1 && (
              <div className="lib-filters" role="group" aria-label="Filter by category">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`lib-pill${category === cat ? " lib-pill--active" : ""}`}
                    onClick={() => setCategory(cat)}
                    aria-pressed={category === cat}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* results count */}
            {!loading && !error && (
              <p className="lib-results-count" aria-live="polite">
                {filtered.length === 0
                  ? "No books match your filters."
                  : `Showing ${filtered.length} book${filtered.length !== 1 ? "s" : ""}`}
              </p>
            )}

            {/* error state */}
            {error && (
              <div className="lib-state lib-state--error" role="alert">
                <i className="bi bi-exclamation-triangle-fill" aria-hidden="true" />
                <p>{error}</p>
                <button className="lib-btn lib-btn--outline" onClick={() => fetchBooks(search.trim())}>
                  <i className="bi bi-arrow-clockwise" aria-hidden="true" /> Retry
                </button>
              </div>
            )}

            {/* book grid */}
            <div className="lib-grid" aria-label="Book catalogue">
              {loading
                ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                    <SkeletonBookCard key={i} />
                  ))
                : filtered.map((book) => (
                    <BookCard
                      key={book._id}
                      book={book}
                      onBorrow={setBorrow}
                    />
                  ))}
            </div>

            {/* empty states */}
            {!loading && !error && filtered.length === 0 && books.length > 0 && (
              <div className="lib-state lib-state--empty">
                <i className="bi bi-funnel" aria-hidden="true" />
                <p>No books match the selected category.</p>
                <button className="lib-btn lib-btn--outline" onClick={() => setCategory("All")}>
                  Show all books
                </button>
              </div>
            )}

            {!loading && !error && books.length === 0 && !search && (
              <div className="lib-state lib-state--empty">
                <i className="bi bi-bookshelf" aria-hidden="true" />
                <p>The library catalogue is being updated. Check back soon!</p>
              </div>
            )}

            {!loading && !error && books.length === 0 && search && (
              <div className="lib-state lib-state--empty">
                <i className="bi bi-search" aria-hidden="true" />
                <p>No books found for &ldquo;{search}&rdquo;.</p>
                <button className="lib-btn lib-btn--outline" onClick={clearSearch}>
                  Clear search
                </button>
              </div>
            )}
          </>
        )}

        {/* ── My Borrows panel ─────────────────────────────────────────────── */}
        {activeTab === "myborrows" && <MyBorrows />}
      </div>

      {/* ── Borrow modal ─────────────────────────────────────────────────────── */}
      {borrowBook && (
        <BorrowModal book={borrowBook} onClose={() => setBorrow(null)} />
      )}
    </div>
  );
}
