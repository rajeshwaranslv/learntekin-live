import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { connect } from 'react-redux';
import { Navigate, Link } from "react-router-dom";
import "../App.css";

import Footer from '../Footer/Footer';

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
          gap: '40px',
        }}>
          <h1 style={{ color: '#00796b', fontSize: '36px' }}>LearnTEK.In Internship Center</h1>

          <div style={{
            display: 'flex',
            gap: '40px',
          }}>
            <Link to="/InternshipList" style={{
              padding: '15px 30px',
              backgroundColor: '#00796b',
              color: '#ffffff',
              fontSize: '20px',
              fontWeight: 'bold',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'background 0.3s',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#005f56'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#00796b'}
            >
              Internship List
            </Link>

            <Link to="/InternshipApplication" style={{
              padding: '15px 30px',
              backgroundColor: '#00796b',
              color: '#ffffff',
              fontSize: '20px',
              fontWeight: 'bold',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'background 0.3s',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#005f56'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#00796b'}
            >
              Internship Action Center
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer id="footer">
          <div className="footer-top">
            <Footer />
          </div>
        </footer>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Home);
import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { connect } from 'react-redux';
import { Navigate, Link } from "react-router-dom";
import "../App.css";

import Footer from '../Footer/Footer';

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
          gap: '40px',
        }}>
          <h1 style={{ color: '#00796b', fontSize: '36px' }}>LearnTEK.In Internship Center</h1>

          <div style={{
            display: 'flex',
            gap: '40px',
          }}>
            <Link to="/InternshipList" style={{
              padding: '15px 30px',
              backgroundColor: '#00796b',
              color: '#ffffff',
              fontSize: '20px',
              fontWeight: 'bold',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'background 0.3s',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#005f56'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#00796b'}
            >
              Internship List
            </Link>

            <Link to="/InternshipApplication" style={{
              padding: '15px 30px',
              backgroundColor: '#00796b',
              color: '#ffffff',
              fontSize: '20px',
              fontWeight: 'bold',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'background 0.3s',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#005f56'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#00796b'}
            >
              Internship Action Center
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer id="footer">
          <div className="footer-top">
            <Footer />
          </div>
        </footer>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Home);
