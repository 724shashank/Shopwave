const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        default: '/icons/Not_Found.png'
    },
    
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

});
const Product = mongoose.model('Product', productSchema);

module.exports = Product;