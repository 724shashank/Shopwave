const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Cart = require('../models/Cart');
const Product = require('../models/Product'); // Import the Product model
const { body, validationResult } = require('express-validator');

// 1. Adding items to the cart using POST "/api/cart/addtocart". Login is required.


// Adding items to the cart
router.post('/addtocart/:productId/:quantity', fetchuser, async (req, res) => {
    try {
        const { productId, quantity } = req.params;
        const parsedQuantity = parseInt(quantity);

        if (isNaN(parsedQuantity) || parsedQuantity < 1) {
            return res.status(400).json({ message: 'Invalid quantity' });
        }

        let cart = await Cart.findOne({ user: req.user.id });

        // Initialize cart if not found
        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [], totalPrice: 0 });
        }

        // Ensure cart.items is an array
        if (!Array.isArray(cart.items)) {
            cart.items = [];
        }

        // Find the product by ID
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the product is already in the cart
        const existingCartItem = cart.items.find(cartItem => cartItem.product.toString() === productId);
        if (existingCartItem) {
            existingCartItem.quantity = parsedQuantity;

            // Remove the item if quantity is zero or less
            if (existingCartItem.quantity <= 0) {
                cart.items = cart.items.filter(cartItem => cartItem.product.toString() !== productId);
            }
        } else if (parsedQuantity > 0) {
            cart.items.push({ product: product._id, quantity: parsedQuantity });
        }

        // Recalculate the total price
        let totalPrice = 0;
        for (const item of cart.items) {
            const prod = await Product.findById(item.product);
            if (!prod) {
                return res.status(404).json({ message: 'Product not found during price calculation' });
            }
            totalPrice += item.quantity * prod.price;
        }

        cart.totalPrice = totalPrice.toFixed(2);
        const updatedCart = await cart.save();

        // Send back the updated cart and confirmation message
        res.json({
            success: true,
            productId,
            quantity: parsedQuantity
           
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// 2. Removing the Items fromm the cart using DELETE "/api/cart/removeitem/:id". Login is required.

router.delete('/removeitem/:productId', fetchuser, async (req, res) => {
    try {
        const { productId } = req.params;

        // Find the user's cart
        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the item in the cart
        const itemIndex = cart.items.findIndex(cartItem => cartItem.product.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Remove the item from the cart
        cart.items.splice(itemIndex, 1);

        // Recalculate the total price
        let totalPrice = 0;
        for (const item of cart.items) {
            const prod = await Product.findById(item.product);
            if (!prod) {
                return res.status(404).json({ message: 'Product not found during price calculation' });
            }
            totalPrice += item.quantity * prod.price;
        }

        // Set the total price in the cart
        cart.totalPrice = totalPrice.toFixed(2);

        // Save the updated cart
        const updatedCart = await cart.save();

        // Respond with the updated cart
        res.json(updatedCart);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});
// 3. Fetching cart details using GET "/api/cart/cartDetails". Login is required.

router.get('/cartDetails', fetchuser, async (req, res) => {
    try {
        const cartDetails = await Cart.findOne({ user: req.user.id });
        if (!cartDetails) {
            return res.status(404).json({ error: "Cart not found" });
        }
        res.json(cartDetails);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router;


