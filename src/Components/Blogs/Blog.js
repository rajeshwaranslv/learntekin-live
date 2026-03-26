import React, { useState } from "react";
import { Link } from "react-router-dom";
import BlogManagement from "./BlogManagement";
import "./blog.css";

const POSTS = [
  {
    id: 1,
    image: "assets/img/blog/blog-2.png",
    category: "Referral",
    title: "Refer Your Friends to Outlier AI",
    author: "LearnTEKIN Team",
    avatar: "LT",
    date: "Nov 25, 2024",
    readTime: "2 min read",
    excerpt:
      "A referral candidate must not have already applied to a job with Outlier, have been referred to Outlier in the past, or already be an existing user on Outlier.",
    tags: ["Referral", "Outlier AI", "Earn"],
    cta: {
      label: "Apply Now",
      href: "https://app.outlier.ai/expert/opportunities?utm_source=referral&referring_user=66f4d02c6030c2dbfab6f2c9",
    },
    filters: ["All", "Referral"],
  },
  {
    id: 2,
    image: "assets/img/blog/blog-3.png",
    category: "Community",
    title: "Connect 1:1 via Topmate",
    author: "LearnTEKIN Team",
    avatar: "LT",
    date: "Nov 25, 2024",
    readTime: "1 min read",
    excerpt:
      "I've been using Topmate to connect 1:1 with my followers. Use my referral link to signup and get 3 months free!",
    tags: ["Topmate", "Community", "Mentorship"],
    cta: { label: "Join Topmate", href: "https://topmate.io/join/rajeshwaran_slv" },
    filters: ["All", "Community"],
  },
  {
    id: 3,
    image: "assets/img/blog/blog-4.png",
    category: "Programs",
    title: "LearnTEKIN Fellowship & Internship Referral Rewards",
    author: "LearnTEKIN Team",
    avatar: "LT",
    date: "Dec 1, 2024",
    readTime: "3 min read",
    excerpt:
      "Refer friends to our fellowship or internship programs and earn rewards. 50+ referrals earns ₹5,000 for fellowship and ₹200 for internship.",
    tags: ["Fellowship", "Internship", "Referral", "Rewards"],
    cta: { label: "Explore Programs", href: "/Products" },
    filters: ["All", "Programs", "Referral"],
    tables: [
      {
        title: "Fellowship Referral Program",
        rows: [
          ["50 or more", "₹5,000"],
          ["25 or more", "₹2,000"],
          ["13 or more", "₹1,000"],
          ["7 or more", "₹600"],
        ],
      },
      {
        title: "Internship Referral Program",
        rows: [
          ["50 or more", "₹200"],
          ["25 or more", "₹100"],
          ["13 or more", "₹50"],
          ["7 or more", "₹25"],
        ],
      },
    ],
  },
  {
    id: 4,
    image: "assets/img/blog/blog-5.png",
    category: "Services",
    title: "LearnTEKIN Projects & Services Referral Rewards",
    author: "LearnTEKIN Team",
    avatar: "LT",
    date: "Dec 5, 2024",
    readTime: "2 min read",
    excerpt:
      "Refer your network to our projects or services and earn rewards. Project referrals earn ₹500 for 2 referrals.",
    tags: ["Projects", "Services", "Referral", "Rewards"],
    cta: { label: "View Services", href: "/Services" },
    filters: ["All", "Services", "Referral"],
    tables: [
      {
        title: "Projects Referral Program",
        rows: [
          ["2", "₹500"],
          ["1", "₹100"],
        ],
      },
      {
        title: "Services Referral Program",
        rows: [
          ["10 or more", "₹100"],
          ["5 or more", "₹50"],
          ["2 or more", "₹10"],
        ],
      },
    ],
  },
];

const FILTERS = ["All", "Referral", "Programs", "Community", "Services"];

const BlogCard = ({ post, featured = false }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.id * 7 + 12);
  const [expanded, setExpanded] = useState(false);

  const handleLike = () => {
    setLikes((v) => (liked ? v - 1 : v + 1));
    setLiked((v) => !v);
  };

  const hasTables = post.tables && post.tables.length > 0;

  return (
    <article className={`blog-card${featured ? " blog-card--featured" : ""}`}>
      <div className="blog-card-img-wrap">
        <img src={post.image} alt={post.title} loading="lazy" />
        <span className="blog-card-category">{post.category}</span>
      </div>
      <div className="blog-card-body">
        <div className="blog-card-author">
          <div className="blog-avatar">{post.avatar}</div>
          <div>
            <strong>{post.author}</strong>
            <span>
              {post.date} · {post.readTime}
            </span>
          </div>
        </div>
        <h2 className="blog-card-title">{post.title}</h2>
        <p className={`blog-card-excerpt${expanded ? " blog-card-excerpt--expanded" : ""}`}>
          {post.excerpt}
        </p>
        {expanded && hasTables &&
          post.tables.map((table) => (
            <div key={table.title} className="blog-table-wrap">
              <h4 className="blog-table-title">{table.title}</h4>
              <table className="blog-table">
                <thead>
                  <tr>
                    <th>Referrals</th>
                    <th>Reward</th>
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map(([ref, reward]) => (
                    <tr key={ref}>
                      <td>{ref}</td>
                      <td>{reward}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        <button
          className="blog-show-more"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? (
            <><i className="bi bi-chevron-up" /> Show less</>
          ) : (
            <><i className="bi bi-chevron-down" /> {hasTables ? "Show details" : "Show more"}</>
          )}
        </button>
        <div className="blog-card-tags">
          {post.tags.map((t) => (
            <span key={t} className="blog-tag">
              {t}
            </span>
          ))}
        </div>
        <div className="blog-card-footer">
          <div className="blog-card-actions">
            <button
              className={`blog-action-btn${liked ? " liked" : ""}`}
              onClick={handleLike}
              aria-label="Like post"
            >
              <i className={`bi bi-hand-thumbs-up${liked ? "-fill" : ""}`} />
              <span>{likes}</span>
            </button>
            <button className="blog-action-btn" aria-label="Comment on post">
              <i className="bi bi-chat-square-text" />
              <span>Comment</span>
            </button>
            <button
              className="blog-action-btn"
              aria-label="Share post"
              onClick={() =>
                navigator.share
                  ? navigator.share({ title: post.title, url: window.location.href })
                  : null
              }
            >
              <i className="bi bi-share" />
              <span>Share</span>
            </button>
          </div>
          <a
            href={post.cta.href}
            target={post.cta.href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="blog-cta-btn"
          >
            {post.cta.label} <i className="bi bi-arrow-right" />
          </a>
        </div>
      </div>
    </article>
  );
};

export default function Blogs() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  React.useEffect(() => {
    document.title = "Blogs";
  }, []);

  const filtered = POSTS.filter((p) => {
    const matchesFilter =
      activeFilter === "All" || p.filters.includes(activeFilter);
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const [featured, ...rest] = filtered;

  return (
    <section className="blog-page">
      <div className="blog-shell">
        {/* Hero */}
        <header className="blog-hero">
          <div className="blog-hero-copy">
            <p className="blog-kicker">INSIGHTS &amp; UPDATES</p>
            <h1>Latest from Learn TEK In</h1>
            <p>Programs, referrals, opportunities and community updates.</p>
          </div>
          <div className="blog-search-wrap">
            <i className="bi bi-search" aria-hidden="true" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts..."
              aria-label="Search blog posts"
            />
            {search && (
              <button
                className="blog-search-clear"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <i className="bi bi-x" />
              </button>
            )}
          </div>
        </header>

        {/* Filter tabs */}
        <div className="blog-filters" role="tablist">
          {FILTERS.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={activeFilter === f}
              className={`blog-filter-btn${activeFilter === f ? " active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Main two-column layout */}
        <div className="blog-layout">
          {/* Feed */}
          <main className="blog-feed">
            {filtered.length === 0 ? (
              <div className="blog-empty">
                <i className="bi bi-search" />
                <p>No posts match your search.</p>
                <button
                  onClick={() => {
                    setSearch("");
                    setActiveFilter("All");
                  }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                {featured && <BlogCard post={featured} featured={true} />}
                {rest.length > 0 && (
                  <div className="blog-grid">
                    {rest.map((p) => (
                      <BlogCard key={p.id} post={p} />
                    ))}
                  </div>
                )}
              </>
            )}
          </main>

          {/* Sidebar */}
          <aside className="blog-sidebar">
            <div className="blog-sidebar-card">
              <h3>
                <i className="bi bi-people-fill" /> Community Posts
              </h3>
              <BlogManagement />
            </div>
            <div className="blog-sidebar-card">
              <h3>
                <i className="bi bi-hash" /> Trending Tags
              </h3>
              <div className="blog-tag-cloud">
                {[
                  "Fellowship",
                  "Referral",
                  "Outlier",
                  "Topmate",
                  "Internship",
                  "Programs",
                  "Rewards",
                  "IT",
                  "Business",
                  "Learning",
                  "Android",
                  "WebDev",
                ].map((t) => (
                  <button
                    key={t}
                    className="blog-tag blog-tag--clickable"
                    onClick={() => setSearch(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="blog-sidebar-card blog-sidebar-cta">
              <i className="bi bi-mortarboard-fill" />
              <h3>Join a Program</h3>
              <p>
                Apply to a fellowship or internship and accelerate your career.
              </p>
              <Link to="/Products" className="blog-sidebar-cta-btn">
                Explore Programs
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
