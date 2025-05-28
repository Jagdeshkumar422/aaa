const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscriptions');

// Optional middleware to restrict access to admin users
// const { verifyAdmin } = require('../middleware/auth');

// GET all subscriptions
router.get('/admin/subscriptions', async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
      .populate('user', 'email username') // Customize fields you want from the user
      .sort({ createdAt: -1 }); // Most recent first

    res.json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
