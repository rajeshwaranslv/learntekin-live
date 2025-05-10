
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
