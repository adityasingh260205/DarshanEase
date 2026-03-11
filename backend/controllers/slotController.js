const DarshanSlot = require('../models/DarshanSlot');
const Temple = require('../models/Temple');

// @desc    Get all slots for a specific temple
// @route   GET /api/slots/temple/:templeId
// @access  Public
const getSlotsByTemple = async (req, res) => {
    try {
        const slots = await DarshanSlot.find({ templeId: req.params.templeId });
        res.status(200).json(slots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new darshan slot
// @route   POST /api/slots
// @access  Private (Admin / Organizer)
const createSlot = async (req, res) => {
    try {
        const { templeId, date, time, capacity } = req.body;

        // Verify that the temple actually exists in the database
        const temple = await Temple.findById(templeId);
        if (!temple) {
            return res.status(404).json({ message: 'Temple not found' });
        }

        // Create the slot. Note that availableTickets starts equal to total capacity
        const slot = new DarshanSlot({
            templeId,
            date,
            time,
            capacity,
            availableTickets: capacity 
        });

        const createdSlot = await slot.save();
        res.status(201).json(createdSlot);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a slot
// @route   DELETE /api/slots/:id
// @access  Private (Admin / Organizer)
const deleteSlot = async (req, res) => {
    try {
        const slot = await DarshanSlot.findById(req.params.id);

        if (slot) {
            await slot.deleteOne();
            res.status(200).json({ message: 'Slot removed successfully' });
        } else {
            res.status(404).json({ message: 'Slot not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSlotsByTemple,
    createSlot,
    deleteSlot
};