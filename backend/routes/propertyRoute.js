const express = require('express');
const multer = require('multer'); // Import multer
const { listProperty, searchProperties } = require('../controllers/propertyController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Configure multer for memory storage

// Create a property listing (upload images directly to Cloudinary)
router.post('/list', upload.array('images', 15), listProperty); // Ensure multer handles file uploads

// Search for properties
router.post('/search', searchProperties);

module.exports = router;
