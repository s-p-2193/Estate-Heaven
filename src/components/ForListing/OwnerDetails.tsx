import React from "react";

const OwnerDetails: React.FC<{ formData: any; handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ formData, handleChange }) => (
  <div className="real-estate-form-section">
    <h3 className="listproperty-h3">Owner Details</h3>
    <div className="real-estate-form-two-column">
      <input className="real-estate-form-input" type="text" name="ownerName" placeholder="Owner Name" value={formData.ownerName} onChange={handleChange} required />
      <input className="real-estate-form-input" type="tel" name="ownerContact" placeholder="Owner Contact" value={formData.ownerContact} onChange={handleChange} required />
    </div>
    <input className="real-estate-form-input" type="email" name="ownerEmail" placeholder="Owner Email" value={formData.ownerEmail} onChange={handleChange} required />
  </div>
);

export default OwnerDetails;
