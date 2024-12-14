const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Make sure you import the User model
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

const googleAuth = async (req, res, action) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        });

        const { email, name } = ticket.getPayload();
        const [firstName, lastName] = name.split(" ");

        let user = await User.findOne({ email });

        if (!user) {
            if (action === 'signup') {
                user = new User({
                    firstName,
                    lastName,
                    email,
                    isGoogleUser: true,
                });
                await user.save();
            } else {
                return res.status(400).json({ message: 'User not found. Please signup first.' });
            }
        } else {
            user.isGoogleUser = true; // Optional, depending on your use case
            await user.save();
        }

        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Add `id` as an alias for `_id` in the response user object
        const responseUser = { ...user._doc, id: user._id };

        res.status(200).json({ token: jwtToken, user: responseUser });
    } catch (error) {
        console.error('Google authentication error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Export the googleAuth function
module.exports = {
    googleAuth,
};
