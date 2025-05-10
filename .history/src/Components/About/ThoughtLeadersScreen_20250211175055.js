import React from "react";
import "./ThoughtLeadersScreen.css"; // Styling for the screen

const ThoughtLeadersScreen = () => {
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

 
    {
      companyName: "Amazon Business",
      link: "https://amzn.to/4icFIQl",
      description:
        "Amazon Business is a B2B marketplace that offers businesses access to bulk purchasing, business-only pricing, tax-exempt purchasing, and integration with procurement systems, making it easier for organizations to buy and manage supplies efficiently.",
      image: "https://hdqwalls.com/wallpapers/amazon-4k-logo-qhd.jpg", // Replace with an actual image URL
    },
    {
      companyName: "Amazon Seller",
      link: "https://sell.amazon.in/sell-online?ref_=asin_soa_rd&ld=INSOAASSOCIATES&tag=bkart00-21",
      description:
        "Amazon Seller refers to individuals or businesses that sell products on Amazon’s marketplace through either the Fulfillment by Amazon (FBA) or Fulfillment by Merchant (FBM) models. Sellers can list products, manage inventory, and reach millions of customers worldwide.",
      image: "https://hdqwalls.com/wallpapers/amazon-4k-logo-qhd.jpg", // Replace with an actual image URL
    },
    {
      companyName: "Amazon Music",
      link: "https://amzn.to/41jd21L",
      description:
        "Amazon Music is a streaming service that offers millions of songs, curated playlists, and podcasts. It includes Amazon Music Free, Prime Music, Amazon Music Unlimited, and Amazon Music HD, catering to different user needs with ad-supported, subscription-based, and high-definition audio options.",
      image: "https://hdqwalls.com/wallpapers/amazon-4k-logo-qhd.jpg", // Replace with an actual image URL
    },
    {
      companyName: "Prime Video",
      link: "https://www.primevideo.com/offers/nonprimehomepage/ref=dv_web_force_root?tag=beekart-prime-21",
      description:
        "Prime Video is Amazon’s streaming service that offers a vast library of movies, TV shows, and original content. It is included with an Amazon Prime subscription, but users can also rent or buy movies and subscribe to additional channels.",
      image: "https://hdqwalls.com/wallpapers/amazon-4k-logo-qhd.jpg", // Replace with an actual image URL
    },
  ];

  const workspace = [
    {
      location: "Chennai",
      link: "https://gccservices.chennaicorporation.gov.in/muthalvarpadaippagam",
      image:
        "https://play-lh.googleusercontent.com/p_RR7etL6BYxBTqdE43Uu8V4rcWPHyvKuTuAPmr43vyiDhM8tLQowJD7sw5aHii4CM8",
      description:
        "Learning Centre is a designated space in an educational context where specific knowledge, skills, and competencies are taught and developed. It helps to organize the curriculum, guide teaching strategies, and assess student progress. They also promote a well-rounded education by ensuring that students engage with diverse content and skills essential for their overall development.",
    },

    {
      location: "Panruti",
      link: "https://learntek-innovations.web.app/Contact",
      image:
        " https://learntek-innovations.web.app/assets/img/apple-touch-icon.png",
      description:
        "Learn TEK In is an organization that provides a comprehensive fellowship program in website development, Android application development, data analytics, and data science. The organization aims to bridge the gap between academia and industry by providing hands-on training in these domains. next one.",
    },
  ];
const charity=[{
  name: "Preethi R",
  description: "Organized and led a team of volunteers in the #feedthevoiceless project to feed and care for stray dogs in some parts rural Tamil Nadu.",
  benefits:"I wanted to reach out about a small but impactful project hashtag #collarthevoiceless we're working on—getting reflective collars for stray dogs to keep them safe at night. ",
  image:"assets/img/charity.jpeg",
  link:"https://wa.me/+919941918157"



},




]
  const tamilQuotes = [
    "எண்ணிய முடிதல் வேண்டும்",
    "இடர்ப்பாடுகள் என்றுமே சுடர் தூண்டும்",
    "சுதந்திரமே அடிமைத்தனத்தின் மருந்து",
    "பெரிதெனினும் பெரிது கேள்",
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
              style={{ height: "10rem", width: "10rem", margin:"2rem", borderRadius: "15rem" }}
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
            style={{ height: "10rem", width: "10rem", margin:"2rem", borderRadius: "15rem" }}
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
              style={{ height: "6rem", width: "6rem",  borderRadius: "15rem" }}
              alt={company.companyName}
            />

            <p align="justify" style={{ fontWeight: "bolder" }}>
              {company.description}
            </p>
            <a href={company.link} target="_blank" class="button">
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
            <h2>{work.location}</h2>
            <img
              src={work.image}
              style={{ height: "6rem", width: "6rem",margin:"2rem", borderRadius: "15rem" }}
              alt={work.location}
            />

            <h3 align="justify">{work.description}</h3>
            <a href={work.link} target="_blank" class="button">
              CONTACT US
            </a>
          </div>
        ))}
      </div>

      <h1 className="m-4">Charity Partner</h1>
      <div className="leaders-container">
        {/* Render each leader */}
        {charity.map((chars, index) => (
          <div className="charity-card" key={index}>
            <h2>{chars.name}</h2>
            <img
              src={chars.image}
              style={{ height: "10rem", width: "10rem",margin:"2rem",borderRadius:"3rem" }}
              alt={chars.name}
            />
          <ul>
            <li> <h6 align="justify">{chars.description}</h6></li>
            <li> <h6 align="justify">{chars.benefits}</h6></li>
          </ul>
            
            <a href={chars.link} target="_blank" class="button">
              CONTACT US
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThoughtLeadersScreen;
