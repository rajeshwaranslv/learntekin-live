import React, { memo, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { careersApi, formatDate } from "./careersApi";
import useDebouncedValue from "./useDebouncedValue";
import ApplicationModal from "./ApplicationModal";
import "./careers.css";

const defaults = { search: "", department: "", location: "", experience: "", employmentType: "", sort: "latest", page: 1, limit: 9 };

const JobCard = memo(function JobCard({ job, onApply }) {
  return (
    <article className={`career-job-card${job.featured ? " featured" : ""}`}>
      <div className="career-card-top">
        <div>
          <p>{job.department}</p>
          <Link to={`/careers/${job.slug}`}>{job.title}</Link>
        </div>
        {job.featured && <span>Featured</span>}
      </div>
      {job.offline && <div className="career-offline-badge">Preview only</div>}
      <p className="career-description">{job.description}</p>
      <div className="career-meta-grid">
        <span><i className="bi bi-briefcase" /> {job.employmentType}</span>
        <span><i className="bi bi-geo-alt" /> {job.location}</span>
        <span><i className="bi bi-bar-chart" /> {job.experience}</span>
        <span><i className="bi bi-people" /> {job.openings} opening{job.openings === 1 ? "" : "s"}</span>
        {job.salary && <span><i className="bi bi-cash-stack" /> {job.salary}</span>}
        <span><i className="bi bi-calendar3" /> Posted {formatDate(job.createdAt)}</span>
      </div>
      <div className="career-skills">{(job.skills || []).slice(0, 6).map((skill) => <span key={skill}>{skill}</span>)}</div>
      <div className="career-card-actions">
        <button type="button" onClick={() => onApply(job)} disabled={job.offline}>{job.offline ? "Preview only" : "Apply"}</button>
        <Link to={`/careers/${job.slug}`}>View details</Link>
      </div>
    </article>
  );
});

export default function CareersPage() {
  const [filters, setFilters] = useState(defaults);
  const [data, setData] = useState({ jobs: [], facets: {}, pagination: { page: 1, pages: 1, total: 0 } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applyJob, setApplyJob] = useState(null);
  const [offline, setOffline] = useState(false);
  const debouncedSearch = useDebouncedValue(filters.search);

  const query = useMemo(() => ({ ...filters, search: debouncedSearch }), [filters, debouncedSearch]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    careersApi.listJobs(query)
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setOffline(result.offline === true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Unable to load open roles. Please try again.");
          setOffline(false);
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [query]);

  const update = (key, value) => setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));

  return (
    <main className="careers-page">
      <Helmet>
        <title>Careers | Learn TEK In</title>
        <meta name="description" content="Explore open roles at Learn TEK In. Search jobs, filter roles, view details, and apply online." />
      </Helmet>

      <section className="careers-hero">
        <div className="careers-hero-copy">
          <p className="careers-kicker">Careers at Learn TEK In</p>
          <h1>Build meaningful technology products, learning systems, and digital experiences.</h1>
          <p>Explore roles across engineering, design, content, operations, and product delivery. Work with a team that values curiosity, ownership, and practical craft.</p>
        </div>
        <div className="careers-hero-stats" aria-label="Career highlights">
          <span><strong>{data.pagination?.total || 0}</strong>Open roles</span>
          <span><strong>Remote</strong>Friendly</span>
          <span><strong>Growth</strong>Mentorship</span>
        </div>
      </section>

      <section className="careers-toolbar" aria-label="Search and filter jobs">
        <label className="careers-search">
          <i className="bi bi-search" />
          <input value={filters.search} onChange={(event) => update("search", event.target.value)} placeholder="Search jobs, skills, departments..." />
        </label>
        {[
          ["department", "Department", "departments"],
          ["location", "Location", "locations"],
          ["experience", "Experience", "experiences"],
          ["employmentType", "Employment Type", "employmentTypes"],
        ].map(([key, label, facetKey]) => (
          <select key={key} value={filters[key]} onChange={(event) => update(key, event.target.value)} aria-label={label}>
            <option value="">{label}</option>
            {(data.facets?.[facetKey] || []).map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        ))}
        <select value={filters.sort} onChange={(event) => update("sort", event.target.value)} aria-label="Sort jobs">
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="az">A-Z</option>
        </select>
        <button type="button" onClick={() => setFilters(defaults)}>Reset</button>
      </section>

      {offline && !error && (
        <div className="careers-warning" role="status">
          Showing sample job listings because live roles could not be loaded. Your application experience is still available for preview.
        </div>
      )}
      {error && <div className="careers-error" role="alert">{error}</div>}

      {loading ? (
        <div className="careers-grid">{Array.from({ length: 6 }).map((_, index) => <div className="career-skeleton" key={index} />)}</div>
      ) : data.jobs?.length ? (
        <div className="careers-grid">
          {data.jobs.map((job) => <JobCard key={job._id} job={job} onApply={setApplyJob} />)}
        </div>
      ) : (
        <section className="careers-empty">
          <i className="bi bi-search" />
          <h2>No roles matched your search</h2>
          <p>Try a different department, location, or keyword.</p>
        </section>
      )}

      <nav className="careers-pagination" aria-label="Jobs pagination">
        <button type="button" disabled={(data.pagination?.page || 1) <= 1} onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}>Previous</button>
        <span>Page {data.pagination?.page || 1} of {data.pagination?.pages || 1}</span>
        <button type="button" disabled={(data.pagination?.page || 1) >= (data.pagination?.pages || 1)} onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}>Next</button>
      </nav>

      <ApplicationModal job={applyJob} open={Boolean(applyJob)} onClose={() => setApplyJob(null)} />
    </main>
  );
}
