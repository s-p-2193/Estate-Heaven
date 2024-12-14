import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import Integrity from "../../img/images/AboutUs/Integrity.png";
import Innovation from "../../img/images/AboutUs/Innovation.png";
import Customer from "../../img/images/AboutUs/Customer.png";
import Mission from "../../img/images/AboutUs/goal.png";
import Sahil from "../../img/images/AboutUs/Sahil.jpg";
import "../../styles/AboutUs.css";

const AboutUs: React.FC = () => {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>About Us</h1>
          <p>We bring simplicity and trust to your real estate journey.</p>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="our-mission">
        <div className="container">
          <h2>Our Mission</h2>
          <div className="mission-content-wrapper">
            <img src={Mission} alt="Mission" className="image-responsive" />
            <p>
              At Estate Heaven, we aim to revolutionize how you buy, sell, or
              rent property. Our focus is to make the process seamless with a
              trusted platform that bridges buyers and sellers effortlessly.
            </p>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="our-team">
        <div className="container">
          <h2>Meet the Team</h2>
          <div className="team-members">
            <div className="team-member">
              <img src={Sahil} alt="CEO" />
              <h3>Sahil</h3>
              <p>CEO & Founder</p>
            </div>
            <div className="team-member">
              <img src={Sahil} alt="CTO" />
              <h3>Sahil</h3>
              <p>CTO & Co-Founder</p>
            </div>
            <div className="team-member">
              <img src={Sahil} alt="<Marketing>" />
              <h3>Sahil</h3>
              <p>Head of Marketing</p>
            </div>
            <div className="team-member">
              <img src={Sahil} alt="Project Manager" />
              <h3>Sahil</h3>
              <p>Project Manager</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Core Values Section */}
      <section className="core-values">
        <div className="container">
          <h2>Our Core Values</h2>
          <div className="values-list">
            <div className="value-item">
              <img src={Integrity} alt="Integrity" />
              <h4>Integrity</h4>
              <p>We uphold honesty in every transaction.</p>
            </div>
            <div className="value-item">
              <img src={Customer} alt="Customer First" />
              <h4>Customer First</h4>
              <p>Your satisfaction guides our every move.</p>
            </div>
            <div className="value-item">
              <img src={Innovation} alt="Innovation" />
              <h4>Innovation</h4>
              <p>We continuously evolve to meet your needs.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default AboutUs;
