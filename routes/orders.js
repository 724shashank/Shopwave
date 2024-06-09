const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const OrderHistory = require('../models/OrderHistory');
const Cart = require('../models/Cart');
/*const Product = require('../models/Product');*/


//1. Checkout and create an order history entry using POST "/api/order/checkout". Login is required.
router.post('/checkout', fetchuser, async (req, res) => {
    try {
        // Find the user's cart
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Your cart is empty' });
        }

       // Use the already calculated total price from the cart
       const totalAmount = cart.totalPrice;


        // Create a new order history entry
        const orderHistory = new OrderHistory({
            userId: req.user.id,
            items: cart.items.map(item => ({
                productId: item.product._id,
                quantity: item.quantity
            })),
            totalAmount:totalAmount, // Total price of all items in the cart
            orderDateNTime: new Date(),  // This will include both date and time
            orderStatus: 'Pending'  // Set initial order status
        });

        // Save the order history
        const savedOrderHistory = await orderHistory.save();

        // Clear the cart after saving the order history
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        // Respond with the saved order history
        res.json(savedOrderHistory);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;