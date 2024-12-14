import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import Slider from 'react-slick';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toast CSS
import '../../styles/Dashboard/MyProperties.css';

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
  images: string[];
  ownerName: string;
  ownerContact: string;
  ownerEmail: string;
  latitude: number;
  longitude: number;
}

const MyProperties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [updatedProperties, setUpdatedProperties] = useState<{ [key: string]: Partial<Property> }>({});

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        const userId = user ? user.id : null;
        const response = await axios.get(`${process.env.REACT_APP_SERVER_API_URL}/api/dashboard/myproperties/${userId}`);
        setProperties(response.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const handleDelete = async (propertyId: string) => {
    try {
      await axios.delete(`${process.env.REACT_APP_SERVER_API_URL}/api/dashboard/myproperties/${propertyId}`);
      setProperties((prev) => prev.filter((property) => property._id !== propertyId));
      toast.success("Property deleted successfully!"); // Show toast message
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Failed to delete property.");
    }
  };

  const handleEditClick = (property: Property) => {
    setEditingPropertyId(property._id);
    setUpdatedProperties((prev) => ({
      ...prev,
      [property._id]: { ...property } // Initialize the updated property state with current values
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, propertyId: string) => {
    const { name, value } = e.target;
    setUpdatedProperties((prev) => ({
      ...prev,
      [propertyId]: {
        ...(prev[propertyId] || {}),
        [name]: value,
      },
    }));
  };

  const handleSave = async (propertyId: string) => {
    try {
      const updatedProperty = updatedProperties[propertyId];
      await axios.put(`${process.env.REACT_APP_SERVER_API_URL}/api/dashboard/myproperties/${propertyId}`, updatedProperty);
      setProperties((prev) => prev.map((property) => (property._id === propertyId ? { ...property, ...updatedProperty } : property)));
      setEditingPropertyId(null);
      toast.success("Property updated successfully!"); // Show toast message
    } catch (error) {
      console.error("Error updating property:", error);
      toast.error("Failed to update property.");
    }
  };

  const handleCancel = () => {
    setEditingPropertyId(null);
  };

  if (loading) {
    return (
      <div className="myproperty-loading-container">
        <img src={require('../../img/images/Loaders.gif')} alt="Loading..." />
      </div>
    );
  }

  return (
    <div className="myproperty-container">
      <h2 className='myproperty-h2'>My Properties</h2>
      {properties.length === 0 ? (
        <p className="no-myproperties">No properties found.</p>
      ) : (
        properties.map((property) => (
          <div className="myproperty-card" key={property._id}>
            <div className="myproperty-image">
              {property.images.length > 1 ? (
                <Slider dots infinite>
                  {property.images.map((image, index) => (
                    <div key={index}>
                      <img src={image} alt={`${property.title} - ${index}`} />
                    </div>
                  ))}
                </Slider>
              ) : (
                <img src={property.images[0]} alt={property.title} />
              )}
            </div>

            <div className="myproperty-details">
              {/* Property Basic Information */}
              <h3 className="myproperty-section-title">Basic Information</h3>
	      <div className="myproperty-details-section horizontal">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={editingPropertyId === property._id ? updatedProperties[property._id]?.title || '' : property.title}
                  onChange={(e) => handleInputChange(e, property._id)}
                  disabled={editingPropertyId !== property._id}
                />
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  value={editingPropertyId === property._id ? updatedProperties[property._id]?.description || '' : property.description}
                  onChange={(e) => handleInputChange(e, property._id)}
                  disabled={editingPropertyId !== property._id}
                />
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  value={editingPropertyId === property._id ? updatedProperties[property._id]?.price || '' : property.price}
                  onChange={(e) => handleInputChange(e, property._id)}
                  disabled={editingPropertyId !== property._id}
                />
              </div>

              <h3 className="myproperty-section-title">Property Details</h3>
              <div className="myproperty-details-section horizontal">
                <label>Type</label>
                <select
                  name="type"
                  value={editingPropertyId === property._id ? updatedProperties[property._id]?.type || '' : property.type}
                  onChange={(e) => handleInputChange(e, property._id)}
                  disabled={editingPropertyId !== property._id}
                >
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                </select>
                <label>For</label>
                <select
                  name="for"
                  value={editingPropertyId === property._id ? updatedProperties[property._id]?.for || '' : property.for}
                  onChange={(e) => handleInputChange(e, property._id)}
                  disabled={editingPropertyId !== property._id}
                >
                  <option value="sale">Sale</option>
                  <option value="rent">Rent</option>
                </select>
              </div>

              <h3 className="myproperty-section-title">Location Details</h3>
              <div className="myproperty-details-section horizontal">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={editingPropertyId === property._id ? updatedProperties[property._id]?.address || '' : property.address}
                  onChange={(e) => handleInputChange(e, property._id)}
                  disabled={editingPropertyId !== property._id}
                />
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={editingPropertyId === property._id ? updatedProperties[property._id]?.city || '' : property.city}
                  onChange={(e) => handleInputChange(e, property._id)}
                  disabled={editingPropertyId !== property._id}
                />
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={editingPropertyId === property._id ? updatedProperties[property._id]?.state || '' : property.state}
                  onChange={(e) => handleInputChange(e, property._id)}
                  disabled={editingPropertyId !== property._id}
                />
                <label>Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={editingPropertyId === property._id ? updatedProperties[property._id]?.pincode || '' : property.pincode}
                  onChange={(e) => handleInputChange(e, property._id)}
                  disabled={editingPropertyId !== property._id}
                />
              </div>

              <h3 className="myproperty-section-title">Additional Details</h3>
              <div className="myproperty-details-section horizontal">
                <label>Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={editingPropertyId === property._id ? updatedProperties[property._id]?.bedrooms || '' : property.bedrooms}
                  onChange={(e) => handleInputChange(e, property._id)}
                  disabled={editingPropertyId !== property._id}
                />
                <label>Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={editingPropertyId === property._id ? updatedProperties[property._id]?.bathrooms || '' : property.bathrooms}
                  onChange={(e) => handleInputChange(e, property._id)}
                  disabled={editingPropertyId !== property._id}
                />
                <label>Kitchen</label>
                <input
                  type="number"
                  name="kitchen"
                  value={editingPropertyId === property._id ? updatedProperties[property._id]?.kitchen || '' : property.kitchen}
                  onChange={(e) => handleInputChange(e, property._id)}
                  disabled={editingPropertyId !== property._id}
                />
                <label>Hall</label>
                <input
                  type="number"
                  name="hall"
                  value={editingPropertyId === property._id ? updatedProperties[property._id]?.hall || '' : property.hall}
                  onChange={(e) => handleInputChange(e, property._id)}
                  disabled={editingPropertyId !== property._id}
                />
                <label>Area (sq ft)</label>
                <input
                  type="number"
                  name="area"
                  value={editingPropertyId === property._id ? updatedProperties[property._id]?.area || '' : property.area}
                  onChange={(e) => handleInputChange(e, property._id)}
                  disabled={editingPropertyId !== property._id}
                />
              </div>

              <h3 className="myproperty-section-title">Owner Details</h3>
              <div className="myproperty-details-section horizontal">
                <label>Owner Name</label>
                <input
                  type="text"
                  name="ownerName"
                  value={editingPropertyId === property._id ? updatedProperties[property._id]?.ownerName || '' : property.ownerName}
                  onChange={(e) => handleInputChange(e, property._id)}
                  disabled={editingPropertyId !== property._id}
                />
                <label>Contact</label>
                <input
                  type="text"
                  name="ownerContact"
                  value={editingPropertyId === property._id ? updatedProperties[property._id]?.ownerContact || '' : property.ownerContact}
                  onChange={(e) => handleInputChange(e, property._id)}
                  disabled={editingPropertyId !== property._id}
                />
                <label>Email</label>
                <input
                  type="email"
                  name="ownerEmail"
                  value={editingPropertyId === property._id ? updatedProperties[property._id]?.ownerEmail || '' : property.ownerEmail}
                  onChange={(e) => handleInputChange(e, property._id)}
                  disabled={editingPropertyId !== property._id}
                />
              </div>

              {/* Property Map */}
              <div className="myproperty-map-section">
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

              {/* Actions - Edit, Delete, Save, Cancel */}
              <div className="myproperty-actions">
                {editingPropertyId === property._id ? (
                  <>
                    <button className="myproperty-save-button" onClick={() => handleSave(property._id)}>Save</button>
                    <button className="myproperty-cancel-button" onClick={handleCancel}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="myproperty-edit-button" onClick={() => handleEditClick(property)}>Edit <FaEdit /></button>
                    <button className="myproperty-delete-button" onClick={() => handleDelete(property._id)}>Delete <FaTrash /></button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))
      )}
      {/* Toast container */}
      <ToastContainer />
    </div>
  );
};

export default MyProperties;
