// routes/authRoute.js

const express = require('express');
const { register, login } = require('../controllers/authController.js');

const router = express.Router();

router.post('/signup', register);
router.post('/login', login);

module.exports = router;
