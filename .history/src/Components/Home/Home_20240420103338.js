import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { connect } from 'react-redux';
import "../App.css";

import Footer from '../Footer/Footer'
import End from "../Footer/End";
import Hero from "../About/Hero";
import { Navigate, Redirect } from "react-router";

class Home extends Component {
render() {
const { user } = this.props;
if(!user){
<Navigate to="/login"/>
}

return (
<div>
<div className="App">
<Helmet>
{/* Add your script tags here (e.g., external JavaScript files) */}
<script src="assets/vendor/purecounter/purecounter.js"></script>
<script src="assets/vendor/aos/aos.js"></script>
<script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="assets/vendor/glightbox/js/glightbox.min.js"></script>
<script src="assets/vendor/isotope-layout/isotope.pkgd.min.js"></script>
<script src="assets/vendor/swiper/swiper-bundle.min.js"></script>
<script src="assets/vendor/php-email-form/validate.js"></script>
<script src="assets/js/main.js" type="text/javascript" />
{/* End of script tags */}
</Helmet>

<Hero/>
{/* Footer */}
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
