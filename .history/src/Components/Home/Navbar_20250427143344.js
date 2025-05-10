import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
export default class NAVIE extends Component {
  handleClick = () => {
    // Scroll to the top of the page
    window.scrollTo(0, 0);
  };
  render() {
    function refreshPage() {
      window.location.reload(true);
    }

    return (
      <header id="header" class="fixed-top d-flex align-items-center">
        <div class="container-fluid d-flex align-items-center">
          <h1 class="logo  me-auto">
          <Link to="/">
              <img
                src=".\assets\img\apple-touch-icon.png"
                width="35"
                height="40"
                style={{
                  position: "relative",
                  right: "0.5rem",
                  top: "0.2rem",
                 
                }}
                className="d-inline-block align-top ml-8"
                alt="React Bootstrap logo"
              />
            </Link>
            <Link to="/" onClick={this.handleClick}><span className="brand">LearnTEK</span></Link><span className="in">.In</span>
            <br />
            <span
              style={{
                fontSize: "10px",
                position: "relative",
                bottom: "20px",
                right: "8px",
              }}
            >
             We explore the world!
            </span>
          </h1>
          <Navbar collapseOnSelect expand="lg " bg="dark" variant="dark">
      <Container className="m-3">


        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          className="ms-auto float-sm-left  float-md-left float-lg-left float-xl-left"
        />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
    
           
            <Nav.Link href="#InternshipList">
              <Link className="nav-link" to="/InternshipList" onClick={this.handleClick}>
                <h6>InternshipList</h6>
              </Link>
            </Nav.Link>
            <Nav.Link href="#InternshipApplication">
              <Link className="nav-link" to="/InternshipApplication" onClick={this.handleClick}>
                <h6>InternshipApplication</h6>
              </Link>
            </Nav.Link>
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
        </div>
      </header>
    );
  }
}
