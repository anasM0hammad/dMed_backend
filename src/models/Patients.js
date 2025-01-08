const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    _id: { type: String, required: true},
    first_name: { type: String, required: true},
    last_name: { type: String, required: true},
    gender: { type: String, required: true},
    dob: { type: String, required: true},
}, { timestamps: true });

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient; 