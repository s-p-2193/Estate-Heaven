const Property = require("../models/Property");
const cloudinary = require("cloudinary").v2; // For image uploads
const User = require("../models/User"); // Assuming you have a User model
require("dotenv").config(); // Ensure .env file is loaded

// Create a new property listing
exports.listProperty = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : req.body.userId;

    if (!userId) {
      console.error("User ID is required.");
      return res
        .status(400)
        .json({ success: false, message: "User ID is required." });
    }

    // Validate latitude and longitude
    if (!req.body.latitude || !req.body.longitude) {
      console.error("Latitude and longitude are required.");
      return res
        .status(400)
        .json({
          success: false,
          message: "Latitude and longitude are required.",
        });
    }

    // Handle images upload to Cloudinary
    if (!req.files || req.files.length === 0) {
      console.error("At least one image is required.");
      return res
        .status(400)
        .json({ success: false, message: "At least one image is required." });
    }

    // Check if user is premium
    const user = await User.findById(userId); // Fetch user info to check premium status
    const isPremiumUser = user ? user.isPremium : false;

    const imageUploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { resource_type: "auto", folder: "property_images" },
            (error, result) => {
              if (error) {
                console.error("Cloudinary upload error:", error);
                return reject(new Error("Image upload failed."));
              }
              resolve(result.secure_url);
            }
          )
          .end(file.buffer);
      });
    });

    const imageUrls = await Promise.all(imageUploadPromises);

    const newProperty = new Property({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      type: req.body.type,
      for: req.body.for,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      address: req.body.address,
      bedrooms: req.body.bedrooms,
      hall: req.body.hall,
      kitchen: req.body.kitchen,
      bathrooms: req.body.bathrooms,
      area: req.body.area,
      ownerName: req.body.ownerName,
      ownerContact: req.body.ownerContact,
      ownerEmail: req.body.ownerEmail,
      images: imageUrls,
      userId: userId,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      createdAt: Date.now(),
      isPremiumUser: isPremiumUser, // Set the isPremiumUser field
    });

    const savedProperty = await newProperty.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Property listed successfully",
        data: savedProperty,
      });
  } catch (err) {
    console.error("Error listing property:", err);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

// Search properties based on parameters
exports.searchProperties = async (req, res) => {
  try {
    const {
      city,
      state,
      pincode,
      propertyType,
      bedrooms,
      bathrooms,
      halls,
      kitchens,
      area,
      for: forParam,
      sort,
    } = req.body;

    const query = {};
    if (city) query.city = city;
    if (state) query.state = state;
    if (pincode) query.pincode = pincode;
    if (propertyType) query.type = propertyType;
    if (forParam) query.for = forParam;
    if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };
    if (bathrooms) query.bathrooms = { $gte: Number(bathrooms) };
    if (halls) query.hall = { $gte: Number(halls) };
    if (kitchens) query.kitchen = { $gte: Number(kitchens) };
    if (area) query.area = { $gte: Number(area) };

    // Fetch properties
    const properties = await Property.find(query);

    // Sort properties
    const sortedProperties = properties.sort((a, b) => {
      // Priority to premium properties
      if (a.isPremiumUser && !b.isPremiumUser) return -1; // a is premium
      if (!a.isPremiumUser && b.isPremiumUser) return 1; // b is premium
      // If both are premium or both are not, sort by the requested sort order
      if (sort === "priceAsc") return a.price - b.price;
      if (sort === "priceDesc") return b.price - a.price;
      if (sort === "areaAsc") return a.area - b.area;
      if (sort === "areaDesc") return b.area - a.area;
      return 0; // No sorting
    });

    res.status(200).json({
      success: true,
      message: "Properties retrieved successfully",
      data: sortedProperties,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Server error: Unable to fetch properties. Please try again later.",
      error: error.message,
    });
  }
};

// Update a property
exports.updateProperty = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const updates = req.body;

    // Handle image uploads if provided
    if (req.files && req.files.length > 0) {
      const imageUploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { resource_type: "auto", folder: "property_images" },
              (error, result) => {
                if (error) {
                  console.error("Cloudinary upload error:", error);
                  return reject(new Error("Image upload failed."));
                }
                resolve(result.secure_url);
              }
            )
            .end(file.buffer);
        });
      });

      const imageUrls = await Promise.all(imageUploadPromises);
      updates.images = imageUrls; // Update images with new URLs
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      updates,
      { new: true }
    );

    if (!updatedProperty) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found." });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Property updated successfully.",
        data: updatedProperty,
      });
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

// Delete a property
// Delete a property and associated Cloudinary images
exports.deleteProperty = async (req, res) => {
  try {
    const propertyId = req.params.id;

    // Find the property to get the image URLs
    const property = await Property.findById(propertyId);

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found." });
    }

    // Extract Cloudinary public IDs from the image URLs
    const publicIds = property.images.map((url) => {
      // Assuming the URL structure is: https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}.{format}
      const parts = url.split("/");
      const publicIdWithFormat = parts[parts.length - 1];
      return publicIdWithFormat.split(".")[0]; // Remove file extension to get the public ID
    });

    // Delete each image from Cloudinary
    const deleteImagePromises = publicIds.map((publicId) =>
      cloudinary.uploader.destroy(publicId)
    );
    await Promise.all(deleteImagePromises);

    // Delete the property from the database
    await Property.findByIdAndDelete(propertyId);

    res
      .status(200)
      .json({
        success: true,
        message: "Property and associated images deleted successfully.",
      });
  } catch (error) {
    console.error("Error deleting property or images:", error);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
};
