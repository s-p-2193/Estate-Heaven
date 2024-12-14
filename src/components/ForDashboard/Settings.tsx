import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/Dashboard/Settings.css';
import { AuthContext } from "../../contexts/AuthContext";
import axios from 'axios';

const Settings: React.FC = () => {
  const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  
  // Local state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState(false);

  const logout = authContext?.logout;

  const handleLogout = () => {
    if (logout) {
      logout();
    }
    navigate("/");
  };

  const openDeleteModal = async () => {
    setShowDeleteModal(true);
    try {
      // Send OTP request to the server
      const response = await axios.post(`${process.env.REACT_APP_SERVER_API_URL}/api/dashboard/request-delete-otp/${userId}`);
      if (response.status === 200) {
        setOtpSent(true); // OTP has been sent
      }
    } catch (error) {
      console.error("Failed to send OTP:", error);
      setOtpError("Failed to send OTP. Please try again later.");
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setOtp('');
    setOtpError('');
    setOtpSent(false);
    setOtpSuccess(false);
  };

  const handleOtpSubmit = async () => {
    try {
      // Send OTP and confirm deletion request to the server
      const response = await axios.post(`${process.env.REACT_APP_SERVER_API_URL}/api/dashboard/confirm-delete/${userId}`, { otp });
      if (response.status === 200) {
        setOtpSuccess(true);
        closeDeleteModal();
        handleLogout(); // Logout and redirect on successful deletion
      }
    } catch (error) {
      setOtpError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="settings-container">
      <h1>Account Settings</h1>
      
      <div className="settings-section">
        <button className="settings-button logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="settings-section">
        <button className="settings-button delete-button" onClick={openDeleteModal}>
          Delete Account
        </button>
      </div>

      {showDeleteModal && (
        <div className="delete-modal">
          <div className="delete-modal-content">
            <h2>Confirm Account Deletion</h2>
            <p>
              An OTP has been sent to your email. Please enter it below to confirm account deletion.
            </p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="otp-input"
            />
            {otpError && <p className="error-text">{otpError}</p>}
            <div className="modal-actions">
              <button className="modal-button confirm-button" onClick={handleOtpSubmit}>
                Confirm Deletion
              </button>
              <button className="modal-button cancel-button" onClick={closeDeleteModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
