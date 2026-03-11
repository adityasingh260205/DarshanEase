const mongoose = require('mongoose');

const templeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a temple name'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Please add a location']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    images: {
        type: [String], // Array of image URLs
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model('Temple', templeSchema);