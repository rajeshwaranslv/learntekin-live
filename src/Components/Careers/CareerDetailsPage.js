import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";
import { careersApi, formatDate } from "./careersApi";
import ApplicationModal from "./ApplicationModal";
import "./careers.css";

const ListSection = ({ title, items }) => items?.length ? (
  <section className="career-detail-section">
    <h2>{title}</h2>
    <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
  </section>
) : null;

export default function CareerDetailsPage() {
  const { slug } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applyOpen, setApplyOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    careersApi.getJob(slug)
      .then((result) => { if (!cancelled) setJob(result); })
      .catch((requestError) => {
        if (!cancelled) setError(requestError.response?.data?.message || "Live job details are unavailable. Please try again later.");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) return <main className="careers-page"><div className="career-detail-loading">Loading role...</div></main>;
  if (error) return <main className="careers-page"><section className="careers-empty" role="alert"><h1>Role details unavailable</h1><p>{error}</p><Link to="/Careers">Back to careers</Link></section></main>;
  if (!job) return <main className="careers-page"><section className="careers-empty"><h1>Role not found</h1><Link to="/Careers">Back to careers</Link></section></main>;

  return (
    <main className="careers-page">
      <Helmet>
        <title>{job.title} | Careers</title>
        <meta name="description" content={job.description} />
      </Helmet>
      <section className="career-detail-hero">
        <Link to="/Careers" className="career-back-link"><i className="bi bi-arrow-left" /> All jobs</Link>
        <div className="career-detail-hero__content">
          <p className="careers-kicker">{job.department}</p>
          <h1>{job.title}</h1>
          <p>{job.description}</p>
          <div className="career-meta-grid">
            <span><i className="bi bi-geo-alt" /> {job.location}</span>
            <span><i className="bi bi-briefcase" /> {job.employmentType}</span>
            <span><i className="bi bi-bar-chart" /> {job.experience}</span>
            <span><i className="bi bi-calendar3" /> Posted {formatDate(job.createdAt)}</span>
          </div>
          <div className="career-detail-hero__actions">
            <button type="button" onClick={() => setApplyOpen(true)} disabled={job.offline}>{job.offline ? "Preview only" : "Apply Now"}</button>
          </div>
          {job.offline && <div className="career-offline-notice">This is a preview-only role. Live applications are unavailable for demo content.</div>}
        </div>
      </section>

      <section className="career-detail-section">
        <h2>Company Overview</h2>
        <p>{job.companyOverview}</p>
      </section>
      <ListSection title="Responsibilities" items={job.responsibilities} />
      <ListSection title="Requirements" items={job.requirements} />
      <ListSection title="Nice to Have" items={job.niceToHave} />
      <ListSection title="Benefits" items={job.benefits} />
      <section className="career-detail-section">
        <h2>Skills</h2>
        <div className="career-skills">{(job.skills || []).map((skill) => <span key={skill}>{skill}</span>)}</div>
      </section>
      <ApplicationModal job={job} open={applyOpen} onClose={() => setApplyOpen(false)} />
    </main>
  );
}
