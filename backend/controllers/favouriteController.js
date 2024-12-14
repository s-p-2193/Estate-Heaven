// controllers/userController.js
const User = require('../models/User');
const Property = require('../models/Property');

// Add a property to user's favorites
exports.addFavorite = async (req, res) => {
  const { propertyId } = req.body;
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if the property is already in the user's favorites
    if (user.favorites.includes(propertyId)) {
      return res.status(400).json({ success: false, message: "Property already in favorites" });
    }

    user.favorites.push(propertyId);
    await user.save();
    res.status(200).json({ success: true, message: "Property added to favorites" });
  } catch (error) {
    console.error("Error adding to favorites:", error.message);
    res.status(500).json({ success: false, message: "Server error while adding to favorites" });
  }
};

// Remove a property from user's favorites
exports.removeFavorite = async (req, res) => {
  const { propertyId } = req.body;
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const propertyIndex = user.favorites.indexOf(propertyId);
    if (propertyIndex === -1) {
      return res.status(400).json({ success: false, message: "Property not found in favorites" });
    }

    user.favorites.splice(propertyIndex, 1);
    await user.save();
    res.status(200).json({ success: true, message: "Property removed from favorites" });
  } catch (error) {
    console.error("Error removing from favorites:", error.message);
    res.status(500).json({ success: false, message: "Server error while removing from favorites" });
  }
};

// Get user's favorite properties
exports.getFavorites = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId).populate('favorites');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, favorites: user.favorites });
  } catch (error) {
    console.error("Error fetching favorites:", error.message);
    res.status(500).json({ success: false, message: "Server error while fetching favorites" });
  }
};
