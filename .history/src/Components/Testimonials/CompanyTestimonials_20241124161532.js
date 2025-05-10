import React, { Component } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./testimonials.css"; // Custom styles

export default class CompanyTestimonials extends Component {
  componentDidMount() {
    document.title = "Company Testimonials";
  }

  render() {
    const companies = [
      {
        name: "Altaj93 Shoppers",
        logo: "assets/img/companies/93shoppers.jpg",
        message: "Altaj93 Shoppers achieved a record 50% increase in online sales with our solutions.",
      },
      {
        name: "Finance Frenzy",
        logo: "assets/img/companies/logo.png",
        message: "Finance Frenzy streamlined operations, reducing costs by 30% and improving ROI.",
      },
      {
        name: "Kris Case Factory",
        logo: "assets/img/companies/kriscasefactory.jpg",
        message: "Kris Case Factory revolutionized their supply chain with our advanced analytics.",
      },
      {
        name: "Outlier AI",
        logo: "assets/img/companies/outlierai.jpg",
        message: "Outlier AI scaled their operations with a 4x improvement in efficiency and fast growing AI platform.",
      },
      {
        name: "Udhaya Electronics & Mobiles",
        logo: "assets/img/companies/uem.jpg",
        message: "Flappy Mobiles expanded their market reach, increasing customer satisfaction.",
      }
 
    ];

    return (
      <section id="testimonials" className="testimonials">
        <div className="container-fluid" data-aos="fade-up" style={{ textAlign: "center", color: "black" }}>
          <h2>Our Partner Companies</h2>
          <p>Here’s what our partner companies are saying about us.</p>
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
          {companies.map((company, index) => (
            <SwiperSlide key={index}>
              <div className="testimonial-item">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="testimonial-img"
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "contain",
                
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
