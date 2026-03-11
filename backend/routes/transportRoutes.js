const express = require('express');
const router = express.Router();
const { addTransport, getTransports, deleteTransport } = require('../controllers/transportController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
    .get(getTransports)
    .post(protect, authorize('ADMIN', 'ORGANIZER'), addTransport);

router.route('/:id')
    .delete(protect, authorize('ADMIN'), deleteTransport);

module.exports = router;