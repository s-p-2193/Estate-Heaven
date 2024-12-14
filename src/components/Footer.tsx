import React from 'react';
import '../styles/Footer.css';
import { Link  } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3>Estate Heaven</h3>
          <p>Your dream home is just a click away.</p>
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/search">Search Properties</Link>
          <Link to="/list">List Property</Link>
          <Link to="/aboutus">About Us</Link>
        </div>
        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p>Email: info@estateheaven.com</p>
          <p>Phone: +123 456 7890</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Estate Heaven. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
