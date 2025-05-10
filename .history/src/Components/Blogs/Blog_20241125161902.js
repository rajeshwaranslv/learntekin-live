import React, { Component } from "react";
import "./blog.css";
import { Link } from "react-router-dom";

export default class Blogs extends Component {
  componentDidMount() {
    document.title = "Blogs";
  }

  render() {
    return (
      <section id="blog" className="blog">
        <div
          className="container"
          style={{ marginTop: "130px" }}
          data-aos="fade-up"
        >
          <div className="row">
            <div className="col-lg-8 entries">
              {/* Blog 2 */}
              <article className="entry">
                <div className="entry-img">
                  <img
                    src="assets/img/blog/blog-2.png"
                    alt="Blog 2"
                    className="img-fluid"
                  />
                </div>
                <h2 className="entry-title">
                  <a href="https://app.outlier.ai/expert/opportunities?utm_source=referral&referring_user=66f4d02c6030c2dbfab6f2c9">
                    Refer your friends!
                  </a>
                </h2>
                <div className="entry-meta">
                  <ul>
                    <li className="d-flex align-items-center">
                      <i className="bi bi-person"></i>{" "}
                      <Link to="/">LearnTEKIN Team</Link>
                    </li>
                    <li className="d-flex align-items-center">
                      <i className="bi bi-clock"></i>{" "}
                      <Link to="/">
                        <time datetime="2024-11-25">Nov 25, 2024</time>
                      </Link>
                    </li>
                    <li className="d-flex align-items-center">
                      <i className="bi bi-chat-dots"></i>{" "}
                      <Link to="/">0 Comments</Link>
                    </li>
                  </ul>
                </div>
                <div className="entry-content">
                  <p align="justify">
                    A referral candidate must not have already applied to a job
                    with Outlier, have been referred to Outlier in the past, or
                    already be an existing user on Outlier. If any of these
                    restrictions apply to a candidate who uses your referral
                    link, they will still be considered as a normal applicant,
                    but you will not be eligible to receive a referral reward
                    from them.
                  </p>
                  <div className="read-more">
                    <a
                      href="https://topmate.io/rajeshwaran_slv/1291172/pay"
                      target="_blank"
                      className="button"
                    >
                      Apply now
                    </a>
                  </div>
                </div>
              </article>

              {/* Blog 3 */}
              <article className="entry">
                <div className="entry-img">
                  <img
                    src="assets/img/blog/blog-3.png"
                    alt="Blog 3"
                    className="img-fluid"
                  />
                </div>
                <h2 className="entry-title">
                  <a href="https://app.outlier.ai/expert/opportunities?utm_source=referral&referring_user=66f4d02c6030c2dbfab6f2c9">
                    Refer your friends!
                  </a>
                </h2>
                <div className="entry-meta">
                  <ul>
                    <li className="d-flex align-items-center">
                      <i className="bi bi-person"></i>{" "}
                      <Link to="/">LearnTEKIN Team</Link>
                    </li>
                    <li className="d-flex align-items-center">
                      <i className="bi bi-clock"></i>{" "}
                      <Link to="/">
                        <time datetime="2024-11-25">Nov 25, 2024</time>
                      </Link>
                    </li>
                    <li className="d-flex align-items-center">
                      <i className="bi bi-chat-dots"></i>{" "}
                      <Link to="/">0 Comments</Link>
                    </li>
                  </ul>
                </div>
                <div className="entry-content">
                  <p align="justify">
                    Hey! I’ve been using Topmate to connect 1:1 with my
                    followers. And I’m loving it! I think your followers will
                    love to connect with you. You can use my link to signup and
                    get 3 months free!
                  </p>
                  <div className="read-more">
                    <a
                      href="https://topmate.io/join/rajeshwaran_slv"
                      target="_blank"
                      className="button"
                    >
                      Apply now
                    </a>
                  </div>
                </div>
              </article>

              {/* Referral Details */}
              <article className="entry">
                <div className="entry-img">
                  <img
                    src="assets/img/blog/blog-4.png"
                    alt="Referral Programs"
                    className="img-fluid"
                  />
                </div>

                <h2 className="entry-title">
                  <a href="/Products">LearnTEKIN Referral Programs</a>
                </h2>
                <div className="entry-content">
                  <p align="justify">
                    LearnTEKIN offers exciting referral opportunities! Refer
                    your friends, colleagues, or followers to join our
                    fellowship or internship programs and earn rewards. Check
                    the details below: (For Fellowship & Internship registration link, "Go to Product Section" )
                  </p>

                  {/* Fellowship Referral Table */}
                  <h4>Fellowship Referral Program</h4>
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Number of Referrals</th>
                        <th>Reward Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>50 or more</td>
                        <td>5,000</td>
                      </tr>
                      <tr>
                        <td>25 or more</td>
                        <td>2,000</td>
                      </tr>
                      <tr>
                        <td>13 or more</td>
                        <td>1,000</td>
                      </tr>
                      <tr>
                        <td>7 or more</td>
                        <td>600</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Internship Referral Table */}
                  <h4>Internship Referral Program</h4>
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Number of Referrals</th>
                        <th>Reward Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>50 or more</td>
                        <td>200</td>
                      </tr>
                      <tr>
                        <td>25 or more</td>
                        <td>100</td>
                      </tr>
                      <tr>
                        <td>13 or more</td>
                        <td>50</td>
                      </tr>
                      <tr>
                        <td>7 or more</td>
                        <td>25</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </article>

              <article className="entry">
                <div className="entry-img">
                  <img
                    src="assets/img/blog/blog-5.png"
                    alt="Referral Programs"
                    className="img-fluid"
                  />
                </div>
                
                <h2 className="entry-title">
                  <a href="/Products">LearnTEKIN Referral Programs</a>
                </h2>
                <div className="entry-content">
                  <p align="justify">
                    LearnTEKIN offers exciting referral opportunities! Refer
                    your friends, colleagues, or followers to utilize our
                    projects or services and earn rewards. Check
                    the details below: (For Services & Projects registration link, "Go to Service Section" )
                  </p>

                  {/* Project Referral Table */}
                  <h4>Projects Referral Program</h4>
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Number of Referrals</th>
                        <th>Reward Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>2</td>
                        <td>500</td>
                      </tr>
                      <tr>
                        <td>1 </td>
                        <td>100</td>
                      </tr>
                 
                    </tbody>
                  </table>

                  {/* Services Referral Table */}
                  <h4>Services Referral Program</h4>
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Number of Referrals</th>
                        <th>Reward Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>10 or more</td>
                        <td>100</td>
                      </tr>
                      <tr>
                        <td>5 or more</td>
                        <td>50</td>
                      </tr>
                      <tr>
                        <td>2 or more</td>
                        <td>10</td>
                      </tr>
               
                    </tbody>
                  </table>
                </div>
              </article>
            </div>
            <div className="col-lg-4">
  <div className="sidebar">
    {/* Search */}
    <h3 className="sidebar-title">Search</h3>
    <div className="sidebar-item search-form">
      <form action="">
        <input type="text" />
        <button type="submit" className="button">
          <i className="bi bi-search"></i>
        </button>
      </form>
    </div>

    {/* Categories */}
    <h3 className="sidebar-title">Categories</h3>
    <div className="sidebar-item categories">
      <ul>
        <li>
          <a  className="button" href="#">
            Fellowship <span>(25)</span>
          </a>
        </li>
        <li>
          <a className="button" href="#">
            Finance Frenzy <span>(12)</span>
          </a>
        </li>
        <li>
          <a className="button" href="#">
            Learn TEK In <span>(5)</span>
          </a>
        </li>
        <li>
          <a className="button" href="#">
            Clients <span>(22)</span>
          </a>
        </li>
      </ul>
    </div>

    {/* Recent Posts */}
    <h3 className="sidebar-title">Recent Posts</h3>
    <div className="sidebar-item recent-posts">
        <p>No post available</p>
    </div>

    {/* Tags */}
    <h3 className="sidebar-title">Tags</h3>
    <div className="sidebar-item tags">
      <ul>
        <li>
          <a className="button" href="#">App</a>
        </li>
        <li>
          <a className="button" href="#">IT</a>
        </li>
        <li>
          <a className="button" href="#">Business</a>
        </li>
        <li>
          <a className="button" href="#">Mac</a>
        </li>
        <li>
          <a className="button" href="#">Design</a>
        </li>
        <li>
          <a className="button" href="#">Office</a>
        </li>
        <li>
          <a  className="button" href="#">Creative</a>
        </li>
        <li>
          <a className="button" href="#">Studio</a>
        </li>
        <li>
          <a className="button" href="#">Smart</a>
        </li>
        <li>
          <a className="button" href="#">Tips</a>
        </li>
        <li>
          <a className="button" href="#">Marketing</a>
        </li>
      </ul>
    </div>
  </div>
</div>

          </div>
        </div>
      </section>
    );
  }
}
