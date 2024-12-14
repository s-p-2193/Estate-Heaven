const Razorpay = require('razorpay');
const User = require('../models/User'); // Adjust the path if necessary
require('dotenv').config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.checkPremium = async (req, res) => {
    const { userId } = req.params; // Assuming userId is passed as a URL parameter
  
    try {
      const user = await User.findById(userId).select('firstName lastName email isPremium premiumStartDate premiumEndDate');
  
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      // Return user premium status and details
      res.json({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isPremium: user.isPremium,
        premiumStartDate: user.premiumStartDate,
        premiumEndDate: user.premiumEndDate,
      });
    } catch (error) {
      console.error('Error fetching premium status:', error);
      res.status(500).json({ error: 'Failed to fetch premium status' });
    }
  };

exports.createOrder = async (req, res) => {
  const { amount, planType, userId } = req.body;
  
  try {
    // Set subscription amount based on plan type
    const planAmount = planType === 'monthly' ? 50 : 500;

    // Validate the received amount with the expected plan amount
    if (amount !== planAmount) {
      return res.status(400).json({ error: 'Invalid amount for the selected plan.' });
    }

// Create an order with Razorpay
const options = {
    amount: amount * 100, // Amount in paise for Razorpay
    currency: 'INR',
    receipt: `rcpt_${userId.slice(0, 6)}_${Date.now().toString().slice(-6)}`, // Shortened receipt identifier
  };

    const order = await razorpay.orders.create(options);

    // Calculate start and end dates based on plan type
    const startDate = new Date();
    const endDate = new Date();
    if (planType === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // Update user's premium status and subscription dates in the database
    const user = await User.findByIdAndUpdate(
      userId,
      {
        isPremium: true,
        premiumStartDate: startDate,
        premiumEndDate: endDate,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Respond with the created order details
    res.json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};
