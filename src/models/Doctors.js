const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    _id: { type: String, required: true},
    first_name: { type: String, required: true},
    last_name: { type: String, required: true},
    gender: { type: String, required: true},
    degree: { type: String, required: true},
}, { timestamps: true });

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor; 