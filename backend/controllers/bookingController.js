const Booking = require('../models/Booking');
const DarshanSlot = require('../models/DarshanSlot');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Any authenticated user)
const createBooking = async (req, res) => {
    try {
        const { slotId, numberOfTickets } = req.body;

        // 1. Find the slot the user wants to book
        const slot = await DarshanSlot.findById(slotId);

        if (!slot) {
            return res.status(404).json({ message: 'Darshan slot not found' });
        }

        // 2. Check if there are enough tickets available
        if (slot.availableTickets < numberOfTickets) {
            return res.status(400).json({ 
                message: `Only ${slot.availableTickets} tickets remaining for this slot` 
            });
        }

        // 3. Create the booking document
        const booking = new Booking({
            userId: req.user.id, // Comes from our protect middleware
            slotId,
            numberOfTickets
        });

        const createdBooking = await booking.save();

        // 4. Decrease the available tickets in the slot
        slot.availableTickets -= numberOfTickets;
        await slot.save();

        res.status(201).json(createdBooking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getUserBookings = async (req, res) => {
    try {
        // Find bookings for this user and populate the slot details
        const bookings = await Booking.find({ userId: req.user.id })
            .populate({
                path: 'slotId',
                populate: { path: 'templeId', select: 'name location' } // Nested population to get temple info
            });

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Ensure the user cancelling owns the booking (unless they are an admin)
        if (booking.userId.toString() !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Not authorized to cancel this booking' });
        }

        if (booking.status === 'CANCELLED') {
            return res.status(400).json({ message: 'Booking is already cancelled' });
        }

        // 1. Update booking status
        booking.status = 'CANCELLED';
        await booking.save();

        // 2. Restore the available tickets in the corresponding slot
        const slot = await DarshanSlot.findById(booking.slotId);
        if (slot) {
            slot.availableTickets += booking.numberOfTickets;
            await slot.save();
        }

        res.status(200).json({ message: 'Booking cancelled successfully', booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all bookings (Admin view)
// @route   GET /api/bookings
// @access  Private (Admin / Organizer)
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({})
            .populate('userId', 'name email')
            .populate({
                path: 'slotId',
                populate: { path: 'templeId', select: 'name' }
            });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBooking,
    getUserBookings,
    cancelBooking,
    getAllBookings
};