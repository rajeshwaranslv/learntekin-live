import React, { Component } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./testimonials.css"; // Reuse same styling

export default class LearningPartners extends Component {
  componentDidMount() {
    document.title = "Learning Partners";
  }

  render() {
    const learningPartners = [
      {
        name: "Udemy",
        logo: "assets/img/partners/udemy.png",
        message: "Upskilling students with industry-relevant courses.",
      },

      {
        name: "Skryptee Innovations",
        logo: "assets/img/partners/skryptee.jpeg",
        message: "Revolutionizing digital learning platforms.",
      },
      {
        name: "Cisco",
        logo: "assets/img/partners/cisco.png",
        message: "Powering learning through global tech leadership.",
      },
    ];

    return (
      <section id="learning-partners" className="testimonials">
        <div className="container-fluid" data-aos="fade-up" style={{ textAlign: "center", color: "black" }}>
          <h2>Our Learning Partners</h2>
          <p>Organizations that enable our students to grow through quality education.</p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          navigation
          loop={true}
          spaceBetween={20}
          slidesPerView={1}
          grid={{ rows: 1, fill: "row" }}
          breakpoints={{
            640: { slidesPerView: 1, grid: { rows: 2 } },
            768: { slidesPerView: 2, grid: { rows: 2 } },
            1024: { slidesPerView: 3, grid: { rows: 1 } },
          }}
          className="mySwiper"
        >
          {learningPartners.map((partner, index) => (
            <SwiperSlide key={index} style={{ height: "auto" }}>
              <div className="testimonial-item">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="testimonial-img"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "contain",
                    marginBottom: "1rem",
                  }}
                />
                <h4>{partner.name}</h4>
                <p className="testimonial-message">
                  <i className="bi bi-quote quote-icon-left" style={{ color: "green" }}></i>
                  {partner.message}
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
