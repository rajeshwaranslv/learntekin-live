import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import { auth, db } from "../../firebase";
import "./ThoughtLeadersScreen.css";

/* ── Logo/avatar with letter fallback (same pattern as PlacementAvatar) ── */
function CompanyLogo({ src, name, style, className }) {
  const [failed, setFailed] = useState(false);
  const initial = (name || "?")[0].toUpperCase();

  if (!src || failed) {
    return (
      <div
        className={`tl-logo-fallback${className ? ` ${className}` : ""}`}
        style={style}
        aria-label={name}
        title={name}
      >
        {initial}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className={className}
      style={style}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://lte-node.onrender.com";
const CHARITY_API_URL = `${API_BASE}/api/charities`;

const ThoughtLeadersScreen = () => {
  const renderRichText = (value) => {
    const cleanValue = typeof value === "string" ? value.trim() : "";

    if (!cleanValue) {
      return null;
    }

    return parse(cleanValue);
  };

  const leaders = [
    {
      title: "People and Business",
      name: "Ratan Tata",
      description:
        "Ratan Tata, an Indian industrialist and philanthropist, is renowned for his visionary leadership in business and his dedication to ethical practices.",
      image:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2F736x%2Ff7%2Ff8%2Ff9%2Ff7f8f965c3bab2227d4962d9f338ed8f.jpg&f=1&nofb=1&ipt=1aaf375431edd11bfd89515dd38964a77cb9a62e065525a67f732a702fbc8540&ipo=images", // Replace with an actual image URL
    },
    {
      title: "Rules and People",
      name: " Social Secular Justice Ideology",
      description:
        "It stands for a balanced and secular approach to justice and rules that uplift society as a whole.",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/f/fe/TVK_Official_Flag.jpg",
      imgStyle: { height: "7rem", width: "12rem", borderRadius: "0.75rem" },
    },
    {
      title: "R&D Tech",
      name: "Dr. APJ Abdul Kalam",
      description:
        "Known as the 'Missile Man of India,' Dr. Kalam's contributions to R&D in technology have left an indelible mark on India's scientific advancements.",
      image:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.etimg.com%2Fthumb%2Fwidth-1200%2Cheight-900%2Cimgsize-156411%2Cresizemode-1%2Cmsid-52146614%2Fnews%2Fpolitics-and-nation%2Fhc-restrains-party-from-using-name%2Fpictures-of-late-abdul-kalam.jpg&f=1&nofb=1&ipt=3d399026ab4062350456a69ff763b79e26f527b54284638e3595efe87d6e74d7&ipo=images", // Replace with an actual image URL
    },
  ];

  const companies = [
    {
      companyName: "A2D PC Factory",
      link: "https://www.a2dpcfactory.com/setup.html",
      description:
        "Crafting Your Ultimate Gaming Experience - Unleash Your Power! people work with Smart Systems. Customise your Dream PC",
      image:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.jr8x_xSVJk20ll6e2JSVyQHaD4%26pid%3DApi&f=1&ipt=c4ab2c28ce679180053ab181b784442ad795b0d3328f8e37879e1b6cfca68b48&ipo=images", // Replace with an actual image URL
    },

    {
      companyName: "Amazon Shop",
      link: "http://amzn.to/3ByFthE",
      description:
        "Amazon Shop is an online marketplace where customers can buy a wide range of products, from electronics to groceries, with fast delivery options.",
      image: "https://hdqwalls.com/wallpapers/amazon-4k-logo-qhd.jpg", // Replace with an actual image URL
    },
  ];

  const workspace = [
    {
      location: "Chennai",
      link: "https://gccservices.chennaicorporation.gov.in/muthalvarpadaippagam",

      description:
        "Learning Centre is a designated space in an educational context where specific knowledge, skills, and competencies are taught and developed.  ",
    },

    {
      location: "Panruti",
      link: "https://learntek-innovations.web.app/Contact",

      description:
        "Learn TEK In is an organization that provides a comprehensive fellowship program in website development, Android application development, data analytics, and data science.  ",
    },
  ];


  const [expandedCards, setExpandedCards] = useState(new Set());
  const toggleCard = (key) =>
    setExpandedCards((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const [charities, setCharities]         = useState([]);
  const [charityLoading, setCharityLoading] = useState(true);
  const [charityError, setCharityError]   = useState("");
  const [adminUser, setAdminUser]         = useState(null);
  const [editingCharity, setEditingCharity] = useState(null);
  const [charityForm, setCharityForm]     = useState({ name: "", image: "", description: "" });
  const [charitySaving, setCharitySaving] = useState(false);

  /* Check if current user is admin */
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) { setAdminUser(null); return; }
      try {
        const snap = await db.collection("users").doc(user.uid).get();
        setAdminUser(snap.exists && snap.data()?.role === "admin" ? user : null);
      } catch { setAdminUser(null); }
    });
    return () => unsub();
  }, []);

  /* Load charities from API */
  useEffect(() => {
    let active = true;
    setCharityLoading(true);
    const load = async () => {
      try {
        const res = await fetch(CHARITY_API_URL);
        if (!res.ok) throw new Error("Failed to load charities.");
        const data = await res.json();
        if (active) { setCharities(Array.isArray(data) ? data : []); setCharityError(""); }
      } catch (err) {
        if (active) setCharityError("Unable to load charity partners right now.");
      } finally {
        if (active) setCharityLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  /* Admin inline helpers */
  const openEditCharity = (c) => {
    setEditingCharity(c._id);
    setCharityForm({ name: c.name, image: c.image || "", description: c.description || "" });
  };
  const cancelEditCharity = () => { setEditingCharity(null); setCharityForm({ name: "", image: "", description: "" }); };

  const handleCharitySave = async () => {
    if (!charityForm.name.trim()) return;
    setCharitySaving(true);
    try {
      const res = await fetch(`${CHARITY_API_URL}/${editingCharity}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(charityForm),
      });
      if (!res.ok) throw new Error("Save failed");
      const updated = await res.json();
      setCharities((prev) => prev.map((c) => c._id === editingCharity ? updated : c));
      cancelEditCharity();
    } catch { alert("Failed to save charity."); }
    finally { setCharitySaving(false); }
  };

  const handleCharityDelete = async (id) => {
    if (!window.confirm("Delete this charity?")) return;
    try {
      await fetch(`${CHARITY_API_URL}/${id}`, { method: "DELETE" });
      setCharities((prev) => prev.filter((c) => c._id !== id));
    } catch { alert("Failed to delete charity."); }
  };

  const tamilQuotes = [
    "Enniya mudithal vendum.",
    "Challenges can ignite a brighter future.",
    "Freedom is the cure for fear and limitation.",
    "Even if it is great, keep asking for greater goals.",
  ];

  return (
    <section className="tls-wrap">
    <div className="thought-leaders-screen">
      <h1>Thought Leaders</h1>

      <div className="leaders-container">
        {leaders.map((leader, index) => {
          const isExpanded = expandedCards.has(`leader-${index}`);
          const LIMIT = 90;
          const isLong = leader.description.length > LIMIT;
          return (
            <div className="leader-card" key={index}>
              <h2>{leader.title}</h2>
              <img
                src={leader.image}
                style={{
                  height: "10rem",
                  width: "10rem",
                  margin: "1.5rem auto",
                  borderRadius: "2rem",
                  objectFit: "cover",
                  display: "block",
                  ...( leader.imgStyle || {} ),
                }}
                alt={leader.name}
              />
              <h3>{leader.name}</h3>
              <p align="justify" style={{ fontWeight: "bolder" }}>
                {isLong && !isExpanded
                  ? leader.description.slice(0, LIMIT) + "…"
                  : leader.description}
              </p>
              {isLong && (
                <button className="tl-toggle-btn" onClick={() => toggleCard(`leader-${index}`)}>
                  {isExpanded ? "Show less ▲" : "Show more ▼"}
                </button>
              )}
            </div>
          );
        })}

        {/* Bharathiyaar */}
        {(() => {
          const key = "bharathiyaar";
          const isExpanded = expandedCards.has(key);
          const fullDesc = "Bharathiyaar's poetic works inspire courage and patriotism, especially his motivational quotes written in Tamil.";
          const LIMIT = 90;
          return (
            <div className="leader-card">
              <h2>Motivational Leader</h2>
              <img
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Fvector-premium%2Fbharathiyar_764504-155.jpg%3Fw%3D360&f=1&nofb=1&ipt=aa554cd8df9b7bdd27aeef0ddc56ab8ff2172b362e1373fe734cce5e3f362c19&ipo=images"
                alt="Bharathiyaar"
                style={{ height: "10rem", width: "10rem", margin: "1.5rem auto", borderRadius: "50%", objectFit: "cover", display: "block" }}
              />
              <h3>Bharathiyaar</h3>
              <p align="justify" style={{ fontWeight: "bolder" }}>
                {isExpanded ? fullDesc : fullDesc.slice(0, LIMIT) + "…"}
              </p>
              {isExpanded && (
                <ul>
                  {tamilQuotes.map((quote, idx) => (
                    <li align="justify" key={idx}>{quote}</li>
                  ))}
                </ul>
              )}
              <button className="tl-toggle-btn" onClick={() => toggleCard(key)}>
                {isExpanded ? "Show less ▲" : "Show more ▼"}
              </button>
            </div>
          );
        })()}
      </div>
      <h1 className="m-4">All Tech Products & Services from:</h1>
      <div className="leaders-container">
        {/* Render each leader */}
        {companies.map((company, index) => (
          <div className="leader-card" key={index}>
            <h2>{company.companyName}</h2>
            <CompanyLogo
              src={company.image}
              name={company.companyName}
              style={{ height: "6rem", width: "6rem", borderRadius: "2rem" }}
            />

            <p align="justify" style={{ fontWeight: "bolder" }}>
              {company.description}
            </p>
            <a href={company.link} target="_blank" rel="noopener noreferrer" className="button">
              CONTACT US
            </a>
          </div>
        ))}
      </div>
      <h1 className="m-4">Learning Workspace</h1>
      <div className="leaders-container">
        {/* Render each leader */}
        {workspace.map((work, index) => (
          <div className="leader-card" key={index}>
            <h1>{work.location}</h1>

            <h3 align="justify">{work.description}</h3>
            <a href={work.link} target="_blank" rel="noopener noreferrer" className="button">
              CONTACT US
            </a>
          </div>
        ))}
      </div>

      <section className="cp-section">
        <div className="cp-section-header">
          <span className="cp-section-badge">Making a Difference</span>
          <h2 className="cp-section-title">Charity Partners</h2>
          <p className="cp-section-sub">
            We proudly support changemakers creating real impact in their communities.
          </p>
        </div>

        {adminUser && (
          <div className="cp-admin-bar">
            <span className="cp-admin-badge">Admin Mode</span>
            <span style={{ fontSize: 12, color: "#6b7280" }}>You can edit or delete charity cards inline.</span>
          </div>
        )}

        {charityError && <p className="cp-error">{charityError}</p>}

        {charityLoading && (
          <div style={{ textAlign: "center", padding: "32px 0", color: "#9ca3af" }}>Loading charity partners…</div>
        )}

        {!charityLoading && !charityError && charities.length === 0 && (
          <div style={{ textAlign: "center", padding: "32px 0", color: "#9ca3af" }}>No charity partners listed yet.</div>
        )}

        <div className="cp-grid">
          {charities.map((chars) => (
            <article className="cp-card" key={chars._id || chars.name}>
              <div className="cp-card-accent" />

              {/* Admin inline edit form */}
              {adminUser && editingCharity === chars._id ? (
                <div className="cp-admin-edit">
                  <input className="cp-admin-input" value={charityForm.name}
                    onChange={(e) => setCharityForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Name" />
                  <input className="cp-admin-input" value={charityForm.image}
                    onChange={(e) => setCharityForm((p) => ({ ...p, image: e.target.value }))}
                    placeholder="Image URL" />
                  <textarea className="cp-admin-input" rows={3} value={charityForm.description}
                    onChange={(e) => setCharityForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Description" />
                  <div className="cp-admin-actions">
                    <button className="cp-admin-btn cp-admin-btn-save" onClick={handleCharitySave} disabled={charitySaving}>
                      {charitySaving ? "Saving…" : "Save"}
                    </button>
                    <button className="cp-admin-btn cp-admin-btn-cancel" onClick={cancelEditCharity}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="cp-card-inner">
                  <div className="cp-avatar-wrap">
                    <CompanyLogo
                      src={chars.image}
                      name={chars.name}
                      className="cp-avatar"
                    />
                    <span className="cp-avatar-ring" />
                  </div>

                  <div className="cp-card-body">
                    <div className="cp-card-meta">
                      <span className="cp-badge">Charity Partner</span>
                      {adminUser && (
                        <div className="cp-admin-controls">
                          <button className="cp-admin-btn cp-admin-btn-edit" onClick={() => openEditCharity(chars)}>Edit</button>
                          <button className="cp-admin-btn cp-admin-btn-del" onClick={() => handleCharityDelete(chars._id)}>Delete</button>
                        </div>
                      )}
                    </div>
                    <h3 className="cp-name">{chars.name}</h3>

                    <div className="cp-description">
                      {renderRichText(chars.description)}
                    </div>

                    <a
                      href={chars.whatsapp || "https://wa.me/919941918157"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cp-cta gfg-btn"
                    >
                      <span>Connect</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </a>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
    </section>
  );
};

export default ThoughtLeadersScreen;
