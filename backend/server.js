const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const templeRoutes = require('./routes/templeRoutes');
const slotRoutes = require('./routes/slotRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const donationRoutes = require('./routes/donationRoutes');

const transportRoutes = require('./routes/transportRoutes');
const transportBookingRoutes = require('./routes/transportBookingRoutes');
// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parses incoming JSON requests
app.use(cors()); // Enables Cross-Origin Resource Sharing (allows frontend to talk to backend)

// HTTP request logger middleware for development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Basic health-check route
app.get('/', (req, res) => {
    res.send('DarshanEase API is running smoothly...');
});

// Set port and start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

app.use('/api/auth', authRoutes);
app.use('/api/temples', templeRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/donations', donationRoutes);

app.use('/api/transport', transportRoutes);
app.use('/api/transport-bookings', transportBookingRoutes);