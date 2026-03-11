const Donation = require('../models/Donation');
const Temple = require('../models/Temple');

// @desc    Make a donation
// @route   POST /api/donations
// @access  Private (Any authenticated user)
const createDonation = async (req, res) => {
    try {
        const { templeId, amount } = req.body;

        // Verify the temple exists
        const temple = await Temple.findById(templeId);
        if (!temple) {
            return res.status(404).json({ message: 'Temple not found' });
        }

        // Create the donation
        const donation = new Donation({
            userId: req.user.id,
            templeId,
            amount
        });

        const savedDonation = await donation.save();
        res.status(201).json({ message: 'Donation successful', donation: savedDonation });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user's donations
// @route   GET /api/donations/mydonations
// @access  Private
const getUserDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ userId: req.user.id })
            .populate('templeId', 'name location');
            
        res.status(200).json(donations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all donations (Admin view)
// @route   GET /api/donations
// @access  Private (Admin / Organizer)
const getAllDonations = async (req, res) => {
    try {
        // Populate both user details and temple details for the admin dashboard
        const donations = await Donation.find({})
            .populate('userId', 'name email')
            .populate('templeId', 'name');
            
        res.status(200).json(donations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createDonation,
    getUserDonations,
    getAllDonations
};