import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import "./ThoughtLeadersScreen.css"; // Styling for the screen

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
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
        " https://politicalmarketer.com/wp-content/uploads/2024/10/TVK_Offficial_Flag.webp", // Replace with an actual image URL
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

  const fallbackCharity = [
    {
      name: "Preethi R",
      description:
        "Organized and led a team of volunteers in the #feedthevoiceless project to feed and care for stray dogs in some parts rural Tamil Nadu.",
      benefits:
        "I wanted to reach out about a small but impactful project hashtag #collarthevoiceless we're working on - getting reflective collars for stray dogs to keep them safe at night.",
      image: "assets/img/charity.jpeg",
      whatsapp: "https://wa.me/919941918157",
    },
  ];

  const [charities, setCharities] = useState([]);
  const [charityError, setCharityError] = useState("");

  useEffect(() => {
    let active = true;

    const loadCharities = async () => {
      try {
        const response = await fetch(CHARITY_API_URL);
        if (!response.ok) {
          throw new Error("Failed to load charities.");
        }
        const data = await response.json();
        if (active) {
          setCharities(Array.isArray(data) ? data : []);
          setCharityError("");
        }
      } catch (err) {
        if (active) {
          setCharityError("Unable to load charity partners right now.");
        }
      }
    };

    loadCharities();

    return () => {
      active = false;
    };
  }, []);

  const displayCharities = charities.length ? charities : fallbackCharity;

  const tamilQuotes = [
    "Enniya mudithal vendum.",
    "Challenges can ignite a brighter future.",
    "Freedom is the cure for fear and limitation.",
    "Even if it is great, keep asking for greater goals.",
  ];

  return (
    <div className="thought-leaders-screen">
      <h1>Thought Leaders</h1>

      <div className="leaders-container">
        {/* Render each leader */}
        {leaders.map((leader, index) => (
          <div className="leader-card" key={index}>
            <h2>{leader.title}</h2>
            <img
              src={leader.image}
              style={{ height: "10rem", width: "10rem", margin: "2rem", borderRadius: "2rem" }}
              alt={leader.name}
            />
            <h3>{leader.name}</h3>

            <p align="justify" style={{ fontWeight: "bolder" }}>
              {leader.description}
            </p>
          </div>
        ))}

        {/* Add Bharathiyaar Section */}
        <div className="leader-card">
          <h2>Motivational Leader</h2>

          <img
            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Fvector-premium%2Fbharathiyar_764504-155.jpg%3Fw%3D360&f=1&nofb=1&ipt=aa554cd8df9b7bdd27aeef0ddc56ab8ff2172b362e1373fe734cce5e3f362c19&ipo=images" // Replace with an actual image URL
            alt="Bharathiyaar"
            className="leader-image"
            style={{ height: "10rem", width: "10rem", margin: "2rem", borderRadius: "15rem" }}
          />
          <h3>Bharathiyaar</h3>
          <p align="justify" style={{ fontWeight: "bolder" }}>
            Bharathiyaar's poetic works inspire courage and patriotism,
            especially his motivational quotes written in Tamil.
          </p>
          <ul>
            {tamilQuotes.map((quote, idx) => (
              <li align="justify" key={idx}>
                {quote}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <h1 className="m-4">All Tech Products & Services from:</h1>
      <div className="leaders-container">
        {/* Render each leader */}
        {companies.map((company, index) => (
          <div className="leader-card" key={index}>
            <h2>{company.companyName}</h2>
            <img
              src={company.image}
              style={{ height: "6rem", width: "6rem", borderRadius: "2rem" }}
              alt={company.companyName}
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

        {charityError && (
          <p className="cp-error">{charityError}</p>
        )}

        <div className="cp-grid">
          {displayCharities.map((chars, index) => (
            <article className="cp-card" key={index}>
              <div className="cp-card-accent" />

              <div className="cp-card-inner">
                <div className="cp-avatar-wrap">
                  <img
                    src={chars.image || "assets/img/charity.jpeg"}
                    alt={chars.name}
                    className="cp-avatar"
                    onError={(e) => { e.target.src = "assets/img/charity.jpeg"; }}
                  />
                  <span className="cp-avatar-ring" />
                </div>

                <div className="cp-card-body">
                  <div className="cp-card-meta">
                    <span className="cp-badge">Charity Partner</span>
                  </div>
                  <h3 className="cp-name">{chars.name}</h3>

                  <div className="cp-description">
                    {renderRichText(chars.description)}
                    {chars.benefits && (
                      <p className="cp-benefits">{chars.benefits}</p>
                    )}
                  </div>

                  <a
                    href={chars.whatsapp || chars.link || "https://wa.me/919941918157"}
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
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ThoughtLeadersScreen;
