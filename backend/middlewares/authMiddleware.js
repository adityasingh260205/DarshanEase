const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. Protect routes (Check if user is logged in with a valid token)
const protect = async (req, res, next) => {
    let token;

    // Check if the authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token from the header (Format: "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using our secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch the user from the database and attach it to the request object (excluding the password)
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Move on to the actual route controller
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

// 2. Role Authorization (Check if the user has the right permissions)
const authorize = (...roles) => {
    return (req, res, next) => {
        // If the user's role is not included in the allowed roles array, deny access
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `User role '${req.user.role}' is not authorized to access this route` 
            });
        }
        next(); // Move on to the actual route controller
    };
};

module.exports = { protect, authorize };