import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInternships } from "../actions/InternshipListingAction"; // Adjusted import path

const InternshipList = () => {
  const dispatch = useDispatch();
  const { list = [] } = useSelector((state) => state.internship || {});

  useEffect(() => {
    dispatch(getInternships());
  }, [dispatch]);

  return (
    <div style={{ padding: "30px", maxWidth: "1000px", margin: "auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "40px", fontSize: "2.5rem", color: "#0a3d62" }}>
        Available Internships
      </h1>

      {list.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "18px" }}>No internships available currently.</p>
      ) : (
        list.map((internship, index) => (
          <div
            key={internship.id || index}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "20px",
              marginBottom: "30px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
            }}
          >
            {/* ✅ Always show title safely */}
            <h2 style={{ marginBottom: "10px", color: "#1e3799" }}>
              {internship.title || "Untitled Internship"}
            </h2>

            {/* ✅ Details */}
            <p><strong>Company:</strong> {internship.company || "Not Provided"}</p>
            <p><strong>Duration:</strong> {internship.duration || "Not Specified"}</p>
            <p><strong>Stipend:</strong> {internship.stipend || "Not Specified"}</p>
            <p><strong>Location:</strong> {internship.location || "Not Specified"}</p>
            <p><strong>Eligibility:</strong> {internship.eligibility || "Not Specified"}</p>

            {/* ✅ Apply Link */}
            {internship.apply ? (
              <a
                href={internship.apply}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: "15px",
                  padding: "10px 20px",
                  backgroundColor: "#079992",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "5px",
                  fontWeight: "bold",
                }}
              >
                Apply Here
              </a>
            ) : (
              <p style={{ marginTop: "10px", color: "red" }}>Apply link not available</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default InternshipList;
