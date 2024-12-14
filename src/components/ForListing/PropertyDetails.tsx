import React from "react";

const PropertyDetails: React.FC<{
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}> = ({ formData, handleChange }) => (
  <div className="real-estate-form-section">
    <h3 className="listproperty-h3">Property Details</h3>
    <input
      className="real-estate-form-input"
      type="text"
      name="title"
      placeholder="Title"
      value={formData.title}
      onChange={handleChange}
      required
    />
    <textarea
      className="real-estate-form-textarea"
      name="description"
      placeholder="Description"
      value={formData.description}
      onChange={handleChange}
      required
    />
    <div className="real-estate-form-two-column">
      <input
        className="real-estate-form-input"
        type="text"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        required
      />
      <select
        className="real-estate-form-select"
        name="type"
        value={formData.type}
        onChange={handleChange}
        required
      >
        <option value="" disabled hidden>
          Type
        </option>
        <option value="house">House</option>
        <option value="apartment">Apartment</option>
      </select>
    </div>
    <div className="real-estate-form-two-column">
      <select
        className="real-estate-form-select"
        name="for"
        value={formData.for}
        onChange={handleChange}
        required
      >
        <option value="" disabled hidden>
          For
        </option>
        <option value="sale">Sale</option>
        <option value="rent">Rent</option>
      </select>
      <input
        className="real-estate-form-input"
        type="text"
        name="area"
        placeholder="Area (sq ft)"
        value={formData.area}
        onChange={handleChange}
        required
      />
    </div>
  </div>
);

export default PropertyDetails;
