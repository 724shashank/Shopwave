require('dotenv').config({ path: '.env.local' });

const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

connectToMongo();

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = ['http://localhost:3001', 'https://your-production-frontend-url.com'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
}));

// Content Security Policy headers
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' blob: data:; script-src 'self'; style-src 'self' 'unsafe-inline'; trusted-types default;"
  );
  next();
});

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test Route
app.get('/api/test', (req, res) => {
  res.send("Test route is working!");
});

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

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to Shopwave backend!');
});

// Start the server
app.listen(port, () => {
  console.log(`Shopwave server listening at ${port}`);
});
