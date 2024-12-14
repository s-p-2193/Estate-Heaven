const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: function() { return !this.isGoogleUser; } },
  phone: { type: String, trim: true },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  isGoogleUser: { type: Boolean, default: false },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  // Premium-related fields
  isPremium: { type: Boolean, default: false },
  premiumStartDate: { type: Date },
  premiumEndDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
