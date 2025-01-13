const express = require('express');
const { getPatient } = require('../controllers/user.controller');
const router = express.Router();

router.get('/get-patient', getPatient);

module.exports = router;