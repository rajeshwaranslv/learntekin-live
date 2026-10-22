import React, { useState } from "react";
import { Modal } from "antd";
import { careersApi } from "./careersApi";

const empty = {
  name: "",
  email: "",
  phone: "",
  currentLocation: "",
  experience: "",
  currentCompany: "",
  currentCTC: "",
  expectedCTC: "",
  noticePeriod: "",
  portfolio: "",
  linkedin: "",
  github: "",
  coverLetter: "",
};

const validate = (values, resume) => {
  if (!values.name || !values.email || !values.phone || !values.currentLocation || !values.experience) return "Please complete all required fields.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return "Enter a valid email address.";
  if (!/^[0-9+\-\s()]{8,18}$/.test(values.phone)) return "Enter a valid phone number.";
  if (!resume) return "Resume is required.";
  if (!["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(resume.type)) return "Resume must be PDF, DOC, or DOCX.";
  if (resume.size > 5 * 1024 * 1024) return "Resume must be 5 MB or less.";
  return "";
};

export default function ApplicationModal({ job, open, onClose }) {
  const [values, setValues] = useState(empty);
  const [resume, setResume] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const update = (key, value) => setValues((prev) => ({ ...prev, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    if (job?.offline) {
      Modal.error({ title: "Submission failed", content: "This role is a preview-only sample and cannot accept applications." });
      return;
    }
    const jobId = job?.slug || job?._id;
    if (!jobId) {
      Modal.error({ title: "Submission failed", content: "Unable to identify the selected role. Please close and reopen the form." });
      return;
    }
    const error = validate(values, resume);
    if (error) {
      Modal.error({ title: "Check your application", content: error });
      return;
    }
    const body = new FormData();
    Object.entries(values).forEach(([key, value]) => body.append(key, value));
    body.append("resume", resume);
    setSubmitting(true);
    try {
      await careersApi.apply(jobId, body);
      Modal.success({
        title: "Application submitted",
        content: "Thanks for applying. We have received your application and will contact you shortly.",
        onOk: () => {
          setValues(empty);
          setResume(null);
          onClose();
        },
      });
    } catch (err) {
      Modal.error({ title: "Submission failed", content: err.response?.data?.message || "Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={780}
      title={`Apply for ${job?.title || "role"}`}
      destroyOnClose
      bodyStyle={{ maxHeight: "calc(100vh - 220px)", overflowY: "auto", padding: "1rem 1.25rem 1.5rem" }}
      className="career-apply-modal"
    >
      <form className="career-apply-form" onSubmit={submit}>
        {[
          ["name", "Full Name *"],
          ["email", "Email *"],
          ["phone", "Phone *"],
          ["currentLocation", "Current Location *"],
          ["experience", "Years of Experience *"],
          ["currentCompany", "Current Company"],
          ["currentCTC", "Current CTC"],
          ["expectedCTC", "Expected CTC"],
          ["noticePeriod", "Notice Period"],
          ["portfolio", "Portfolio"],
          ["linkedin", "LinkedIn"],
          ["github", "GitHub"],
        ].map(([key, label]) => (
          <label key={key}>
            <span>{label}</span>
            <input value={values[key]} onChange={(event) => update(key, event.target.value)} type={key === "email" ? "email" : "text"} />
          </label>
        ))}
        <label className="career-form-wide">
          <span>Resume Upload * (PDF/DOC/DOCX, max 5 MB)</span>
          <input type="file" accept=".pdf,.doc,.docx" onChange={(event) => setResume(event.target.files?.[0] || null)} />
        </label>
        <label className="career-form-wide">
          <span>Cover Letter</span>
          <textarea rows={5} value={values.coverLetter} onChange={(event) => update("coverLetter", event.target.value)} />
        </label>
        <button type="submit" disabled={submitting || job?.offline}>{job?.offline ? "Preview only" : submitting ? "Submitting..." : "Submit Application"}</button>
      </form>
    </Modal>
  );
}
