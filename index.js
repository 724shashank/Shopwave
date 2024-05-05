const connectToMongo= require('./db');
const express = require('express');
connectToMongo();



const app = express()
const port = 5000

//Available Routes

app.use('/api/admin',require('./routes/admin'))
app.use('/api/auth',require('./routes/auth'))
app.use('/api/orders',require('./routes/orders'))
app.use('/api/payment',require('./routes/payment'))
app.use('/api/product',require('./routes/product'))
app.use('/api/profile',require('./routes/profile'))

app.listen(port, () => {
  console.log(`Shopwave Port Listening at ${port}`)
})