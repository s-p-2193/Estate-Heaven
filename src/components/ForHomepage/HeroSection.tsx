import React, { useState } from 'react';
import '../../styles/Homepage/HeroSection.css'; // Importing the CSS file for styling


const HeroSection: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState('buy'); // State to track buy/rent option

  return (
    <section className="hero-section">
      <div className="image-overlay"></div> {/* Overlay to dull the image */}
      <div className="hero-content">
        <h1>Welcome to Estate Heaven</h1>
        <p>Your journey to finding the perfect home starts here. Discover, Explore, and Fall in Love with your next home.</p>
      </div>
    </section>
  );
};

export default HeroSection;
