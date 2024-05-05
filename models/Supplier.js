const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String
    },  
    date:{
        type: Date,
        default:Date.now
    },
    productsSupplied: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
});

module.exports = mongoose.model('Supplier', supplierSchema);