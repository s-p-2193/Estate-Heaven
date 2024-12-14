import React, { useState } from 'react';
import '../../styles/Dashboard/DeleteConfirmationOverlay.css';
import axios from 'axios';

interface DeleteConfirmationOverlayProps {
  propertyId: string; // Pass the property ID to be deleted
  onConfirm: (reason: string, rating: number) => void;
  onCancel: () => void;
}

const DeleteConfirmationOverlay: React.FC<DeleteConfirmationOverlayProps> = ({ propertyId, onConfirm, onCancel }) => {
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState<string>('');
  const [rating, setRating] = useState<number>(0);

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrevious = () => setStep((prev) => prev - 1);
  
  const handleConfirm = async () => {
    try {
      // Send the reason and rating to the backend
      await axios.post(`${process.env.REACT_APP_SERVER_API_URL}/api/dashboard/deleteproperty`, {
        propertyId,
        reason,
        rating,
      });
      onConfirm(reason, rating); // Call the passed onConfirm function
    } catch (error) {
      console.error("Error confirming deletion:", error);
    }
  };

  return (
    <div className="delete-overlay-container">
      <div className="delete-overlay-content">
        {step === 1 && (
          <div className="delete-confirmation-step">
            <h2 className="delete-overlay-title">Are you sure you want to delete this property?</h2>
            <div className="delete-overlay-buttons">
              <button className="delete-overlay-button cancel" onClick={onCancel}>Cancel</button>
              <button className="delete-overlay-button proceed" onClick={handleNext}>Proceed</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="delete-reason-step">
            <h2 className="delete-overlay-title">Why are you deleting this property?</h2>
            <select value={reason} onChange={(e) => setReason(e.target.value)} className="delete-overlay-select">
              <option value="" disabled>Select reason</option>
              <option value="Property Sold">Property Sold</option>
              <option value="No Longer Selling">No Longer Selling</option>
            </select>
            <div className="delete-overlay-buttons">
              <button className="delete-overlay-button back" onClick={handlePrevious}>Back</button>
              <button className="delete-overlay-button next" onClick={handleNext}>Next</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="delete-rating-step">
            <h2 className="delete-overlay-title">Rate our platform</h2>
            <div className="delete-overlay-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`delete-star ${rating >= star ? 'delete-active-star' : ''}`}
                >
                  ★
                </button>
              ))}
            </div>
            <div className="delete-overlay-buttons">
              <button className="delete-overlay-button back" onClick={handlePrevious}>Back</button>
              <button className="delete-overlay-button confirm" onClick={handleConfirm}>Delete Property</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteConfirmationOverlay;
