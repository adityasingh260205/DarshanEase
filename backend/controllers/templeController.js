const Temple = require('../models/Temple');

// @desc    Fetch all temples
// @route   GET /api/temples
// @access  Public
const getTemples = async (req, res) => {
    try {
        const temples = await Temple.find({});
        res.status(200).json(temples);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single temple
// @route   GET /api/temples/:id
// @access  Public
const getTempleById = async (req, res) => {
    try {
        const temple = await Temple.findById(req.params.id);
        if (temple) {
            res.status(200).json(temple);
        } else {
            res.status(404).json({ message: 'Temple not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a temple
// @route   POST /api/temples
// @access  Private (Admin / Organizer)
const createTemple = async (req, res) => {
    try {
        const { name, location, description, images } = req.body;

        const temple = new Temple({
            name,
            location,
            description,
            images
        });

        const createdTemple = await temple.save();
        res.status(201).json(createdTemple);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a temple
// @route   PUT /api/temples/:id
// @access  Private (Admin / Organizer)
const updateTemple = async (req, res) => {
    try {
        const { name, location, description, images } = req.body;
        const temple = await Temple.findById(req.params.id);

        if (temple) {
            temple.name = name || temple.name;
            temple.location = location || temple.location;
            temple.description = description || temple.description;
            temple.images = images || temple.images;

            const updatedTemple = await temple.save();
            res.status(200).json(updatedTemple);
        } else {
            res.status(404).json({ message: 'Temple not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a temple
// @route   DELETE /api/temples/:id
// @access  Private (Admin only)
const deleteTemple = async (req, res) => {
    try {
        const temple = await Temple.findById(req.params.id);

        if (temple) {
            await temple.deleteOne();
            res.status(200).json({ message: 'Temple removed successfully' });
        } else {
            res.status(404).json({ message: 'Temple not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTemples,
    getTempleById,
    createTemple,
    updateTemple,
    deleteTemple
};