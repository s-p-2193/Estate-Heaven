import React, { useState } from "react"; 
import "../../styles/ListProperty/PropertyForm.css";
import PropertyDetails from "./PropertyDetails";
import LocationDetails from "./LocationDetails";
import OwnerDetails from "./OwnerDetails";
import Specifications from "./Specifications";
import ImageUpload from "./ImageUpload";
import LoadingOverlay from "./LoadingOverlay";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface ImageFile extends File {
  preview?: string;
}

interface FormData {
  title: string;
  description: string;
  price: string;
  type: string;
  for: string;
  city: string;
  state: string;
  pincode: string;
  address: string;
  ownerName: string;
  ownerContact: string;
  ownerEmail: string;
  bedrooms: string;
  hall: string;
  kitchen: string;
  bathrooms: string;
  area: string;
  images: ImageFile[];
  latitude: string;  // Add latitude
  longitude: string; // Add longitude
}

const PropertyForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    price: "",
    type: "",
    for: "",
    city: "",
    state: "",
    pincode: "",
    address: "",
    ownerName: "",
    ownerContact: "",
    ownerEmail: "",
    bedrooms: "",
    hall: "",
    kitchen: "",
    bathrooms: "",
    area: "",
    images: [],
    latitude: "",  // Initialize latitude
    longitude: "", // Initialize longitude
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emptyFields = Object.keys(formData).filter((field) => !formData[field as keyof FormData]);
    if (emptyFields.length > 0) {
      emptyFields.forEach((field) => {
        toast.error(`${field} is required.`);
      });
      return;
    }

    // Sanitize the price input
    const sanitizedPrice = formData.price.replace(/,/g, "");

    let userId;
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      userId = user.isGoogleUser ? user._id : user.id;
    } else {
      toast.error("User not found. Please log in.");
      return;
    }

    // Create FormData object
    const data = new FormData();
    data.append("userId", userId);
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", sanitizedPrice);
    data.append("type", formData.type);
    data.append("for", formData.for);
    data.append("city", formData.city);
    data.append("state", formData.state);
    data.append("pincode", formData.pincode);
    data.append("address", formData.address);
    data.append("ownerName", formData.ownerName);
    data.append("ownerContact", formData.ownerContact);
    data.append("ownerEmail", formData.ownerEmail);
    data.append("bedrooms", formData.bedrooms);
    data.append("hall", formData.hall);
    data.append("kitchen", formData.kitchen);
    data.append("bathrooms", formData.bathrooms);
    data.append("area", formData.area);
    data.append("latitude", formData.latitude);
    data.append("longitude", formData.longitude);
    // Append images
    formData.images.forEach((image) => {
      data.append("images", image);
    });
    setIsLoading(true); // Start loading overlay
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_API_URL}/api/property/list`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Property listed successfully!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error listing property:", error);
      toast.error("Error listing property. Please try again.");
    } finally {
      setIsLoading(false); // Hide loading overlay
    }
  };

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <form className="real-estate-form-container" onSubmit={handleSubmit}>
        <ToastContainer />
        <h2 className="listproperty-h2">Real Estate Listing Form</h2>
        <PropertyDetails formData={formData} handleChange={handleChange} />
        <LocationDetails formData={formData} handleChange={handleChange} />
        <OwnerDetails formData={formData} handleChange={handleChange} />
        <Specifications formData={formData} handleChange={handleChange} />
        <ImageUpload images={formData.images} setImages={(images) => setFormData({ ...formData, images })} />
        <button className="real-estate-form-submit-button" type="submit">Submit</button>
      </form>
    </>
  );
};

export default PropertyForm;
