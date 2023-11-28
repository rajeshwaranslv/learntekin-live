import React, { Component } from "react";
import { Icon } from "@iconify/react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
export default class Products extends Component {
  componentDidMount() {
    document.title = "Products";
  }
  handleClick = () => {
    // Scroll to the top of the page
    window.scrollTo(0, 0);
  };
  render() {
    return (
      <section id="pricing" class="pricing section-bg">
        <div class="container-fluid" data-aos="fade-up">
          <div class="section-title">
            <h2 style={{ color: "black" }}>Products Bucket List</h2>
            <p align="justify" style={{ fontSize: "22px", color: "black" }}>
              Meeting the financial challenges of today’s consumers requires a
              unique mix of experience and expertise. Backed by a wealth of
              resources, Finance Frenzy is uniquely positioned to meet these
              challenges. As an independent financial services company, Finance
              Frenzy is able to bring together the best products and companies
              to deliver unparalleled financial solutions to its clients. These
              world-class products, concepts, and support companies gives
              Finance Frenzy a competitive advantage in the marketplace.
            </p>
          </div>
          <div class="row mt-4 ">
            <div class="col-lg-12 col-md-12 align-item-center">
              <div class="box" data-aos="fade-up" data-aos-delay="100">
                <h3>Finance Frenzy</h3>
                <h4></h4>
                <ul>
                  <li align="justify">
                    Learntekin's Finance Frenzy is an independent financial
                    services company that provides a wide range of investment,
                    retirement, and estate planning products through a network
                    of independent affiliates. Our expert licensed professionals
                    work with clients to conduct a thorough financial analysis,
                    identify financial gaps, and recommend appropriate
                    investment options to fill those gaps. In today's uncertain
                    financial climate, Finance Frenzy is committed to helping
                    clients preserve their capital while seeking long-term
                    growth and appreciation. Our associates are highly educated
                    and well-trained in the industry, and we have the experience
                    and resources to create successful financial plans for
                    clients facing any financial challenge. Some of the
                    investment products we offer include mutual funds,
                    exchange-traded funds (ETFs), stocks, bonds, and annuities.
                    Our retirement planning products include individual
                    retirement accounts (IRAs), 401(k)s, and other retirement
                    savings options. We also offer estate planning services to
                    help clients plan for the future of their assets and
                    minimize tax liabilities.
                  </li>
                  <p align="justify">
                    {" "}
                    <b>
                      At Finance Frenzy, we believe in a personalized approach
                      to financial planning, and we work closely with clients to
                      understand their unique financial goals and challenges.
                      Our commitment to excellence and client satisfaction has
                      made us a trusted provider of financial services, and we
                      are dedicated to helping our clients achieve financial
                      success.
                    </b>
                  </p>
                </ul>
              </div>
            </div>
          </div>
          <h4 className="mt-4" align="justify" style={{ color: "black" }}>
            {" "}
            *Provided Through world class companies which have earned strong
            ratings from the top rating agencies (A.M. Best, S&P Global Ratings,
            Fitch Ratings) as well as accreditation from the Better Business
            Bureau. You can feel confident that Finance Frenzy will be around to
            deliver on our promise to you and your loved ones when you need it
            most.
          </h4>
        </div>
        <div class="container-fluid" data-aos="fade-up">
          <div class="section-title">
            <h2 style={{ color: "black",marginTop:"3rem" }}>1. Fellowship Program</h2>
            <p align="justify" style={{ fontSize: "22px", color: "black" }}>
              LearnTekin offers an enriching Fellowship Program designed to
              empower individuals across diverse backgrounds in the fields of
              web development, Android app development, data analytics,
              networking, and business model solutions. Tailored for students,
              working professionals, those re-entering the workforce after a
              career gap, and non-IT students, this program provides a
              comprehensive learning experience.
            </p>
            <p
              align="justify"
              style={{ marginTop: "3rem", fontSize: "22px", color: "black" }}
            >
              Participants will delve into the latest technologies and industry
              best practices, gaining hands-on expertise through practical
              projects and real-world scenarios. Whether you're a tech
              enthusiast aiming to build a solid foundation or a professional
              seeking to upskill, LearnTekin's Fellowship Program offers a
              dynamic curriculum led by industry experts.
            </p>
            <p
              align="justify"
              style={{ marginTop: "3rem", fontSize: "22px", color: "black" }}
            >
              The program's inclusive approach ensures that individuals from
              various backgrounds can seamlessly integrate into the tech
              landscape. By fostering a collaborative and supportive learning
              environment, LearnTekin aims to bridge the gap between aspiration
              and achievement. Whether you're charting a new career path or
              augmenting your existing skills, this Fellowship Program is your
              gateway to success in the rapidly evolving tech industry.
            </p>
            <p
              align="justify"
              style={{
                marginTop: "3rem",
                fontWeight: "bolder",
                fontSize: "22px",
                color: "black",
              }}
            >
              Join LearnTekin's Fellowship Program to unlock a world of
              opportunities, enhance your skill set, and embark on a
              transformative journey toward a rewarding and fulfilling career in
              the digital realm.
            </p>
          </div>
  
        </div>

        <div className="container-fluid">
          <div className="row">
            {/* Website Development */}
            <div class="col-md-6">
              <div class="icon-box" style={{padding:"1rem"}} data-aos="fade-up" data-aos-delay="100">
           
                <p align="justify" style={{ color: "white" }}>
                  <h2 style={{ color: "white" }}>     <i class="bi">
                  <Icon icon="mdi:web"  style={{ color: "white" }}/>
                </i> Website Development </h2> We
                  provide top-notch website development services to our clients.
                  Our team of experienced developers uses the latest
                  technologies and frameworks to develop websites that are
                  responsive, fast, and secure. We can build websites of all
                  types, including e-commerce, corporate, and personal websites.
                </p>
                <Button
                  style={{
                    color: "white",
                    textAlign: "left",
                    backgroundColor: "darkblue",
                    
                  }}
                  onClick={this.handleClick}
                >
          <Link className="join" to="/courseDetails"> Join now</Link>
                </Button>
              </div>
            </div>
                     {/* Android Development */}
                     <div class="col-md-6">
              <div class="icon-box" data-aos="fade-up" style={{padding:"1rem"}} data-aos-delay="100">
   
                <p align="justify" style={{ color: "white" }}>
                  <h2 style={{ color: "white" }}>           <i class="bi">
                  <Icon icon="material-symbols:android-sharp" />
                </i> Android Development</h2> We
                  provide top-notch website development services to our clients.
                  Our team of experienced developers uses the latest
                  technologies and frameworks to develop websites that are
                  responsive, fast, and secure. We can build websites of all
                  types, including e-commerce, corporate, and personal websites.
                </p>
                <Button
                  style={{
                    backgroundColor: "darkblue",
                  }}
                  onClick={this.handleClick}
              
                >
                  
          <Link className="join" to="/courseDetails"> Join now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div class="container-fluid" data-aos="fade-up">
          <div class="section-title">
            <h2 style={{ color: "black",marginTop:"3rem" }}>2. Internship</h2>
            <p align="justify" style={{ fontSize: "22px", color: "black" }}>
           
🚀 Exciting Internship Opportunities Await at LearnTek!

Ready to take your skills to the next level? LearnTek invites passionate individuals to explore our dynamic internship programs! From web and Android app development to networking, business analysis, data analytics, machine learning, deep learning, data science, and blockchain dapps solutions, our programs offer hands-on experience in cutting-edge fields.
            </p>
        
            <p
              align="justify"
              style={{
                marginTop: "3rem",
                fontWeight: "bolder",
                fontSize: "22px",
                color: "black",
              }}
            >
              Join LearnTekin's Internship to unlock a world of
              opportunities, enhance your skill set, and embark on a
              transformative journey toward a rewarding and fulfilling career in
              the digital realm.
            </p>
          </div>
  
        </div>

        <div className="container-fluid">
          <div className="row">
            {/* Website Development */}
            <div class="col-md-6">
              <div class="icon-box" style={{padding:"1rem"}} data-aos="fade-up" data-aos-delay="100">
           
                <p align="justify" style={{ color: "white" }}>
                  <h2 style={{ color: "white" }}>     <i class="bi">
                  <Icon icon="mdi:web"  style={{ color: "white" }}/>
                </i> Website Development </h2> 

               <strong>
               🌐 Elevate Your Web Development Skills with LearnTek! 🚀
               </strong><></>Exciting news for aspiring web developers! LearnTek is offering a unique web internship program to fuel your passion and enhance your expertise. Dive into hands-on projects, stay updated on the latest industry trends, and make meaningful contributions to real-world development scenarios. Ready to shape the digital future? Apply now and let's build something extraordinary together! 
<strong>💻🚀 #LearnTek #WebDevelopment #InternshipOpportunity</strong>
                </p>
                <Button
                  style={{
                    color: "white",
                    textAlign: "left",
                    backgroundColor: "darkblue",
                    
                  }}
                  onClick={this.handleClick}
                >
          <Link className="join" to="/courseDetails"> Join now</Link>
                </Button>
              </div>
            </div>
                     {/* Android Development */}
                     <div class="col-md-6">
              <div class="icon-box" data-aos="fade-up" style={{padding:"1rem"}} data-aos-delay="100">
   
                <p align="justify" style={{ color: "white" }}>
                  <h2 style={{ color: "white" }}>           <i class="bi">
                  <Icon icon="material-symbols:android-sharp" />
                </i> Android Development</h2> We
                  provide top-notch website development services to our clients.
                  Our team of experienced developers uses the latest
                  technologies and frameworks to develop websites that are
                  responsive, fast, and secure. We can build websites of all
                  types, including e-commerce, corporate, and personal websites.
                </p>
                <Button
                  style={{
                    backgroundColor: "darkblue",
                  }}
                  onClick={this.handleClick}
              
                >
                  
          <Link className="join" to="/courseDetails"> Join now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}