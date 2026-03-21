import React, { Component } from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default class courseDetails extends Component {
  componentDidMount() {
    document.title = "Course Details";
  }

  render() {
    return (
      <section id="pricing" className="pricing section-bg">

<div className="container-fluid" data-aos="fade-up">
          <div className="section-title">
            <h2 style={{ color: "black" }}>Course Bucket List</h2>

          </div>
          
            <h3 style={{ color: "black" }}>Laravel frameworks</h3>
            <div className="row mt-4 ">
            <div className="col-lg-12 col-md-12 align-item-center">
              <div className="box" style={{backgroundColor:"black"}} data-aos="fade-up" data-aos-delay="100">
        
              
                <ul>
                  <li align="justify">
                  Laravel, a robust PHP web application framework, offered by learntekin, provides developers with an elegant and efficient platform for building modern web applications. Known for its clean syntax and adherence to the model-view-controller (MVC) architectural pattern, Laravel simplifies the development process while ensuring scalability and maintainability. The framework comes equipped with a range of built-in features, including routing, templating, and authentication, accelerating the development cycle. Notably, Laravel incorporates Eloquent, an object-relational mapping (ORM) system, facilitating seamless database interactions. With its commitment to contemporary development practices such as dependency injection, testing, and expressive routing, Laravel has emerged as a favored choice among developers, offering a comprehensive and streamlined solution for creating sophisticated web applications.
                  </li>
                  <li align="justify">
                    <h6>Skills</h6>
                    <i className="fa-brands fa-html5 " style={{padding:"10px",fontSize:"100px"}}></i>
                    <i className="fa-brands fa-css3-alt" style={{color: "#00cc6a",padding:"10px",fontSize:"100px"}}></i>
                    <i className="fa-brands fa-js" style={{color: "#F0DB4F",padding:"10px",fontSize:"100px"}}></i>
                    <i className="fa-brands fa-bootstrap" style={{color: "voilet",padding:"10px",fontSize:"100px"}}></i>
                    <i className="fa-brands fa-php" style={{color: "#474A8A",padding:"10px",fontSize:"100px"}}></i>
 <Tabs
      defaultActiveKey="1"
      id="fill-tab-example"
      className="mb-3"
      fill
    >
      <Tab eventKey="1" title="One Month" >
      <h6>Features</h6>
        <li><span style={{fontSize:"50px"}}>.</span>
         It covers 4 mini projects  
        </li>
          <li><span style={{fontSize:"50px"}}>.</span>
         It covers 2 milestone projects  
        </li>
          <li><span style={{fontSize:"50px"}}>.</span>
         Training only by industrial expects who have relavent experiance in that paticular field 
        </li>
          <li><span style={{fontSize:"50px"}}>.</span>
         Support assitance will be provide 
        </li>
        <li><span style={{fontSize:"50px"}}>.</span>
         No jobs assitance and job guarentee
        </li>
       <Button
                  style={{
                    color: "white",
                    textAlign: "left",
                    backgroundColor: "darkblue",
                    
                  }}
                 
                >
          <Link className="join" to="/courseDetails" > Buy at &#x20b9;
299 INR</Link>
                </Button> 
      </Tab>
      <Tab eventKey="3" title="Three Month">
      <h6>Features</h6>
       <li><span style={{fontSize:"50px"}}>.</span>
           It covers 8 mini projects  
        </li>
        <li><span style={{fontSize:"50px"}}>.</span>
         It covers 4 milestone projects  
        </li>
          <li><span style={{fontSize:"50px"}}>.</span>
         Training only by industrial expects who have relavent experiance in that paticular field 
        </li>
          <li><span style={{fontSize:"50px"}}>.</span>
         Support assitance will be provide 
        </li>
        <li><span style={{fontSize:"50px"}}>.</span>
          Job assitance will be provide
        </li>
        <Button
                  style={{
                    color: "white",
                    textAlign: "left",
                    backgroundColor: "darkblue",
                    
                  }}
                 
                >
          <Link className="join" to="/courseDetails" > Buy at &#x20b9;
699 INR</Link>
                </Button>
      </Tab>
      <Tab eventKey="6" title="Six Month">
      <h6>Features</h6>
        <li><span style={{fontSize:"50px"}}>.</span>
           It covers 16 mini projects  
        </li>
        <li><span style={{fontSize:"50px"}}>.</span>
         It covers 8 milestone projects  
        </li>
          <li><span style={{fontSize:"50px"}}>.</span>
         Training only by industrial expects who have relavent experiance in that paticular field 
        </li>
          <li><span style={{fontSize:"50px"}}>.</span>
         Support assitance will be provide 
        </li>
        <li><span style={{fontSize:"50px"}}>.</span>
          Job assitance will be provide
        </li>
        <li><span style={{fontSize:"50px"}}>.</span>
          Stipend will be provide based on kpi(Key Performance Indicator) 
        </li>
        <Button
                  style={{
                    color: "white",
                    textAlign: "left",
                    backgroundColor: "darkblue",
                    
                  }}
                 
                >
          <Link className="join" to="/courseDetails" > Buy at &#x20b9;
1299 INR</Link>
                </Button>
        
      </Tab>
      
    </Tabs>

  


                  </li>
                  <p align="justify">
                    {" "}
                    <b>
                    </b>
                  </p>
                </ul>
              </div>
            </div>
            </div>



        </div>
      </section>
    );
  }
}

