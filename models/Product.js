const mongoose = require('mongoose');

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
        type: string,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier'
    },

});
module.exports = mongoose.model('Product', productSchema);