// src/Components/Footer/Footer.js

import React from 'react';

function Footer() {
  return (
    <footer style={{ backgroundColor: '#00796b', color: '#fff', padding: '20px 0', textAlign: 'center' }}>
      <div>
        <p>© {new Date().getFullYear()} LearnTEK.In | All Rights Reserved</p>
      </div>
    </footer>
  );
}

export default Footer;
