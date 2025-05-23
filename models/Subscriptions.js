const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  stripeCustomerId: { 
    type: String, 
    required: true 
  },
  stripeSubscriptionId: { 
    type: String, 
    required: true,
    unique: true // Prevent duplicate subscriptions
  },
  plan: { 
    type: String, 
    default: 'Pro' 
  },
  status: { 
    type: String, 
    enum: ['active', 'incomplete', 'incomplete_expired', 'trialing', 'past_due', 'canceled', 'unpaid'], 
    default: 'active' 
  },
  startDate: { 
    type: Date 
  },
  endDate: { 
    type: Date 
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
