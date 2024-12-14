import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import "../../styles/authentication/ForgotPassword.css";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Loader from '../../img/lgsp/Loader.gif'; 
import openEyeIcon from '../../img/lgsp/openeye.svg'; 
import closeEyeIcon from '../../img/lgsp/closeeye.svg'; 

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(10);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
      setTimer(10); // Reset timer
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email.');
      return;
    }
    if (!isValidEmail(email)) {
      toast.error('Invalid email format.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_API_URL}/api/auth/forgot-password`, { email });
      if (response.status === 200) {
        toast.success('OTP sent! Check your email.');
        setIsOtpSent(true);
        setIsTimerActive(true); // Start the timer
      }
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!otp || !newPassword || !confirmNewPassword) {
      toast.error('Please enter OTP and new passwords.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    if (!isValidPassword(newPassword)) {
      toast.error('Password does not meet the criteria for strength.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_API_URL}/api/auth/reset-password`, {
        email,
        otp,
        newPassword
      });
      if (response.status === 200) {
        toast.success('Password reset successfully. Redirecting to login...');
        navigate('/login');
      } else if (response.status === 400) {
        // Assuming 400 is returned for an incorrect OTP
        toast.error('Incorrect OTP. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);
  
  const isValidEmail = (email: string) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  
  const isValidPassword = (password: string) => {
    return (
      password.length >= 10 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    );
  };

  return (
    <div className="forgot-password-container">
      <ToastContainer />
      <div className="forgot-password-box">
        <h1 className="forgot-password-title">Forgot Password</h1>

        {!isOtpSent ? (
          <form onSubmit={handleSendOtp}>
            <div className="input-container">
              <input
                type="email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="forgot-input"
                required
              />
              <label className={`forgot-floating-label ${email ? 'filled' : ''}`}>
                Enter Your Email
              </label>
            </div>
            <button type="submit" className="forgot-btn" disabled={isLoading}>
              {isLoading ? <img src={Loader} alt="Loading..." className="loader-icon" /> : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="input-container">
              <input
                type="text"
                value={otp}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
                className="forgot-input"
                required
              />
              <label className={`forgot-floating-label ${otp ? 'filled' : ''}`}>Enter OTP</label>
            </div>
            <div className="input-container">
              <input
                type={passwordVisible ? 'text' : 'password'}
                value={newPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                className="forgot-input"
                required
              />
              <label className={`forgot-floating-label ${newPassword ? 'filled' : ''}`}>New Password</label>
              <img
                src={passwordVisible ? closeEyeIcon : openEyeIcon}
                alt="Toggle Password Visibility"
                className="toggle-icon"
                onClick={togglePasswordVisibility}
              />
            </div>
            <div className="input-container">
              <input
                type={confirmPasswordVisible ? 'text' : 'password'}
                value={confirmNewPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmNewPassword(e.target.value)}
                className="forgot-input"
                required
              />
              <label className={`forgot-floating-label ${confirmNewPassword ? 'filled' : ''}`}>Confirm New Password</label>
              <img
                src={confirmPasswordVisible ? closeEyeIcon : openEyeIcon}
                alt="Toggle Confirm Password Visibility"
                className="toggle-icon"
                onClick={toggleConfirmPasswordVisibility}
              />
            </div>
            <button type="submit" className="forgot-btn" disabled={isLoading}>
              {isLoading ? <img src={Loader} alt="Loading..." className="loader-icon" /> : 'Reset Password'}
            </button>
            {isTimerActive && <p>Resend OTP in {timer} seconds</p>}
            {!isTimerActive && <button type="button" onClick={handleSendOtp} className="resend-btn">Resend OTP</button>}
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
