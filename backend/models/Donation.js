const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    templeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Temple',
        required: true
    },
    amount: {
        type: Number,
        required: [true, 'Please add a donation amount'],
        min: [1, 'Donation amount must be at least 1']
    }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);