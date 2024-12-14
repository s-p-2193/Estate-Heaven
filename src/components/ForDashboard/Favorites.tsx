import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaHeart,
  FaBed,
  FaBath,
  FaCouch,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../styles/Dashboard/Favorites.css";
import { toast, ToastContainer } from "react-toastify";
import loadingGif from "../../img/images/Loaders.gif";
import PropertyDetailsOverlay from "../pages/PropertyDetailsOverlay"; // Import PropertyDetailsOverlay component

interface Property {
  _id: string;
  title: string;
  price: number;
  type: string;
  for: string;
  city: string;
  state: string;
  bedrooms: number;
  hall: number;
  kitchen: number;
  bathrooms: number;
  area: number;
  ownerName: string;
  images: string[];
  isFavorite: boolean;
  pincode: string;
  address: string;
  ownerContact: string;
  ownerEmail: string;
  description: string;
  latitude: number;
  longitude: number;
}

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null); // State to manage selected property
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user ? user.id : null;

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      if (!userId) return;

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_API_URL}/api/dashboard/favorites/${userId}`
        );
        setFavorites(response.data.favorites || []);
      } catch (error) {
        toast.error("Failed to load favorite properties.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [userId]);

  const handleRemoveFavorite = async (propertyId: string) => {
    try {
      await axios.post(`${process.env.REACT_APP_SERVER_API_URL}/api/dashboard/favorites/remove/${userId}`, {
        propertyId
      });

      setFavorites((prevFavorites) =>
        prevFavorites.filter((property) => property._id !== propertyId)
      );
      toast.success("Property removed from favorites.");
    } catch (error) {
      toast.error("Failed to remove property from favorites.");
    }
  };

  const openPropertyDetails = (propertyId: string) => {
    const token = localStorage.getItem("token");
    if (token) {
      setSelectedPropertyId(propertyId); // Open the property overlay
    } else {
      navigate("/login");
    }
  };

  const formatPrice = (price: number, forRent: boolean) => {
    const priceStr = price.toString();
    const [integerPart, decimalPart] = priceStr.split(".");
    const lastThreeDigits = integerPart.slice(-3);
    const otherDigits = integerPart.slice(0, -3);
    const formattedIntegerPart =
      otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
      (otherDigits.length ? "," : "") +
      lastThreeDigits;
    return `₹${formattedIntegerPart}` + (forRent ? " /month" : "");
  };

  const closePropertyDetails = () => {
    setSelectedPropertyId(null); // Close the overlay
  };

  return (
    <section className="favorites-section">
      <h2 className="favorites-title">My Favorite Properties</h2>
      {loading ? (
        <div className="loading">
          <img src={loadingGif} alt="Loading..." />
        </div>
      ) : favorites.length === 0 ? (
        <p className="no-favorites">No favorite properties found.</p>
      ) : (
        <div className="favorites-grid">
          {favorites.map((property) => (
            <div key={property._id} className="favorites-card">
              <div className="favorites-header">
                <div className="favorites-type-for">
                  <span className="favorites-type-badge">
                    {property.type}
                  </span>
                  <span className="favorites-for-badge">
                    {property.for}
                  </span>
                </div>
                <FaHeart
                  className="favorites-heart-icon"
                  onClick={() => handleRemoveFavorite(property._id)}
                />
              </div>
              <img
                src={property.images[0]}
                alt={property.title}
                className="favorites-image"
              />
              <div className="favorites-info">
                <h3 className="favorites-title-2">{property.title}</h3>
                <hr />
                <div className="favorites-location-owner">
                  <span className="favorites-location">
                    <FaMapMarkerAlt /> {property.city}, {property.state}
                  </span>
                  <span className="favorites-owner">
                    {property.ownerName}
                  </span>
                </div>
                <div className="favorites-bhkbs">
                  <span>
                    <FaBed /> {property.bedrooms} Bedrooms
                  </span>
                  <span>
                    <FaCouch /> {property.hall} Hall
                  </span>
                  <span>
                    <FaBath /> {property.bathrooms} Bathrooms
                  </span>
                  <span>
                    <FaCouch /> {property.kitchen} Kitchen
                  </span>
                  <span>
                    <FaCouch /> {property.area} sq. ft.
                  </span>
                </div>
                <div className="favorites-footer">
                  <span className="favorites-price">
                    {formatPrice(property.price, property.for === "rent")}
                  </span>
                  <button
                    className="favorites-btn"
                    onClick={() => openPropertyDetails(property._id)} // Open the property details overlay
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedPropertyId && (
        <PropertyDetailsOverlay
          property={favorites.find((prop) => prop._id === selectedPropertyId) || null}
          onClose={closePropertyDetails} // Close the overlay
        />
      )}
      <ToastContainer />
    </section>
  );
};

export default Favorites;
