require('dotenv').config({ path: '.env.local' });

const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

connectToMongo();

const app = express();
const port = process.env.PORT;

app.use(cors({
  origin: 'https://your-frontend-url.com', // replace with your frontend URL
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
}));

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

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to Shopwave backend!');
});

// Start the server
app.listen(port, () => {
  console.log(`Shopwave server listening at http://localhost:${port}`);
});
