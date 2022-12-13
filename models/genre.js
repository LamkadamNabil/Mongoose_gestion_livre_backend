const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        maxLength: 32,
        trim: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Genre', genreSchema);