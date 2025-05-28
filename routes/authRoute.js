// routes/authRoute.js

const express = require('express');
const { register, login, getAllUsers, getUserById, adminUpdateUser, adminDeleteUser, adminLogin } = require('../controllers/authController.js');
const verifyToken = require('../middlewares/verifyToken.js');

const router = express.Router();

router.post('/signup', register);
router.post('/login', login);
router.post('/admin/login', adminLogin);
router.get('/users',  getAllUsers);
router.put("/admin/users/:id", adminUpdateUser);
router.delete("/admin/users/:id", adminDeleteUser);
router.get('/user', verifyToken, getUserById);

// GET all users

module.exports = router;
