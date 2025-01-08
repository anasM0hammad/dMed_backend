const express = require('express');
const { login, signup, getNonce } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('/get-nonce', getNonce);

module.exports = router;