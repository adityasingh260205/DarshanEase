const mongoose = require('mongoose');

const transportBookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    transportId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transport',
        required: true
    },
    seatsBooked: {
        type: Number,
        required: [true, 'Please specify the number of seats'],
        min: 1
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['CONFIRMED', 'CANCELLED'],
        default: 'CONFIRMED'
    }
}, { timestamps: true });

module.exports = mongoose.model('TransportBooking', transportBookingSchema);