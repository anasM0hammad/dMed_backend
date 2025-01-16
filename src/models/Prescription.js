const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId , require: true },
    doctor: { type: String, required: true },
    patient: { type: String, required: true },
    status: { type: String, required: true },
    tokenId: { type: String, required: false },
    cost: { type: Number, required: false},
    tokenURI: { type: String, required: false}
}, { timestamps: true });

const Prescription = mongoose.model('Prescription', PrescriptionSchema);

module.exports = Prescription;