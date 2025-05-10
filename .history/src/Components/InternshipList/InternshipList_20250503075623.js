<div className="center-container">
  <h1 className="heading">Available Internships</h1>

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

  {/* Internship Table */}
  <div className="table-container">
    {filteredList.length === 0 ? (
      <p className="no-results">No internships match your search.</p>
    ) : (
      <table className="internship-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Company</th>
            <th>Duration</th>
            <th>Stipend</th>
            <th>Location</th>
            <th>Eligibility</th>
            <th>Last Date</th>
            <th>Apply</th>
          </tr>
        </thead>
        <tbody>
          {filteredList.map((internship) => (
            <tr key={internship.id}>
              <td>{internship.title}</td>
              <td>{internship.company}</td>
              <td>{internship.duration}</td>
              <td>{internship.stipend}</td>
              <td>{internship.location}</td>
              <td>{internship.eligibility}</td>
              <td>
                {internship.lastDate
                  ? moment(internship.lastDate).format("YYYY-MM-DD")
                  : "Not specified"}
              </td>
              <td>
                <a
                  href={internship.apply}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button"
                >
                  Apply
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
</div>
