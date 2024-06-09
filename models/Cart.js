const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for items in the cart
const cartItemSchema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
});

// Define the schema for the cart
const cartSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [cartItemSchema], // Embed cartItemSchema as an array
    totalPrice: {
        type: Number,
        default: 0
    },
    orderDate: {
        type: Date,
        default: Date.now
    }
    
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;