import React, { useState, useEffect } from 'react';
import { FaTimes, FaMapMarkerAlt, FaBed, FaBath, FaPhone, FaEnvelope } from 'react-icons/fa';
import Slider from 'react-slick';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../styles/ForDetails/PropertyDetailsOverlay.css';

interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  type: string;
  for: string;
  city: string;
  state: string;
  pincode: string;
  address: string;
  bedrooms: number;
  hall: number;
  kitchen: number;
  bathrooms: number;
  area: number;
  ownerName: string;
  ownerContact: string;
  ownerEmail: string;
  images: string[];
  latitude: number;
  longitude: number;
}

interface PropertyOverlayProps {
  property: Property | null;
  onClose: () => void;
}

const PropertyDetailsOverlay: React.FC<PropertyOverlayProps> = ({ property, onClose }) => {
  const [isSliderOpen, setSliderOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    document.body.style.overflow = property ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [property]);

  const handleImageClick = (index: number) => {
    if (!isScrolling) {
      setSelectedImage(index);
      setSliderOpen(true);
    }
  };

  const handleScrollStart = () => {
    setIsScrolling(true);
  };

  const handleScrollEnd = () => {
    setTimeout(() => {
      setIsScrolling(false);
    }, 100);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <div className="slick-arrow next">▶</div>,
    prevArrow: <div className="slick-arrow prev">◀</div>,
  };

  if (!property) return null;

  // Check if there is only one image
  const isSingleImage = property.images.length === 1;

  return (
    <div className="property-overlay" onScroll={handleScrollStart} onMouseLeave={handleScrollEnd}>
      <div className="property-overlay-content">
        <button className="property-overlay-close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="property-overlay-image-section">
          {isSingleImage ? (
            <div className="property-overlay-single-image-container">
              <img
                src={property.images[0]}
                alt="Property"
                className="property-overlay-single-image"
              />
            </div>
          ) : (
            <Slider {...sliderSettings}>
              {property.images.map((image, index) => (
                <div
                  key={index}
                  className="property-overlay-slider-image-container"
                  onClick={() => handleImageClick(index)}
                >
                  <img
                    src={image}
                    alt={`Property Image ${index + 1}`}
                    className="property-overlay-slider-image"
                  />
                </div>
              ))}
            </Slider>
          )}
        </div>

        <div className="property-overlay-section">
          <h2 className="property-overlay-title">{property.title}</h2>
          <h3 className="property-overlay-price">₹{property.price}</h3>
          <p className="property-overlay-description">{property.description}</p>
        </div>

        <div className="property-overlay-location property-overlay-section">
          <h4>Location Details</h4>
          <p><FaMapMarkerAlt /> <strong>City:</strong> {property.city}</p>
          <p><strong>State:</strong> {property.state}</p>
          <p><strong>Pincode:</strong> {property.pincode}</p>
          <p><strong>Address:</strong> {property.address}</p>
        </div>

        <div className="property-overlay-utilities property-overlay-section">
          <h4>Utilities</h4>
          <p><FaBed /> <strong>Bedrooms:</strong> {property.bedrooms}</p>
          <p><FaBath /> <strong>Bathrooms:</strong> {property.bathrooms}</p>
          <p><strong>Halls:</strong> {property.hall}</p>
          <p><strong>Kitchens:</strong> {property.kitchen}</p>
          <p><strong>Area:</strong> {property.area} sq. ft.</p>
        </div>

        <div className="property-overlay-owner-info property-overlay-section">
          <h4>Owner Information</h4>
          <p><strong>Owner:</strong> {property.ownerName}</p>
          <p><FaPhone /> <strong>Contact:</strong> {property.ownerContact}</p>
          <p><FaEnvelope /> <strong>Email:</strong> {property.ownerEmail}</p>
        </div>

        <div className="property-overlay-map property-overlay-section">
          <h4>Property Location</h4>
          <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAP_KEY || ""}>
            <GoogleMap
              center={{ lat: property.latitude, lng: property.longitude }}
              zoom={15}
              mapContainerStyle={{ width: '100%', height: '300px' }}
              options={{ gestureHandling: 'none', clickableIcons: false }}
            >
              <Marker position={{ lat: property.latitude, lng: property.longitude }} />
            </GoogleMap>
          </LoadScript>
        </div>
      </div>

      {isSliderOpen && (
        <div className="property-overlay-slider">
          <button className="property-overlay-slider-close-btn" onClick={() => setSliderOpen(false)}>
            <FaTimes />
          </button>
          <img
            src={property.images[selectedImage]}
            alt={`Large view of ${selectedImage + 1}`}
            className="property-overlay-large-image"
          />
        </div>
      )}
    </div>
  );
};

export default PropertyDetailsOverlay;
