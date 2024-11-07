const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser');
var upload = require('../middleware/upload');
const Product = require('../models/Product');
const { body, validationResult } = require('express-validator');

// Fetching the Product by ID: GET "/api/product/viewproduct/:id"
router.get('/viewproduct/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send("Product Not Found");
        }
        res.json(product);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Fetching all Products: GET "/api/product/viewproducts" (No login required)
router.get('/viewproducts', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Fetching Products by Category: GET "/api/product/categoryview/:category" (No login required)
router.get('/categoryview/:category', async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.category });
        res.json(products);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Fetching Products for a logged-in user: GET "/api/product/fetchproduct" (Login required)
router.get('/fetchproduct', fetchuser, async (req, res) => {
    try {
        const products = await Product.find({ supplier: req.user.id });
        res.json(products);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Adding a Product: POST "/api/product/addproduct" (Login required)
router.post('/addproduct', fetchuser, upload.single('imageUrl'), [
    body('name').isLength({ min: 5 }),
    body('description', 'Enter a Valid Description').isLength({ min: 10 }),
    body('category', 'Enter a Valid Category').exists(),
    body('price', 'Enter a Valid Price of the Product').exists(),
    body('brand', 'Brand Name').isLength({ min: 3 }).exists()
], async (req, res) => {
    try {
        const { name, description, price, category, brand } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Create a new product object
        const product = new Product({
            name,
            description,
            price,
            category,
            brand,
            supplier: req.user.id,
            imageUrl: req.file ? `Upload/Products/${req.file.filename}` : '' // Store the file path if image is uploaded
        });

        const savedProduct = await product.save();
        res.json(savedProduct);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});
// Updating the Product: PUT "/api/product/updateproduct/:id" (Login required)
router.put('/updateproduct/:id', fetchuser, upload.single('imageUrl'), async (req, res) => {
    const { name, description, category, price, brand} = req.body;

    const newProduct = {};
    if (name) newProduct.name = name;
    if (description) newProduct.description = description;
    if (category) newProduct.category = category;
    if (price) newProduct.price = price;
    if (brand) newProduct.brand = brand;
    if (req.file) newProduct.imageUrl = `/Upload/Products/${req.file.filename}`;

    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send("Product Not Found");
        }

        if (product.supplier.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: newProduct },
            { new: true }
        );

        res.json({ message: "Product Updated Successfully", product: updatedProduct });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Removing a Product: DELETE "/api/product/removeproduct/:id" (Login required)
router.delete('/removeproduct/:id', fetchuser, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).send("Product Not Found");
        }

        if (product.supplier.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        await Product.findByIdAndDelete(req.params.id);
        
        const products = await Product.find({ supplier: req.user.id });
        res.json(products);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router;
