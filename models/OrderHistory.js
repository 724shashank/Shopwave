const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the OrderHistory schema
const OrderHistorySchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
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
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    orderDateNTime: {
        type: Date,
        default: Date.now
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Processing', 'Confirmed', 'Delivered', 'Cancelled'],
        default: 'Confirmed'
    }
},{ collection: 'orderHistory' }); // Specify the custom collection name prevent the mongoose to pluralrize the name

// Create the OrderHistory model
const OrderHistory = mongoose.model('OrderHistory', OrderHistorySchema);

module.exports = OrderHistory;
