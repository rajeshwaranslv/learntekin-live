import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInternshipListings } from "../actions/InternshipListingAction";
import "./InternshipList.css";
import moment from "moment";

const InternshipList = () => {
  const dispatch = useDispatch();
  const { list = [] } = useSelector((state) => state.internshipList || {});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getInternshipListings());
  }, [dispatch]);

  const filteredList = list.filter((internship) =>
    internship.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="internship-list-container">
      <h1 className="internship-title">Available Internships</h1>

      {filteredList.length === 0 ? (
        <p>No internships available</p>
      ) : (
        <div className="internship-grid">
          {filteredList.map((internship) => (
            <div key={internship.id} className="internship-card">
              <h2>{internship.title}</h2>
              <p><strong>Company:</strong> {internship.company}</p>
              <p><strong>Duration:</strong> {internship.duration}</p>
              <p><strong>Stipend:</strong> {internship.stipend}</p>
              <p><strong>Location:</strong> {internship.location}</p>
              <p><strong>Eligibility:</strong> {internship.eligibility}</p>
              <p><strong>Last Date:</strong> {internship.lastDate 
                ? moment(internship.lastDate).format("YYYY-MM-DD") 
                : "Not specified"}
              </p>
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

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search internships by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
    </div>
  );
};

export default InternshipList;
