const mongoose = require('mongoose');
const mongoURI = process.env.MONGODB_URL;

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to Mongo Server");
    } catch (error) {
        console.error("Error connecting to Mongo Server:", error);
    }
};

module.exports = connectToMongo;
