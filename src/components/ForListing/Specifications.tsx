import React from "react";

const Specifications: React.FC<{ formData: any; handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ formData, handleChange }) => (
  <div className="real-estate-form-section">
    <h3 className="listproperty-h3">Specifications</h3>
    <div className="real-estate-form-two-column">
      <input className="real-estate-form-input" type="text" name="bedrooms" placeholder="Bedrooms" value={formData.bedrooms} onChange={handleChange} required />
      <input className="real-estate-form-input" type="text" name="hall" placeholder="Hall" value={formData.hall} onChange={handleChange} required />
    </div>
    <div className="real-estate-form-two-column">
      <input className="real-estate-form-input" type="text" name="kitchen" placeholder="Kitchen" value={formData.kitchen} onChange={handleChange} required />
      <input className="real-estate-form-input" type="text" name="bathrooms" placeholder="Bathrooms" value={formData.bathrooms} onChange={handleChange} required />
    </div>
  </div>
);

export default Specifications;
