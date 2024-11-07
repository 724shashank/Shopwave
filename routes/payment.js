const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();

// Initialize Razorpay with credentials
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Payment Controller Function for Creating an Order
const createOrder = async (req, res) => {
    const { amount, currency = 'INR', receipt } = req.body;

    // Validate input
    if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Valid amount is required' });
    }

    try {
        const options = {
            amount: amount * 100, // Convert amount to paise
            currency: currency,
            receipt,
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order', details: error.message });
    }
};

// Route to create an order
router.post('/order', createOrder);

module.exports = router;
