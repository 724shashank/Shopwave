const mongoose= required ('mongoose');

const userSchema =new Schema({
    profilepic: {
        type: String,
        default: 'default.jpg' 
    },
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,                                                                                                                                                                     
        unique: true
    },
    phone:{
        type: Number,
        required: true,                                                                                                                                                                     
        unique: true
    },
    password:{
        type: String,
        required: true
    },    
    address:{
        type: String,
        required: true
    },                                                                                  
    date:{
        type: Date,
        default:Date.now
    },

});

module.exports = mongoose.model('User', userSchema);