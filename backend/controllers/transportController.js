const Transport = require('../models/Transport');

// @desc    Add a new transport schedule (Flight, Bus, Train)
// @route   POST /api/transport
// @access  Private (Admin / Organizer)
const addTransport = async (req, res) => {
    try {
        const { type, operatorName, origin, destination, departureTime, arrivalTime, pricePerSeat, totalSeats } = req.body;

        const transport = new Transport({
            type,
            operatorName,
            origin,
            destination,
            departureTime,
            arrivalTime,
            pricePerSeat,
            totalSeats,
            availableSeats: totalSeats // Initially, all seats are available
        });

        const savedTransport = await transport.save();
        res.status(201).json(savedTransport);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all transport schedules (with optional search/filters)
// @route   GET /api/transport
// @access  Public
const getTransports = async (req, res) => {
    try {
        // Build a query object based on URL parameters (e.g., ?type=FLIGHT&origin=Delhi)
        const query = {};
        if (req.query.type) query.type = req.query.type;
        if (req.query.origin) query.origin = req.query.origin;
        if (req.query.destination) query.destination = req.query.destination;

        const transports = await Transport.find(query);
        res.status(200).json(transports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a transport schedule
// @route   DELETE /api/transport/:id
// @access  Private (Admin only)
const deleteTransport = async (req, res) => {
    try {
        const transport = await Transport.findById(req.params.id);

        if (transport) {
            await transport.deleteOne();
            res.status(200).json({ message: 'Transport schedule removed successfully' });
        } else {
            res.status(404).json({ message: 'Transport not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addTransport, getTransports, deleteTransport };