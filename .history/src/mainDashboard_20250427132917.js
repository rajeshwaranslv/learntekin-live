// mainDashboard.js
class MainDashboard extends Component {
  render() {
    const { user } = this.props;

    return (
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
    );
  }
}
