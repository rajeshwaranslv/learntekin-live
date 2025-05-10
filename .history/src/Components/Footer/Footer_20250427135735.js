import React, { Component } from "react";

export default class Footer extends Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">

          {/* Internship List Section */}
          <div className="col-lg-6 col-md-6 footer-links mt-4">
            <h4 style={{ color: 'black' }}>Internship List</h4>
            <ul>
              <li><i className="bx bx-chevron-right"></i> <a href="/internships/frontend">Frontend Developer Internship</a></li>
              <li><i className="bx bx-chevron-right"></i> <a href="/internships/backend">Backend Developer Internship</a></li>
              <li><i className="bx bx-chevron-right"></i> <a href="/internships/fullstack">Full Stack Developer Internship</a></li>
              <li><i className="bx bx-chevron-right"></i> <a href="/internships/data-science">Data Science Internship</a></li>
              <li><i className="bx bx-chevron-right"></i> <a href="/internships/devops">DevOps Internship</a></li>
            </ul>
          </div>

          {/* Internship Application Center Section */}
          
        </div>
      </div>
    );
  }
}
