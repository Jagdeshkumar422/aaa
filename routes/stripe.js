const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_51RRsjBGbWNSYCGPpbxRWBnTGjPl4NGX52v6rMLhPg3dPJAEj6nqUZAThDpicp4kej3msMMtBuE6eY8rqplWmpgBq00EtzI3gIG'); // Replace with your Stripe secret key
const Subscription = require("../models/Subscriptions")
router.post('/create-checkout-session', async (req, res) => {
  const { userId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: 'price_1RRtTFGbWNSYCGPpXbkV1Rly', // Replace with your Stripe price ID
          quantity: 1,
        },
      ],
            success_url: `http://localhost:3000/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: 'http://localhost:3000/subscription-cancel',
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Stripe Error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/save-subscription', async (req, res) => {
  const { sessionId, userId } = req.body;
 
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    const startDate = new Date();
const endDate = new Date();
endDate.setMonth(endDate.getMonth() + 1); // Example: adds 1 month for monthly subscription

if (isNaN(endDate.getTime())) {
  console.error("Invalid endDate");
}


    const newSubscription = new Subscription({
      user: userId,
      stripeCustomerId: subscription.customer,
      stripeSubscriptionId: subscription.id,
      plan: subscription.items.data[0].price.nickname || 'Pro',
      status: subscription.status,
      startDate: startDate,
      endDate: endDate,
    });

    await newSubscription.save();
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Failed to save subscription:', err);
    res.status(500).json({ error: 'Failed to save subscription' });
  }
});


module.exports = router;
