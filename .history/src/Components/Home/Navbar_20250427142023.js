// src/Components/Home/Navbar.js

import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <header style={{ background: '#00796b', padding: '10px 0', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px'
      }}>
        <div>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '24px', fontWeight: 'bold' }}>
            LearnTEK.In
          </Link>
        </div>
        <nav>
          <ul style={{
            listStyle: 'none',
            display: 'flex',
            gap: '20px',
            margin: 0,
            padding: 0,
          }}>
            <li>
              <Link to="/InternshipList" style={{ color: 'white', textDecoration: 'none' }}>Internships</Link>
            </li>
            <li>
              <Link to="/InternshipApplication" style={{ color: 'white', textDecoration: 'none' }}>Apply</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;

                