// mainDashboard.js
import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // use Routes instead of Switch in react-router-dom v6
import { connect } from 'react-redux';
import Home from './Components/Home';
import End from './Components/End';
import Footer from './Footer/Footer'; // You forgot to import Footer!

// Import your new pages here
import InternshipList from './Components/InternshipList';
import InternshipApplication from './Components/InternshipApplication';

class MainDashboard extends Component {
  render() {
    const { user } = this.props;

    return (
      <BrowserRouter>
        <div>
          {/* Routes Section */}
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/internshiplist" element={<InternshipList />} />
            <Route path="/internshipapplication" element={<InternshipApplication />} />
          </Routes>

          {/* Footer */}
          <footer id="footer">
            <div className="footer-top">
              <Footer />
            </div>
            <End />
          </footer>

          {/* Back to top button */}
          <a href="#" className="back-to-top d-flex align-items-center justify-content-center">
            <i className="bi bi-arrow-up-short"></i>
          </a>
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(MainDashboard);
