import React from 'react';
import Navbar from '../Navbar';
import HeroSection from '../ForHomepage/HeroSection';
import PropertySection from '../ForHomepage/PropertySection';
import FeaturesSection from '../ForHomepage/FeaturesSection';
import TestimonialsSection from '../ForHomepage/TestimonialsSection';
import Footer from '../Footer';

const Homepage: React.FC = () => {
  // Sample property data to demonstrate multiple PropertyCard components


  return (
    <>
      {/* Navbar is usually at the top of the page */}
      <Navbar />

      {/* Hero section with the search bar */}
      <HeroSection />

      {/* Property Cards Section */}
     
      <PropertySection/>

      {/* Features Section */}
      <FeaturesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Footer at the bottom of the page */}
      <Footer />
    </>
  );
};

export default Homepage;
