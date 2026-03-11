const express = require('express');
const router = express.Router();
const {
    createBooking,
    getUserBookings,
    cancelBooking,
    getAllBookings
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Standard user routes
router.route('/')
    .post(protect, createBooking)
    .get(protect, authorize('ADMIN', 'ORGANIZER'), getAllBookings); // Admins can see all

router.route('/mybookings')
    .get(protect, getUserBookings);

router.route('/:id/cancel')
    .put(protect, cancelBooking);

module.exports = router;