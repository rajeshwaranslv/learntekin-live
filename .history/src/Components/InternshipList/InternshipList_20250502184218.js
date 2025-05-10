import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInternshipListings } from "../actions/InternshipListingAction";
import "./InternshipList.css"; // Import the new CSS

const InternshipList = () => {
  const dispatch = useDispatch();
  const { list = [] } = useSelector((state) => state.internshipList || {});

  useEffect(() => {
    dispatch(getInternshipListings());
  }, [dispatch]);

  return (
    <div className="internship-list-container">
      <h1 className="internship-title">Available Internships</h1>
      {list.length === 0 ? (
        <p>No internships available</p>
      ) : (
        <div className="internship-grid">
          {list.map((internship) => (
            <div key={internship.id} className="internship-card">
              <h2>{internship.title}</h2>
              <p><strong>Company:</strong> {internship.company}</p>
              <p><strong>Duration:</strong> {internship.duration}</p>
              <p><strong>Stipend:</strong> {internship.stipend}</p>
              <p><strong>Location:</strong> {internship.location}</p>
              <p><strong>Eligibility:</strong> {internship.eligibility}</p>
              <p><strong>Last:</strong>{internship.LastDate}</p>
              
              <a 
                href={internship.apply} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="button"
              >
                Apply Here
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InternshipList;
