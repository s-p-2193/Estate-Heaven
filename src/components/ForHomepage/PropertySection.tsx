import React, { useState } from 'react';
import '../../styles/Homepage/PropertySection.css'; // Import the CSS styles
import { FaBed, FaBath, FaRulerCombined, FaCouch, FaHeart, FaMapMarkerAlt, FaUtensils } from 'react-icons/fa'; // Importing icons

const PropertySection: React.FC = () => {
  const [setfavorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (index: number) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(index)
        ? prevFavorites.filter((i) => i !== index)
        : [...prevFavorites, index]
    );
  };

  const properties = [
    {
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjU5ODk5Nzcy&ixlib=rb-1.2.1&q=80&w=1080',
      title: 'Modern Family Home',
      price: '₹45,00,000',
      type: 'House',
      location: 'Mumbai, India',
      owner: 'John Doe',
      for: 'For Sale',
      bhkbs: {
        bedrooms: 4,
        hall: 1,
        kitchen: 1,
        bathrooms: 2,
        area: 2500,
      },
    },
    {
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjU5ODk5Nzcy&ixlib=rb-1.2.1&q=80&w=1080',
      title: 'Cozy Apartment',
      price: '₹90,000/month',
      type: 'Villa',
      location: 'New Delhi, India',
      owner: 'Jane Smith',
      for: 'For Rent',
      bhkbs: {
        bedrooms: 2,
        hall: 1,
        kitchen: 1,
        bathrooms: 1,
        area: 1200,
      },
    },
    {
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjU5ODk5Nzcy&ixlib=rb-1.2.1&q=80&w=1080',
      title: 'Luxury Villa',
      price: '₹1,20,00,000',
      type: 'Apartment',
      location: 'Bangalore, India',
      owner: 'Michael Johnson',
      for: 'For Sale',
      bhkbs: {
        bedrooms: 5,
        hall: 2,
        kitchen: 2,
        bathrooms: 4,
        area: 5000,
      },
    },
  ];

  return (
    <section className="property-section">
      <h2 className="property-section-title">Explore Our Featured Properties</h2>
      <p className="property-section-description">
        Discover a variety of properties that match your lifestyle. Whether you are looking for a family home, a cozy apartment, or a luxurious villa, we have it all.
      </p>
      <div className="property-section-grid">
        {properties.map((property, index) => (
          <div className="property-section-card" key={index}>
            <div className="property-section-header">
              <div className="property-section-type-for">
                <span className="property-section-type-badge">{property.type}</span>
                <span className="property-section-for-badge">{property.for}</span>
              </div>
              <FaHeart
                className={`property-section-heart-icon ${setfavorites.includes(index) ? 'favorite' : ''}`}
                onClick={() => toggleFavorite(index)}
              />
            </div>
            <img src={property.image} alt={property.title} className="property-section-image" />
            <div className="property-section-info">
              <h3 className="property-section-title">{property.title}</h3>
              <hr />
              <div className="property-section-location-owner">
                <span className="property-section-location"><FaMapMarkerAlt /> {property.location}</span>
                <span className="property-section-owner">{property.owner}</span>
              </div>
              <div className="property-section-bhkbs">
                <span><FaBed /> {property.bhkbs.bedrooms} Bedrooms</span>
                <span><FaCouch /> {property.bhkbs.hall} Hall</span>
                <span><FaUtensils /> {property.bhkbs.kitchen} Kitchen</span>
                <span><FaBath /> {property.bhkbs.bathrooms} Bathrooms</span>
                <span><FaRulerCombined /> {property.bhkbs.area} sq. ft.</span>
              </div>
              <div className="property-section-footer">
                <span className="property-section-price">{property.price}</span>
                <button className="property-section-btn">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PropertySection;
