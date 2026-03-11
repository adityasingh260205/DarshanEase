const express = require('express');
const router = express.Router();
const {
    getSlotsByTemple,
    createSlot,
    deleteSlot
} = require('../controllers/slotController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Route to create a slot (Protected)
router.route('/')
    .post(protect, authorize('ADMIN', 'ORGANIZER'), createSlot);

// Route to get all slots for a specific temple (Public)
router.route('/temple/:templeId')
    .get(getSlotsByTemple);

// Route to delete a specific slot (Protected)
router.route('/:id')
    .delete(protect, authorize('ADMIN', 'ORGANIZER'), deleteSlot);

module.exports = router;