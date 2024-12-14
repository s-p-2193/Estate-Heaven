const express = require('express');
const { signup, login, forgotPassword, resetPassword } = require('../controllers/authController');
const { googleAuth } = require('../controllers/googleAuthController'); // Import the Google auth controller

const router = express.Router();

// Signup Route
router.post('/signup', signup);

// Login Route
router.post('/login', login);

// Google Login Route
router.post('/google-login', (req, res) => googleAuth(req, res, 'login')); // Pass action as 'login'

// Google Signup Route
router.post('/google-signup', (req, res) => googleAuth(req, res, 'signup')); // Pass action as 'signup'

// Password Reset Routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
