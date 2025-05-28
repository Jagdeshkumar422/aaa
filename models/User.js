const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String },
  password: { type: String, required: true },
  status: {type: String, default: "active"}
});

module.exports = mongoose.model('User', userSchema);
