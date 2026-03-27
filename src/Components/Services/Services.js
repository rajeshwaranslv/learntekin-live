import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import "./service.css";

export default class Services extends Component {
  componentDidMount() {
    document.title = "Services";
  }

renderServiceCard(icon, title, description, link, imageSrc) {
  return (
    <div className="col-lg-4 col-md-6 mb-4 d-flex align-items-stretch">
      <div className="icon-box" data-aos="fade-up" data-aos-delay="100">
        <img src={imageSrc} alt={title} className="img-fluid mb-3 service-img" />
        <div className="icon-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Icon icon={icon} style={{ fontSize: "2rem", marginRight: "0.5rem" }} />
          <h2 style={{ margin: 0 }}>{title}</h2>
        </div>
        <p align="justify">{description}</p>
        <a href={link} target="_blank" className="button" rel="noopener noreferrer">
          SUBMIT IDEA
        </a>
      </div>
    </div>
  );
}


  render() {
    const services = [
      {
        icon: "mdi:palette",
        title: "UI/UX Design",
        image: "assets/img/uiux.jpeg",
        description:
          "We specialize in intuitive and visually appealing interfaces. Prototypes, wireframes, or full design solutions, we've got you covered.",
        link: "https://forms.gle/Gt77PH7xfLxPjS2P8",
      },
      {
        icon: "mdi:web",
        title: "Website Development",
        image: "assets/img/web.jpeg",
        description:
          "We create fast, secure, responsive websites of all types including e-commerce, personal, and corporate portals.",
        link: "https://forms.gle/Gt77PH7xfLxPjS2P8",
      },
      {
        icon: "material-symbols:android-sharp",
        title: "Android App Development",
        image: "assets/img/android.jpeg",
        description:
          "We develop optimized, user-friendly Android apps tailored to your business needs.",
        link: "https://forms.gle/Gt77PH7xfLxPjS2P8",
      },
      {
        icon: "mdi:ab-testing",
        title: "Automation Testing",
        image: "assets/img/test.jpeg",
        description:
          "Save time and reduce errors with our automation testing solutions using latest tools and frameworks.",
        link: "https://forms.gle/Gt77PH7xfLxPjS2P8",
      },
      {
        icon: "healthicons:virus-research-alt",
        title: "Research & Development",
        image: "assets/img/research.jpeg",
        description:
          "Our experts conduct product and market R&D using the latest tools and methodologies.",
        link: "https://forms.gle/Gt77PH7xfLxPjS2P8",
      },
      {
        icon: "ep:data-analysis",
        title: "Data Analytics & Data Science",
        image: "assets/img/dads.jpeg",
        description:
          "Turn data into insights. We help you analyze, visualize, and act on your data effectively.",
        link: "https://forms.gle/Gt77PH7xfLxPjS2P8",
      },
      {
        icon: "eos-icons:iot",
        title: "RPA & IoT Development",
        image: "assets/img/iot.jpeg",
        description:
          "Improve process efficiency with our RPA and IoT development and testing solutions.",
        link: "https://forms.gle/Gt77PH7xfLxPjS2P8",
      },
      {
        icon: "mdi:web",
        title: "ML & DL",
        image: "assets/img/ml.jpeg",
        description:
          "Design and deploy ML/DL models for real-world applications with our experts.",
        link: "https://forms.gle/Gt77PH7xfLxPjS2P8",
      },
      {
        icon: "mdi:bullhorn",
        title: "Digital Marketing",
        image: "assets/img/dm.jpeg",
        description:
          "Grow your brand with SEO, social media, content strategy, and targeted ads.",
        link: "https://forms.gle/Gt77PH7xfLxPjS2P8",
      },
      {
        icon: "carbon:machine-learning-model",
        title: "Online Services",
        image: "assets/img/online.png",
        description:
          "End-to-end online services: Aadhar, PAN, banking, travel bookings, and student counseling.",
        link: "https://topmate.io/rajeshwaran_slv/1291172/pay",
      },
    ];

    return (
      <section id="services" className="services section-bg">
        <div className="container-fluid" data-aos="fade-up">
          <div className="section-title">
            <h2 style={{ color: "black" }}>Services</h2>
            <p align="justify" style={{ fontSize: "22px", color: "black" }}>
              Welcome to <strong className="st-b">Learn TEK In</strong>, your one-stop solution for technical and non-technical services.
            </p>
          </div>

          <div className="row">
            {services.map((service) =>
              this.renderServiceCard(service.icon, service.title, service.description, service.link, service.image)
            )}

            {/* YouTube Promotional Service */}
            <div className="col-lg-4 col-md-6 mb-4 d-flex align-items-stretch">
              <div className="icon-box" data-aos="fade-up" data-aos-delay="100" style={{ display: "flex", flexDirection: "column" }}>
                <img src="assets/img/dm.jpeg" alt="Promotional Services" className="img-fluid mb-3 service-img" />
                <div className="icon-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Icon icon="mdi:youtube" style={{ fontSize: "2rem", marginRight: "0.5rem", color: "#FF0000" }} />
                  <h2 style={{ margin: 0 }}>Promotional Services</h2>
                </div>
                <p align="justify">
                  Promote your brand, product, or channel across YouTube, Instagram, LinkedIn and more.
                  Choose a platform, pick a package, and get started in minutes.
                </p>
                <Link to="/Services/youtube-promo" className="button" style={{ marginTop: "auto", textAlign: "center" }}>
                  GET STARTED
                </Link>
              </div>
            </div>
          </div>

          <div className="section-title">
            <p align="justify" style={{ fontSize: "22px", color: "black" }}>
              At <strong className="st-b">Learn TEK In</strong>, we are committed to helping you meet your goals with excellence.
            </p>
          </div>
        </div>
      </section>
    );
  }
}
