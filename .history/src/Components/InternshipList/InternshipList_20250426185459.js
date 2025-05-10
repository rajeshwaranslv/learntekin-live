
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
