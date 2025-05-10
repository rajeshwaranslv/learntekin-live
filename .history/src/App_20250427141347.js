// Packages used
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Home/Home";
import InternshipList from "./Internship/InternshipList";
import InternshipApplication from "./Internship/InternshipApplication";
import Navbar from "./Navbar/Navbar";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar /> {/* Always show the navbar */}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/InternshipList" element={<InternshipList />} />
          <Route path="/InternshipApplication" element={<InternshipApplication />} />
          {/* Add other routes here as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
