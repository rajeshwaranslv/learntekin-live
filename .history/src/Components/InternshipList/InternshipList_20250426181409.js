import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInternships } from "src/Components/actions/InternshipListingAction"; // ✅ Correct import

const InternshipList = () => {
  const dispatch = useDispatch();
  const { list = [] } = useSelector((state) => state.internship || {});

  useEffect(() => {
    dispatch(getInternships());
  }, [dispatch]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Available Internships</h1>
      {list.length === 0 ? (
        <p>No internships available</p>
      ) : (
        list.map((internship) => (
          <div key={internship.id} style={{ marginBottom: 20 }}>
            <h2>{internship.title}</h2>
            <p><strong>Company:</strong> {internship.company}</p>
            <p><strong>Duration:</strong> {internship.duration}</p>
            <p><strong>Stipend:</strong> {internship.stipend}</p>
            <p><strong>Location:</strong> {internship.location}</p>
            <p><strong>Eligibility:</strong> {internship.eligibility}</p>
            <a href={internship.apply} target="_blank" rel="noopener noreferrer">Apply Here</a>
            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default InternshipList;
