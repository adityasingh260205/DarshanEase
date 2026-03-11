const TransportBooking = require('../models/TransportBooking');
const Transport = require('../models/Transport');

// @desc    Book transport tickets
// @route   POST /api/transport-bookings
// @access  Private (Any authenticated user)
const bookTransport = async (req, res) => {
    try {
        const { transportId, seatsBooked } = req.body;

        const transport = await Transport.findById(transportId);
        if (!transport) {
            return res.status(404).json({ message: 'Transport schedule not found' });
        }

        // Check availability
        if (transport.availableSeats < seatsBooked) {
            return res.status(400).json({ 
                message: `Only ${transport.availableSeats} seats remaining on this ${transport.type}` 
            });
        }

        // Calculate total price automatically
        const totalPrice = seatsBooked * transport.pricePerSeat;

        // Create booking
        const booking = new TransportBooking({
            userId: req.user.id,
            transportId,
            seatsBooked,
            totalPrice
        });

        const savedBooking = await booking.save();

        // Update available seats
        transport.availableSeats -= seatsBooked;
        await transport.save();

        res.status(201).json({ message: 'Ticket booked successfully', booking: savedBooking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's transport bookings
// @route   GET /api/transport-bookings/mybookings
// @access  Private
const getMyTransportBookings = async (req, res) => {
    try {
        const bookings = await TransportBooking.find({ userId: req.user.id })
            .populate('transportId', 'type operatorName origin destination departureTime arrivalTime');
        
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel a transport ticket
// @route   PUT /api/transport-bookings/:id/cancel
// @access  Private
const cancelTransportBooking = async (req, res) => {
    try {
        const booking = await TransportBooking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Verify ownership
        if (booking.userId.toString() !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (booking.status === 'CANCELLED') {
            return res.status(400).json({ message: 'Ticket is already cancelled' });
        }

        booking.status = 'CANCELLED';
        await booking.save();

        // Restore available seats
        const transport = await Transport.findById(booking.transportId);
        if (transport) {
            transport.availableSeats += booking.seatsBooked;
            await transport.save();
        }

        res.status(200).json({ message: 'Ticket cancelled successfully', booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { bookTransport, getMyTransportBookings, cancelTransportBooking };