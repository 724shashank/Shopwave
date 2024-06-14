const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Cart = require('../models/Cart');
/*const Ohstry = require('../models/OrderHistory');*/
const Product = require('../models/Product'); // Import the Product model
const { body, validationResult } = require('express-validator');

// 1. Adding items to the cart using POST "/api/cart/addtocart". Login is required.


router.post('/addtocart', fetchuser, [
    body('items').isArray().withMessage('Items should be an array'),
    body('items.*.productId', 'Product ID is required').notEmpty(),
    body('items.*.quantity', 'Enter a Valid Quantity').isInt({ min: 1 })
], async (req, res) => {
    try {
        // Extract items array from request body
        const { items } = req.body;

        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Find the user's cart or create a new one if it doesn't exist
        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [], totalPrice: 0 });
        }

        // Process each item in the items array
        for (const item of items) {
            const { productId, quantity } = item;

            // Find the product by ID
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            // Check if the product is already in the cart
            const existingCartItem = cart.items.find(cartItem => cartItem.product.toString() === productId);
            if (existingCartItem) {
                // If the product is already in the cart, increment the quantity
                existingCartItem.quantity += quantity;
            } else {
                // If the product is not in the cart, add it as a new item
                cart.items.push({ product: product._id, quantity: quantity });
            }
        }

        // Calculate the total price
        let totalPrice = 0;
        for (const item of cart.items) {
            // Populate the product details for calculating the price
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: 'Product not found during price calculation' });
            }
            totalPrice += item.quantity * product.price;
        }


        // Set the total price in the cart
        cart.totalPrice = totalPrice;

        // Save the updated cart
        const updatedCart = await cart.save();

        // Respond with the updated cart
        res.json(updatedCart);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


// 2. Removing the Items fromm the cart using DELETE "/api/cart/removeitem/:id". Login is required.

router.delete('/removeitem/:id', fetchuser, async (req, res) => {
    try {
        // Find the user's cart
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Your cart is empty' });
        }

        // Find the index of the item to be removed
        const itemIndex = cart.items.findIndex(item => item.product._id.toString() === req.params.id);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Remove the item from the cart
        cart.items.splice(itemIndex, 1);

        /* Calculate the total price after removing the item
        let newTotalPrice = 0;
        for (const item of cart.items) {
            newTotalPrice += item.product.price * item.quantity;
        }
        cart.totalPrice = newTotalPrice;

        (or we can use Reduce function to calculate the Final total value of cart)

        */
        const newTotalPrice = cart.items.reduce((total, item) => {
            return total + item.product.price * item.quantity;
        }, 0);

        cart.totalPrice = newTotalPrice;

        // Save the updated cart
        await cart.save();

        res.json({ message: 'Item removed successfully', cart });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;


