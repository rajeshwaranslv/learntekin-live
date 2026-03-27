import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useHistory, useLocation } from "react-router-dom";
import { message } from "antd";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useAuth } from "../auth/authContext";
import NotificationBell from "./NotificationBell";
import "./Navbar.css";

function AppNavbar() {
  const [expanded, setExpanded] = useState(false);
  const navShellRef = useRef(null);
  const { currentUser, logout, sendPasswordReset } = useAuth();
  const history = useHistory();
  const location = useLocation();

  const currentPath = location.pathname.toLowerCase();
  const isProductsRoute = [
    "/products",
    "/eseva",
    "/coursedetails",
    "/products/pc-factory",
    "/products/lms",
    "/products/library",
  ].includes(currentPath);

  const isServicesRoute = ["/services", "/services/youtube-promo"].includes(currentPath);

  useEffect(() => {
    setExpanded(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleOutsideTap = (event) => {
      if (!expanded) {
        return;
      }

      if (!window.matchMedia("(max-width: 991.98px)").matches) {
        return;
      }

      const navShell = navShellRef.current;
      if (!navShell) {
        return;
      }

      const target = event.target;
      if (target instanceof Node && !navShell.contains(target)) {
        setExpanded(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setExpanded(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideTap);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideTap);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [expanded]);

  const closeMenu = () => {
    setExpanded(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = async () => {
    try {
      await logout();
      message.success("Logged out successfully.");
      closeMenu();
      history.push("/login");
    } catch (error) {
      message.error(error.message || "Failed to logout.");
    }
  };

  const handlePasswordReset = async () => {
    if (!currentUser?.email) {
      message.warning("No account email found for password reset.");
      return;
    }

    try {
      await sendPasswordReset(currentUser.email);
      message.success("Password reset email sent.");
      closeMenu();
    } catch (error) {
      message.error(error.message || "Unable to send password reset email.");
    }
  };

  return (
    <header
      id="header"
      className="fixed-top d-flex align-items-center nav-modern-header"
    >
      <div className="container-fluid d-flex align-items-center nav-main-row">
        <h1 className="logo me-auto nav-logo-wrap">
          <Link to="/" className="nav-brand-link" onClick={closeMenu}>
            <img
              src="/assets/img/apple-touch-icon.png"
              width="35"
              height="40"
              className="d-inline-block align-top nav-brand-icon"
              alt="Learn TEK In"
            />
            <span className="brand">LearnTEK<span className="in">.Innovations</span></span>
          
          </Link>
          <span className="nav-tagline">We explore the world!</span>
        </h1>

        <Navbar
          ref={navShellRef}
          collapseOnSelect
          expanded={expanded}
          onToggle={(nextExpanded) => setExpanded(Boolean(nextExpanded))}
          onSelect={closeMenu}
          expand="lg"
          bg="light"
          variant="light"
          className="nav-shell"
        >
          <Container fluid className="nav-container">
            <Navbar.Toggle
              aria-controls="responsive-navbar-nav"
              aria-label="Toggle navigation menu"
              className="ms-auto nav-toggle"
            />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="ms-auto nav-links">
                <Nav.Link
                  as={NavLink}
                  exact
                  to="/About"
                  activeClassName="nav-link-active"
                  onClick={closeMenu}
                  className="nav-route-link"
                >
                  <span className="nav-link-label">About</span>
                </Nav.Link>
                <NavDropdown
                  title={<span className="nav-link-label">Services</span>}
                  id="services-dropdown"
                  className={`nav-route-link nav-dropdown ${
                    isServicesRoute ? "nav-link-active" : ""
                  }`.trim()}
                  active={isServicesRoute}
                >
                  <NavDropdown.Item
                    as={NavLink}
                    exact
                    to="/Services"
                    activeClassName="dropdown-item-active"
                    onClick={closeMenu}
                  >
                    All Services
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    as={NavLink}
                    exact
                    to="/Services/youtube-promo"
                    activeClassName="dropdown-item-active"
                    onClick={closeMenu}
                  >
                    Promotional Services
                  </NavDropdown.Item>
                </NavDropdown>

                <NavDropdown
                  title={<span className="nav-link-label">Products</span>}
                  id="products-dropdown"
                  className={`nav-route-link nav-dropdown ${
                    isProductsRoute ? "nav-link-active" : ""
                  }`.trim()}
                  active={isProductsRoute}
                >
                  <NavDropdown.Item
                    as={NavLink}
                    exact
                    to="/Products"
                    activeClassName="dropdown-item-active"
                    onClick={closeMenu}
                  >
                    Products
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={NavLink}
                    exact
                    to="/eseva"
                    activeClassName="dropdown-item-active"
                    onClick={closeMenu}
                  >
                    ESeva
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    as={NavLink}
                    exact
                    to="/Products/pc-factory"
                    activeClassName="dropdown-item-active"
                    onClick={closeMenu}
                  >
                    PC Factory
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={NavLink}
                    exact
                    to="/Products/lms"
                    activeClassName="dropdown-item-active"
                    onClick={closeMenu}
                  >
                    LMS
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={NavLink}
                    exact
                    to="/Products/library"
                    activeClassName="dropdown-item-active"
                    onClick={closeMenu}
                  >
                    Library
                  </NavDropdown.Item>
                </NavDropdown>

                <Nav.Link
                  as={NavLink}
                  exact
                  to="/Blogs"
                  activeClassName="nav-link-active"
                  onClick={closeMenu}
                  className="nav-route-link"
                >
                  <span className="nav-link-label">Blogs</span>
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  exact
                  to="/Careers"
                  activeClassName="nav-link-active"
                  onClick={closeMenu}
                  className="nav-route-link"
                >
                  <span className="nav-link-label">Careers</span>
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  exact
                  to="/Contact"
                  activeClassName="nav-link-active"
                  onClick={closeMenu}
                  className="nav-route-link"
                >
                  <span className="nav-link-label">Contact</span>
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  exact
                  to="/faq"
                  activeClassName="nav-link-active"
                  onClick={closeMenu}
                  className="nav-route-link"
                >
                  <span className="nav-link-label">FAQ</span>
                </Nav.Link>

                {currentUser && <NotificationBell />}

                {currentUser ? (
                  <NavDropdown
                    title={<span className="nav-link-label">Account</span>}
                    id="account-dropdown"
                    className="nav-route-link nav-dropdown"
                    align="end"
                  >
                    <NavDropdown.Item disabled>
                      {currentUser.email}
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handlePasswordReset}>
                      Reset Password
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={handleLogout}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <Nav.Link
                    as={NavLink}
                    exact
                    to="/login"
                    activeClassName="nav-link-active"
                    onClick={closeMenu}
                    className="nav-route-link nav-auth-link"
                  >
                    <span className="nav-link-label">Login</span>
                  </Nav.Link>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    </header>
  );
}

export default React.memo(AppNavbar);
