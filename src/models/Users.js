const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: { type: String, required: true},
    role: { type: String, required: true},
    nonce: { type: Number, required: true},
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;