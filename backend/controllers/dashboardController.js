// Import models
const User = require('../models/User');
const Property = require('../models/Property');
const nodemailer = require('nodemailer');
const { log } = require('console');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    secure: false,
    tls: { rejectUnauthorized: false },
  })

// GET user profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Failed to fetch profile.' });
    }
};

// PUT update user profile
exports.updateUserProfile = async (req, res) => {
    try {
        const { firstName, lastName, phone } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { firstName, lastName, phone },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Failed to update profile.' });
    }
};

// GET properties listed by a specific user
exports.getUserProperties = async (req, res) => {
    try {
        const properties = await Property.find({ userId: req.params.userId });
        res.status(200).json(properties);
    } catch (error) {
        console.error('Error fetching user properties:', error);
        res.status(500).json({ message: 'Failed to fetch properties.' });
    }
};

// DELETE a property
exports.deleteProperty = async (req, res) => {
    try {
        const property = await Property.findByIdAndDelete(req.params.propertyId);
        if (!property) {
            return res.status(404).json({ message: 'Property not found.' });
        }
        res.status(200).json({ message: 'Property deleted successfully.' });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ message: 'Failed to delete property.' });
    }
};

// PUT update property details
exports.updateProperty = async (req, res) => {
    try {
        const updatedProperty = await Property.findByIdAndUpdate(
            req.params.propertyId,
            req.body,
            { new: true }
        );
        if (!updatedProperty) {
            return res.status(404).json({ message: 'Property not found.' });
        }
        res.status(200).json(updatedProperty);
    } catch (error) {
        console.error('Error updating property:', error);
        res.status(500).json({ message: 'Failed to update property.' });
    }
};

exports.requestDeleteOtp = async (req, res) => {
    const userId = req.params.userId; // Get userId from the URL params

    try {
        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Generate a random OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        user.resetToken = otp; // Store OTP in the user document
        user.resetTokenExpiry = Date.now() + 300000; // Set expiry time (5 minutes)
        await user.save(); // Save the updated user document

        // Prepare email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email, // Use the email from the user document
            subject: 'Account Deletion OTP',
            html: `
                <p>You have requested to delete your account.</p>
                <p>Please use the following OTP to confirm deletion:</p>
                <h2>${otp}</h2>
                <p>This OTP will expire in 5 minutes.</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'OTP sent to email.' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Failed to send OTP.' });
    }
};


exports.confirmDeleteAccount = async (req, res) => {
    const userId = req.params.userId;
    const { otp } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        // Check if the OTP is valid and within the time limit
        if (user.resetToken === otp && user.resetTokenExpiry > Date.now()) {
            // If valid, delete the user account
            await User.findByIdAndDelete(userId);
            res.status(200).json({ message: 'Account deleted successfully.' });
        } else {
            res.status(400).json({ message: 'Invalid or expired OTP.' });
        }
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ message: 'Failed to delete account.' });
    }
};

  