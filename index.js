const connectToMongo= require('./db');
const express = require('express');
const cors = require('cors'); // Import the cors package

connectToMongo();

const app = express()
const port = 5000

app.use(cors()); // Enable CORS for all routes
app.use(express.json())

//Available Routes


app.use('/api/auth',require('./routes/auth'))
app.use('/api/product',require('./routes/product'))
app.use('/api/cart',require('./routes/cart'))
app.use('/api/orders',require('./routes/orders'))

app.listen(port, () => {
  console.log(`Shopwave Port Listening at ${port}`)
})