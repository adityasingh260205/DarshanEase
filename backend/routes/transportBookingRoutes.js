const express = require('express');
const router = express.Router();
const { bookTransport, getMyTransportBookings, cancelTransportBooking } = require('../controllers/transportBookingController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .post(protect, bookTransport);

router.route('/mybookings')
    .get(protect, getMyTransportBookings);

router.route('/:id/cancel')
    .put(protect, cancelTransportBooking);

module.exports = router;