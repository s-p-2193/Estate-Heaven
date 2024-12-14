import React, { useState, ChangeEvent, FormEvent, useContext } from 'react';
import "../../styles/authentication/Login.css";
import axios from 'axios';
import openEyeIcon from '../../img/lgsp/openeye.svg';
import closeEyeIcon from '../../img/lgsp/closeeye.svg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { handleGoogleAuth } from './googleAuth'; // Updated import
import loader from '../../img/images/Loaders.gif'; // Import loader gif

const Login: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState<boolean>(false); // State for normal loading
  const [loadingGoogle, setLoadingGoogle] = useState<boolean>(false); // State for Google login loading
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { login } = authContext;

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    if (!isValidEmail(formData.email)) {
      toast.error("Invalid email format. Please enter a valid email address.");
      return;
    }
    
    setLoading(true); // Set loading to true when the login request starts
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_API_URL}/api/auth/login`, formData);
  
      if (response.status === 200) {
        const { token, user } = response.data;
        login(token, user);
        navigate("/");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const message = error.response.data.message;
  
        if (status === 400 && message === "Invalid email") {
          toast.error("User not found. Please check your email.");
        } else if (status === 400 && message === "Invalid password") {
          toast.error("Invalid password. Please try again.");
        } else {
          toast.error("An unexpected error occurred. Please try again later.");
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false); // Set loading to false when the request is complete
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    try {
      setLoadingGoogle(true); // Set Google login loading to true
      const { credential } = credentialResponse;
      
      // Handle Google authentication (passing `false` for login)
      const success = await handleGoogleAuth(credential, authContext, false);
  
      if (success) {
        navigate("/"); // Navigate to home if login is successful
      } else {
        toast.error("Google login failed. Please try again.");
      }
    } catch (error) {
      // If an error occurs during Google login
      toast.error("An error occurred during Google login. Please try again.");
    } finally {
      // Set Google login loading to false after completion
      setLoadingGoogle(false);
    }
  };

  return (
    <div className="login-wrapper">
      <ToastContainer />
      <div className="login-box">
        <h1 className="login-header">Estate Heaven</h1>
        <h3 className="login-header2">Welcome Back</h3>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-container full-width">
            <input
              type="email"
              name="email"
              onChange={handleInputChange}
              className="input"
              required
              value={formData.email}
            />
            <label className={`floating-label-l ${formData.email ? 'filled' : ''}`}>
              Email Address
            </label>
          </div>
          <div className="password-container input-container">
            <input
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              onChange={handleInputChange}
              className="input"
              required
              value={formData.password}
            />
            <label className={`floating-label-l ${formData.password ? 'filled' : ''}`}>
              Password
            </label>
            <img
              src={passwordVisible ? closeEyeIcon : openEyeIcon}
              alt="Toggle Password Visibility"
              className="toggle-icon"
              onClick={togglePasswordVisibility}
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading || loadingGoogle}>
            {loading || loadingGoogle ? "Logging in..." : "Login"}
          </button>

          {(loading || loadingGoogle) && (
            <div className="login-loader-container">
              <img src={loader} alt="Loading..." className="login-loader-icon" />
            </div>
          )}
        </form>

        <div className="signup-text-container">
          <p className="signup-text">
            Don't have an account? <Link to="/signup" className="signup-link">Sign up now</Link>
          </p>
          <p className="forgot-password-text">
            <a href="/forgot-password" className="forgot-password-link">Forgot Password?</a>
          </p>
        </div>

        <div className="alternative-login">
          <div className="divider">
            <span className="divider-text">Or login with</span>
          </div>
          <div className="google-login-container">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => toast.error('Google login failed. Please try again.')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
