require('dotenv').config({ path: '.env.local' });

const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors"); // Import cors package
const path = require("path");
const bodyParser = require("body-parser");

// Connect to MongoDB
connectToMongo();

const app = express();
const port = process.env.PORT || 5000; // Default port set to 5000 if not specified

// CORS configuration
const allowedOrigins = [
  process.env.LOCALHOST, // Allow localhost for development
  process.env.FRONTEND,  // Allow frontend production URL (e.g., Vercel URL)
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests from the specified origins or if no origin is present (for server-side requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow request
    } else {
      callback(new Error('Not allowed by CORS')); // Reject request if the origin is not allowed
    }
  },
  methods: 'GET,POST,PUT,DELETE', // Allow only specific HTTP methods
  credentials: true, // Allow cookies and authorization headers to be sent
}));

// Middleware for JSON and URL-encoded data
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static file serving for product uploads
app.use(
  "/Upload/Products",
  express.static(path.join(__dirname, "Upload", "Products"))
);

// Define API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/product", require("./routes/product"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/searchProducts", require("./routes/searchBar"));
app.use("/api/payment", require("./routes/payment"));

// Serve static files from the root directory (optional)
app.use(express.static(path.join(__dirname)));

// Default route for server check
app.get('/', (req, res) => {
  res.send('Welcome to Shopwave backend!');
});

// Start the server
app.listen(port, () => {
  console.log(`Shopwave server listening at http://localhost:${port}`);
});
