const express = require('express');
const router = express.Router();
const {
    getTemples,
    getTempleById,
    createTemple,
    updateTemple,
    deleteTemple
} = require('../controllers/templeController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Public route to get all temples, protected route to create one
router.route('/')
    .get(getTemples)
    .post(protect, authorize('ADMIN', 'ORGANIZER'), createTemple);

// Public route to get a single temple, protected routes to update/delete
router.route('/:id')
    .get(getTempleById)
    .put(protect, authorize('ADMIN', 'ORGANIZER'), updateTemple)
    .delete(protect, authorize('ADMIN'), deleteTemple); // Restricting deletion to ADMINs only

module.exports = router;