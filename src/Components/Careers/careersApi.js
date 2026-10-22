import axios from "axios";
import { buildApiUrl } from "../../utils/api";

const cache = new Map();
const endpoint = (path) => buildApiUrl(`/api${path}`);

const sampleJobs = [
  {
    _id: "demo-react",
    title: "Frontend Engineer - React.js",
    slug: "frontend-engineer-react-js",
    department: "Engineering",
    employmentType: "Full-time",
    experience: "2-5 years",
    location: "Hyderabad / Remote",
    salary: "Competitive",
    openings: 3,
    description: "Build polished learning, commerce, and productivity interfaces using React and accessible UI patterns.",
    responsibilities: ["Develop responsive React interfaces.", "Collaborate with product and backend teams.", "Optimize performance and accessibility."],
    requirements: ["Strong JavaScript and React fundamentals.", "REST API experience.", "Responsive CSS and accessibility awareness."],
    niceToHave: ["TypeScript", "Design systems", "Animation craft"],
    benefits: ["Flexible work", "Learning budget", "Project ownership"],
    skills: ["React", "JavaScript", "CSS", "REST APIs"],
    status: "active",
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "demo-node",
    title: "Backend Engineer - Node.js",
    slug: "backend-engineer-node-js",
    department: "Engineering",
    employmentType: "Full-time",
    experience: "3-6 years",
    location: "Bengaluru / Remote",
    salary: "Competitive",
    openings: 2,
    description: "Build secure, scalable backend services for our learning platform, marketplace, and operational systems.",
    companyOverview: "We are creating a modern digital ecosystem that connects learning, commerce, and product operations. This role helps shape the backend foundation that powers reliable user experiences, automation, and internal workflows.",
    responsibilities: [
      "Design and build scalable REST APIs for core product features and internal systems.",
      "Model and evolve MongoDB schemas to support fast, reliable data access.",
      "Integrate notification, email, and background processing workflows into production services.",
      "Collaborate with frontend, product, and infrastructure teams to ship high-quality features.",
    ],
    requirements: [
      "Strong experience with Node.js and Express in production applications.",
      "Solid understanding of MongoDB and Mongoose schema design.",
      "Good knowledge of API security, input validation, and error-handling best practices.",
      "Ability to write clean, maintainable backend code and contribute to code reviews.",
    ],
    niceToHave: [
      "Experience with Redis, queues, or background job systems.",
      "Familiarity with cloud deployments, monitoring, and observability tooling.",
    ],
    benefits: [
      "Remote-first collaboration with flexible work arrangements.",
      "Ownership of architecture decisions and platform improvements.",
      "Mentorship, learning support, and a strong engineering culture.",
    ],
    skills: ["Node.js", "Express", "MongoDB", "Mongoose", "JWT", "REST APIs"],
    status: "active",
    featured: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: "demo-design",
    title: "UI/UX Designer",
    slug: "ui-ux-designer",
    department: "Design",
    employmentType: "Contract",
    experience: "1-4 years",
    location: "Remote",
    salary: "Project based",
    openings: 2,
    description: "Create clear, premium, accessible product experiences for students, admins, and technology buyers.",
    responsibilities: ["Design responsive flows.", "Prepare component specs.", "Partner with engineers."],
    requirements: ["Portfolio with shipped work.", "Figma proficiency.", "Strong visual hierarchy."],
    niceToHave: ["Design systems", "Motion design"],
    benefits: ["Flexible schedule", "Portfolio-friendly products"],
    skills: ["Figma", "UX Research", "Design Systems"],
    status: "active",
    featured: false,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

const facetsFrom = (jobs) => ({
  departments: [...new Set(jobs.map((job) => job.department).filter(Boolean))],
  locations: [...new Set(jobs.map((job) => job.location).filter(Boolean))],
  employmentTypes: [...new Set(jobs.map((job) => job.employmentType).filter(Boolean))],
  experiences: [...new Set(jobs.map((job) => job.experience).filter(Boolean))],
});

const fallbackList = (params = {}) => {
  let jobs = [...sampleJobs];

  const search = String(params.search || "").toLowerCase();

  if (search) jobs = jobs.filter((job) => [job.title, job.department, job.location, job.skills?.join(" ")].join(" ").toLowerCase().includes(search));
  ["department", "location", "employmentType", "experience"].forEach((key) => {
    if (params[key]) jobs = jobs.filter((job) => job[key] === params[key]);
  });

  if (params.sort === "oldest") jobs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  else if (params.sort === "az") jobs.sort((a, b) => a.title.localeCompare(b.title));
  else jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const page = Number(params.page || 1);
  const limit = Number(params.limit || 9);
  const total = jobs.length;
  const pagedJobs = jobs.slice((page - 1) * limit, page * limit).map((job) => ({ ...job, offline: true }));
  return {
    jobs: pagedJobs,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
    facets: facetsFrom(sampleJobs),
    offline: true,
  };
};

export const careersApi = {
  async listJobs(params) {
    const key = JSON.stringify(params || {});
    if (cache.has(key)) return cache.get(key);
    try {
      const { data } = await axios.get(endpoint("/jobs"), { params, timeout: 7000 });
      cache.set(key, data);
      return data;
    } catch (error) {
      if (import.meta.env.DEV) return fallbackList(params);
      throw error;
    }
  },
  async getJob(slug) {
    try {
      const { data } = await axios.get(endpoint(`/jobs/${slug}`), { timeout: 7000 });
      return data;
    } catch (error) {
      if (!import.meta.env.DEV) throw error;
      const sampleJob = sampleJobs.find((job) => job.slug === slug);
      return sampleJob ? { ...sampleJob, offline: true } : null;
    }
  },
  async apply(jobId, formData) {
    if (!jobId) throw new Error("Invalid job identifier.");
    const encodedId = encodeURIComponent(String(jobId));
    const { data } = await axios.post(endpoint(`/jobs/${encodedId}/apply`), formData);
    return data;
  },
};

export const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};
