import React, { Component } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./testimonials.css"; // Custom styles

export default class Testimonials extends Component {
  componentDidMount() {
    document.title = "Testimonials";
  }

  render() {
    const testimonials = [
      { 
        name: "Udhaya M", 
        role: "HR-RM Koantek ", 
        img: "assets/img/testimonials/testimonials-1.jpg",
        message: "I got an offer from Koantek " 
      },
      { 
        name: "Elamaranvijay T", 
        role: "SDE at HEPL", 
        img: "assets/img/testimonials/testimonials-2.jpg",
        message: "I got an offer from HEPL" 
      },
      { 
        name: "Adlin Jukesha J ", 
        role: "SDE at Capgemini", 
        img: "assets/img/testimonials/testimonials-3.jpg",
        message: "I got an offer from Capgemini" 
      },
      { 
        name: "Rajeshwaran Selvam", 
        role: "SDE at Outlier AI", 
        img: "assets/img/testimonials/testimonials-4.png",
        message: "I got 4+ offers during the internship and fellowship" 
      },
      { 
        name: "Ashwadhani S", 
        role: "Technical Trainer", 
        img: "assets/img/testimonials/testimonials-5.jpg",
        message: "Amazing results! I’m beyond impressed." 
      }
      
    //   { 
    //     name: "Emily Hudson", 
    //     role: "Consultant", 
    //     img: "assets/img/testimonials/testimonials-6.jpg",
    //     message: "Great attention to detail and excellent execution!" 
    //   },
    //   { 
    //     name: "Paul Smith", 
    //     role: "Software Engineer", 
    //     img: "assets/img/testimonials/testimonials-7.jpg",
    //     message: "They exceeded all expectations. Fantastic experience!" 
    //   },
    //   { 
    //     name: "Lisa White", 
    //     role: "Project Manager", 
    //     img: "assets/img/testimonials/testimonials-8.jpg",
    //     message: "Professional, reliable, and truly outstanding!" 
    //   },
    //   { 
    //     name: "Chris Johnson", 
    //     role: "Marketing Head", 
    //     img: "assets/img/testimonials/testimonials-9.jpg",
    //     message: "A team you can trust for all your needs. Highly efficient!" 
    //   },
    //   { 
    //     name: "Nina Brown", 
    //     role: "UX Designer", 
    //     img: "assets/img/testimonials/testimonials-10.jpg",
    //     message: "Great work ethic and superb attention to detail!" 
    //   },
     ];

    return (
      <section id="testimonials" className="testimonials">
        <div className="container-fluid" data-aos="fade-up" style={{ textAlign: "center" , color:"black"}}>
          <h2>Our Happy Clients</h2>
          <p>See what people are saying about us.</p>
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
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="testimonial-item">
                <img
                  src={testimonial.img}
                  alt={testimonial.name}
                  className="testimonial-img"
                />
                <h4>{testimonial.name}</h4>
                <p className="testimonial-role">{testimonial.role}</p>
                <p className="testimonial-message">
                  <i className="bi bi-quote quote-icon-left" style={{ color: "green" }}></i>
                  {testimonial.message}
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
