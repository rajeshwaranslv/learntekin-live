// mainDashboard.js
import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux'; // Import connect from react-redux
import Home from './Components/Home';

import End from './Components/End';


class MainDashboard extends Component {
  render() {
    const { user } = this.props; // Access the user prop

    return (
      <BrowserRouter>
        <div>
          {/* Navbar */}

          <Home user={user} />
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
  user: state.auth.user, // Map the user object from Redux state to props
});

export default connect(mapStateToProps)(MainDashboard); // Connect the component to Redux store
