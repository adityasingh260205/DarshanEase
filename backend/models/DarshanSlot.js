const mongoose = require('mongoose');

const darshanSlotSchema = new mongoose.Schema({
    templeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Temple', // Links to the Temple model
        required: true
    },
    date: {
        type: Date,
        required: [true, 'Please add a date for the slot']
    },
    time: {
        type: String,
        required: [true, 'Please add a time (e.g., 08:00 AM - 10:00 AM)']
    },
    capacity: {
        type: Number,
        required: [true, 'Please define total capacity for this slot']
    },
    availableTickets: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('DarshanSlot', darshanSlotSchema);