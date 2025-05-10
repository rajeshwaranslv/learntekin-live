import React, { Component } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./testimonials.css"; // Custom styles

export default class StudentPlacedCompanies extends Component {
  componentDidMount() {
    document.title = "Student Placed Companies";
  }

  render() {
    const placementCompanies = [
      { name: "HEPL", logo: "assets/img/companies/hepl.jpg", message: "Multiple students placed in key roles." },
      { name: "Wipro", logo: "assets/img/companies/wipro.jpg", message: "Shaping careers with cutting-edge technologies." },
      { name: "TCS", logo: "assets/img/companies/tcs.jpg", message: "Our students excel in delivering excellence at TCS." },
      { name: "Infosys", logo: "assets/img/companies/infosys.jpg", message: "Driving innovation with Infosys opportunities." },
      { name: "Cognizant", logo: "assets/img/companies/cognizant.jpg", message: "Helping students achieve professional growth." },
      { name: "Capgemini", logo: "assets/img/companies/capgemini.jpg", message: "Empowering students to lead in their fields." },
      { name: "Outlier AI", logo: "assets/img/companies/outlierai.jpg", message: "Fostering innovation and AI-driven solutions." },
      { name: "App Innovations", logo: "assets/img/companies/apt.jpg", message: "Transforming ideas into technology with our students." },
      { name: "Vasegara Veda Technologies", logo: "assets/img/companies/vvt.jpg", message: "Pioneering technological solutions together." },
      { name: "AVENSTEK", logo: "assets/img/companies/avenstek.png", message: "Building next-gen technology leaders." },
      { name: "Soul AI", logo: "assets/img/companies/soulai.jpg", message: "Driving excellence in AI development." },
      { name: "Accenture", logo: "assets/img/companies/accenture.jpg", message: "Innovative roles for aspiring leaders." },
      { name: "Appasamy Associates", logo: "assets/img/companies/ai.jpg", message: "Empowering healthcare through our students." },
      { name: "Zoho", logo: "assets/img/companies/zoho.jpg", message: "Pioneering business solutions with our alumni." },
    ];

    return (
      <section id="placement-companies" className="testimonials">
        <div className="container-fluid" data-aos="fade-up" style={{ textAlign: "center", color: "black" }}>
          <h2>Student Placed Companies</h2>
          <p>Discover the companies where our students are thriving.</p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{
            delay: 3000, // 3 seconds delay
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          navigation
          loop={true}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="mySwiper"
        >
          {placementCompanies.map((company, index) => (
            <SwiperSlide key={index}>
              <div className="testimonial-item">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="testimonial-img"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "contain",
                    marginBottom: "1rem",
                  }}
                />
                <h4>{company.name}</h4>
                <p className="testimonial-message">
                  <i className="bi bi-quote quote-icon-left" style={{ color: "green" }}></i>
                  {company.message}
                  <i className="bi bi-quote quote-icon-right" style={{ color: "green" }}></i>
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    );
  }
}
