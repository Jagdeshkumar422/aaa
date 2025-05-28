const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Subscription = require("../models/Subscriptions.js")

// REGISTER CONTROLLER
exports.register = async (req, res) => {
  const { email, username, password, confirmPassword } = req.body;

  // Validate input
  if (!email || !username || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// LOGIN CONTROLLER
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id },
      "secret-key",
      { expiresIn: '1d' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const subscription = await Subscription.findOne({ user: user._id });

    res.status(200).json({
      user,
      subscription
    });
  } catch (err) {
    console.error("Get user by ID error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// Get all users (admin access ideally)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    // Fetch all subscriptions
    const subscriptions = await Subscription.find();

    // Map subscriptions to users
    const usersWithSubscriptions = users.map((user) => {
      const userSub = subscriptions.find(
        (sub) => sub.user.toString() === user._id.toString()
      );
      return {
        ...user._doc,
        subscription: userSub || null,
      };
    });

    res.status(200).json({ users: usersWithSubscriptions });
  } catch (err) {
    console.error("Get all users error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// UPDATE USER CONTROLLER
// ADMIN UPDATE USER CONTROLLER
exports.adminUpdateUser = async (req, res) => {
  const { email, username, status } = req.body;
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update user fields if provided
    if (email) user.email = email;
    if (username) user.username = username;
    if (status) user.status = status
    await user.save();

    // Optionally update subscription status
   
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Admin update user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ADMIN DELETE USER CONTROLLER
exports.adminDeleteUser = async (req, res) => {
  const { id } = req.params; // user ID from URL

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete subscription if exists
    await Subscription.deleteOne({ user: user._id });

    // Delete user
    await User.deleteOne({ _id: id });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Admin delete user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.adminLogin =  (req, res) => {
  const { email, password } = req.body;

  // Hardcoded admin credentials (for demo only)
  const ADMIN_EMAIL = 'admin@gmail.com';
  const ADMIN_PASSWORD = 'admin123';

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return res.json({ success: true, token: 'dummy-admin-token' });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
};