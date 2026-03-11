const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
    // Generates a token containing the user's ID and Role, expiring in 30 days
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = generateToken;