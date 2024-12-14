import React, { useState, ChangeEvent, FormEvent, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/authentication/Signup.css';
import openEyeIcon from '../../img/lgsp/openeye.svg';
import closeEyeIcon from '../../img/lgsp/closeeye.svg';
import { AuthContext } from '../../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { handleGoogleAuth } from './googleAuth'; // Updated import
import Loader from '../../img/images/Loaders.gif'; // Path to the loader GIF

interface FormFields {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { login } = authContext;
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState<boolean>(false);
  const [formFields, setFormFields] = useState<FormFields>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false);
  const [passwordValid, setPasswordValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); // State for normal loading
  const [loadingGoogle, setLoadingGoogle] = useState<boolean>(false); // State for Google signup loading

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormFields((prevFields) => ({ ...prevFields, [name]: value }));

    if (name === 'password') {
      validatePassword(value);
    }
  };

  const handlePasswordFocus = () => setPasswordFocused(true);
  const handlePasswordBlur = () => setPasswordFocused(false);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const lengthValid = password.length >= 10;
    const upperCaseValid = /[A-Z]/.test(password);
    const lowerCaseValid = /[a-z]/.test(password);
    const numberValid = /\d/.test(password);
    const specialCharValid = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    setPasswordValid(lengthValid && upperCaseValid && lowerCaseValid && numberValid && specialCharValid);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start loading

    if (!isValidEmail(formFields.email)) {
      toast.error('Invalid email format. Please enter a valid email address.');
      setLoading(false); // Stop loading
      return;
    }

    if (formFields.password !== formFields.confirmPassword) {
      toast.error('Passwords do not match!');
      setLoading(false); // Stop loading
      return;
    }

    if (!passwordValid) {
      toast.error('Password does not meet the criteria for strength.');
      setLoading(false); // Stop loading
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_API_URL}/api/auth/signup`, {
        firstName: formFields.firstName,
        lastName: formFields.lastName,
        email: formFields.email,
        password: formFields.password,
      });

      if (response.status === 201) {
        toast.success('Signup successful!');

        const { token, user } = response.data;

        if (token && user) {
          login(token, user);
          navigate('/');
        } else {
          toast.error('Signup failed. Invalid server response. Please try again.');
        }
      } else {
        toast.error('Signup failed. Please try again.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || 'An error occurred during signup. Please try again.');
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleGoogleSignup = async (credentialResponse: any) => {
    try {
      setLoadingGoogle(true); // Set Google signup loading to true
      const { credential } = credentialResponse;
      
      // Handle Google authentication (passing `true` for signup)
      const success = await handleGoogleAuth(credential, authContext, true); 
  
      if (success) {
        navigate('/'); // Navigate to home if signup is successful
      } else {
        toast.error('Google signup failed. Please try again.');
      }
    } catch (error) {
      // If an error occurs during Google signup
      toast.error('An error occurred during Google signup. Please try again.');
    } finally {
      // Set Google signup loading to false after completion
      setLoadingGoogle(false);
    }
  };

  return (
    <div className="signup-wrapper">
      <ToastContainer />
      <div className="signup-box">
        <h1 className="signup-header">Estate Heaven</h1>
        <h3 className="signup-header2">Create Account</h3>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="name-fields">
            <div className="input-container">
              <input
                type="text"
                name="firstName"
                value={formFields.firstName}
                onChange={handleInputChange}
                className="input"
                required
              />
              <label className={formFields.firstName ? 'floating-label-s filled' : 'floating-label-s'}>
                First Name
              </label>
            </div>
            <div className="input-container">
              <input
                type="text"
                name="lastName"
                value={formFields.lastName}
                onChange={handleInputChange}
                className="input"
                required
              />
              <label className={formFields.lastName ? 'floating-label-s filled' : 'floating-label-s'}>
                Last Name
              </label>
            </div>
          </div>
          <div className="input-container full-width">
            <input
              type="email"
              name="email"
              value={formFields.email}
              onChange={handleInputChange}
              className="input"
              required
            />
            <label className={formFields.email ? 'floating-label-s filled' : 'floating-label-s'}>
              Email Address
            </label>
          </div>
          <div className="password-container input-container">
            <input
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              value={formFields.password}
              onChange={handleInputChange}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
              className={`input ${passwordFocused ? (passwordValid ? 'valid' : 'invalid') : ''}`}
              required
            />
            <label className={formFields.password ? 'floating-label-s filled' : 'floating-label-s'}>
              Password
            </label>
            <img
              src={passwordVisible ? closeEyeIcon : openEyeIcon}
              alt="Toggle Password Visibility"
              className="toggle-icon"
              onClick={togglePasswordVisibility}
            />
            {passwordFocused && !passwordValid && (
              <div className="password-hint">
                At least 10 characters with a mix of upper/lowercase, numbers, and symbols.
              </div>
            )}
          </div>
          <div className="password-container input-container">
            <input
              type={confirmPasswordVisible ? 'text' : 'password'}
              name="confirmPassword"
              value={formFields.confirmPassword}
              onChange={handleInputChange}
              className="input"
              required
            />
            <label className={formFields.confirmPassword ? 'floating-label-s filled' : 'floating-label-s'}>
              Confirm Password
            </label>
            <img
              src={confirmPasswordVisible ? closeEyeIcon : openEyeIcon}
              alt="Toggle Confirm Password Visibility"
              className="toggle-icon"
              onClick={toggleConfirmPasswordVisibility}
            />
          </div>
          <button type="submit" className="signup-btn" disabled={loading || loadingGoogle}>
            {loading || loadingGoogle ? "Signing Up..." : "Signup"}
          </button>
          
          {(loading || loadingGoogle) && (
            <div className="signup-loader-container">
              <img src={Loader} alt="Loading..." className="signup-loader-icon" />
            </div>
          )}
        </form>

        <div className="login-text-container">
          <p className="login-text">
            Already have an account? <Link to="/login" className="login-link">Login now</Link>
          </p>
        </div>

        <div className="alternative-login">
          <div className="divider">
            <span className="divider-text">Or sign up with</span>
          </div>
          <div className="google-login-container">
            <GoogleLogin
              onSuccess={handleGoogleSignup}
              onError={() => toast.error('Google signup failed. Please try again.')}
              containerProps={{ style: { display: 'flex', alignItems: 'center' } }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
