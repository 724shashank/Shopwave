const mongoose = require('mongoose');

const paymentDetailsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    transactionId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Success', 'Failed'],
        default: 'Pending'
    },
    paymentDateTime: {
        type: Date,
        default: Date.now
    },
    paymentGatewayDetails: {
        type: String
    }
});

module.exports = mongoose.model('PaymentDetails', paymentDetailsSchema);
