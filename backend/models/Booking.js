const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    slotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DarshanSlot',
        required: true
    },
    numberOfTickets: {
        type: Number,
        required: [true, 'Please specify the number of tickets'],
        min: 1
    },
    status: {
        type: String,
        enum: ['CONFIRMED', 'CANCELLED'],
        default: 'CONFIRMED'
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);