import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/Dashboard/Profile.css';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const userId = JSON.parse(localStorage.getItem('user') || '{}').id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_API_URL}/api/dashboard/profile/${userId}`);
        setProfile(response.data);
        setFirstName(response.data.firstName);
        setLastName(response.data.lastName);
        setPhone(response.data.phone || '');
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleEditToggle = () => {
    if (editing) {
      // Reset fields to original profile values on cancel
      if (profile) {
        setFirstName(profile.firstName);
        setLastName(profile.lastName);
        setPhone(profile.phone || '');
      }
    }
    setEditing(!editing);
  };

  const handleSave = async () => {
    if (profile && (firstName !== profile.firstName || lastName !== profile.lastName || phone !== profile.phone)) {
      const phoneNumberPattern = /^[0-9]{10}$/;

      if (!phoneNumberPattern.test(phone)) {
        toast.error('Phone number must be a 10-digit number.');
        return;
      }

      try {
        const updatedProfile = { firstName, lastName, phone };
        const response = await axios.put(`${process.env.REACT_APP_SERVER_API_URL}/api/dashboard/profile/${userId}`, updatedProfile);
        setProfile(response.data);
        setEditing(false);
        toast.success('Profile updated successfully!');
      } catch (error) {
        console.error('Error saving profile:', error);
        toast.error('Failed to update profile. Please try again.');
      }
    } else {
      toast.warn('No changes to save.');
    }
  };

  const handleDeletePhone = () => {
    if (profile && phone) {
      setPhone('');
      setProfile({ ...profile, phone: '' });
      toast.success('Phone number removed.');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <img src={require('../../img/images/Loaders.gif')} alt="Loading..." />
      </div>
    );
  }

  return (
    <div className="profile-container">
      <ToastContainer />
      <h2 className="profile-heading">User Profile</h2>
      <div className="profile-card-box">
        <div className="profile-information">
          <div className="profile-row">
            <span className="profile-label">Email:</span>
            <span className="profile-value">{profile?.email}</span>
          </div>

          <div className="profile-row">
            <span className="profile-label">Name:</span>
            {editing ? (
              <div className="profile-name-inputs">
                <input
                  className="profile-input-field"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                />
                <input
                  className="profile-input-field"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                />
              </div>
            ) : (
              <span className="profile-value">{`${profile?.firstName} ${profile?.lastName}`}</span>
            )}
          </div>

          <div className="profile-row">
            <span className="profile-label">Phone:</span>
            {editing ? (
              <div className="profile-phone-input-container">
                <input
                  className="profile-input-field"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone"
                />
                {phone && (
                  <button className="profile-trash-button" onClick={handleDeletePhone}>
                    <FaTrash className="trash-icon" />
                  </button>
                )}
              </div>
            ) : (
              <span className="profile-value">{phone || 'N/A'}</span>
            )}
          </div>
        </div>

        <div className="profile-button-container">
          {editing ? (
            <>
              <button className="profile-save-btn" onClick={handleSave}>
                Save Changes
              </button>
              <button className="profile-cancel-btn" onClick={handleEditToggle}>
                Cancel
              </button>
            </>
          ) : (
            <button className="profile-edit-btn" onClick={handleEditToggle}>
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;