import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { connect } from 'react-redux';
import { Navigate } from "react-router-dom"; // Correct import
import "../App.css";

import Footer from '../Footer/Footer';
import End from "../Footer/End";
import { Link } from 'react-router-dom'; // Add Link for navigation

class Home extends Component {
  render() {
    const { user } = this.props;

    if (!user) {
      return <Navigate to="/login" />; // Make sure you RETURN Navigate
    }

    return (
      <div>
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

          {/* Centered Internship Navigation */}
          <header style={{ background: '#fff', padding: '20px 0', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{
              maxWidth: '1200px',
              margin: '0 auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <nav>
                <ul style={{
                  listStyle: 'none',
                  display: 'flex',
                  gap: '40px',
                  margin: 0,
                  padding: 0,
                  fontSize: '18px',
                }}>
                  <li><Link to="/internshiplist" style={{ textDecoration: 'none', color: '#00796b' }}>Internship List</Link></li>
                  <li><Link to="/internshipapplication" style={{ textDecoration: 'none', color: '#00796b' }}>Internship Application</Link></li>
                </ul>
              </nav>
            </div>
          </header>

          {/* Hero section */}
          <div>
            {/* Your Hero component (if you have one) */}
            {/* Example: <Hero /> */}
          </div>

          {/* Footer section */}
          <footer id="footer">
            <div className="footer-top">
              <Footer />
            </div>
            <End />
          </footer>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Home);
