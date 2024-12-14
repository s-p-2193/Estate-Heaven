const express = require('express');
const { 
    getUserProfile, 
    updateUserProfile, 
    getUserProperties, 
    deleteProperty, 
    updateProperty, requestDeleteOtp , confirmDeleteAccount
} = require('../controllers/dashboardController');
const{ createOrder,checkPremium } = require('../controllers/paymentController');
const { addFavorite, removeFavorite, getFavorites } = require('../controllers/favouriteController');

const router = express.Router();

// Route to get user dashboard profile
router.get('/profile/:userId', getUserProfile);

// Route to update user dashboard profile
router.put('/profile/:userId', updateUserProfile);

// Route to get specific user's listed properties
router.get('/myproperties/:userId', getUserProperties);

// Route to delete a property
router.delete('/myproperties/:propertyId', deleteProperty);

// Route to update property details
router.put('/myproperties/:propertyId', updateProperty);

router.post('/request-delete-otp/:userId', requestDeleteOtp);
router.post('/confirm-delete/:userId', confirmDeleteAccount);

router.post('/premium/payment/:userId', createOrder);
router.get('/checkpremium/:userId', checkPremium);

router.post('/favorites/add/:userId', addFavorite);
router.post('/favorites/remove/:userId', removeFavorite);
router.get('/favorites/:userId', getFavorites);

module.exports = router;
