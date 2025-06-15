import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="container">
      <div className="footer">
      	
      	<p>&copy; {new Date().getFullYear()} WMK Furniture. All rights reserved. Made with ♥️ by Shrikhatushyamji Digital</p>
      </div>
      </div>
    </footer>
  );
};

export default Footer;
