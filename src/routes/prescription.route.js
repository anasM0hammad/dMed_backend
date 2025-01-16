const express = require('express');
const { getAllPrescription, createPrescription, updatePrescription } = require('../controllers/prescription.controller');
const router = express.Router();

router.get('/get-prescription', getAllPrescription);
router.post('/create-prescription', createPrescription);
router.put('/update-prescription', updatePrescription);

module.exports = router;