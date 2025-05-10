// src/Components/Home/Home.js

import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { connect } from 'react-redux';
import { Navigate, Link } from "react-router-dom";

import Footer from '../Footer/Footer';
import "../App.css";

class Home extends Component {
  render() {
    const { user } = this.props;

    if (!user) {
      return <Navigate to="/login" />;
    }

    return (
      <div className="App">
        {/* Helmet scripts */}
        <Helmet>
          <script src="assets/vendor/purecounter/purecounter.js"></script>
          <script src="assets/vendor/aos/aos.js"></script>
          <script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
          <script src="assets/vendor/glightbox/js/glightbox.min.js"></script>
          <script src="assets/vendor/isotope-layout/isotope.pkgd.min.js"></script>
          <script src="assets/vendor/swiper/swiper-bundle.min.js"></script>
          <script src="assets/vendor/php-email-form/validate.js"></script>
          <script src="assets/js/main.js" type="text/javascript" />
        </Helmet>

        {/* Centered Section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '80vh',
          gap: '30px',
        }}>
          <h1 style={{ color: '#00796b' }}>Welcome to LearnTEK.In Internships!</h1>
          <nav>
            <ul style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              padding: 0,
              margin: 0,
              fontSize: '20px',
            }}>
              <li>
                <Link to="/InternshipList" style={{ textDecoration: 'none', color: '#00796b', fontWeight: 'bold' }}>
                  View Internship List
                </Link>
              </li>
              <li>
                <Link to="/InternshipApplication" style={{ textDecoration: 'none', color: '#00796b', fontWeight: 'bold' }}>
                  Apply for Internship
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Home);

        