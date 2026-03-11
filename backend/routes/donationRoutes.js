const express = require('express');
const router = express.Router();
const {
    createDonation,
    getUserDonations,
    getAllDonations
} = require('../controllers/donationController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Standard user route to make a donation and Admin route to view all
router.route('/')
    .post(protect, createDonation)
    .get(protect, authorize('ADMIN', 'ORGANIZER'), getAllDonations);

// Standard user route to view their own donation history
router.route('/mydonations')
    .get(protect, getUserDonations);

module.exports = router;