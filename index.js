require('dotenv').config({ path: '.env.local' });

const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

connectToMongo();

const app = express();
const port = process.env.PORT || 5000;

// Middleware to handle CORS for all routes, including preflight requests
app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:3001', 'https://your-production-frontend-url.com'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from 'Upload/Products'
app.use(
  "/Upload/Products",
  express.static(path.join(__dirname, "Upload", "Products"))
);

// Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/product", require("./routes/product"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/searchProducts", require("./routes/searchBar"));
app.use("/api/payment", require("./routes/payment")); // Payment routes

// Serve static files from the root directory (if needed)
app.use(express.static(path.join(__dirname)));

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to Shopwave backend!');
});

// Start the server
app.listen(port, () => {
  console.log(`Shopwave server listening at http://localhost:${port}`);
});
