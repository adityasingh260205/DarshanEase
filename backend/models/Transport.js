const mongoose = require('mongoose');

const transportSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['BUS', 'TRAIN', 'FLIGHT'],
        required: [true, 'Please specify the type of transport']
    },
    operatorName: {
        type: String,
        required: [true, 'Please add the operator (e.g., Air India, VRL Travels)']
    },
    origin: {
        type: String,
        required: [true, 'Please add the departure city']
    },
    destination: {
        type: String,
        required: [true, 'Please add the destination city']
    },
    departureTime: {
        type: Date,
        required: [true, 'Please add departure date and time']
    },
    arrivalTime: {
        type: Date,
        required: [true, 'Please add arrival date and time']
    },
    pricePerSeat: {
        type: Number,
        required: [true, 'Please add the ticket price']
    },
    totalSeats: {
        type: Number,
        required: [true, 'Please add total capacity']
    },
    availableSeats: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Transport', transportSchema);