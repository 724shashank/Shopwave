const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    usertype: {
        type: String,
        required: true,
    },
    profilepic: {
        type: String,
        default: 'default.jpg'
    },
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
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});
const User = mongoose.model('User', userSchema);

module.exports = User;
