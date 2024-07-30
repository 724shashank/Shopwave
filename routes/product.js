const express = require ('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser')
const Product = require('../models/Product');
const { body, validationResult } = require('express-validator');

//Fetching the Product by ID: GET "/api/product/viewproduct/:id"
try {
    router.get('/viewproduct/:id', async (req, res) => {
        const product = await Product.find({_id:req.params.id});
        res.json(product)
    })
} catch (error) {

    console.error(error.message)
    res.status(500).send("Internal Server Error");
}

//Fetching the Products: GET "/api/product/viewproducts" Login is not required
try {
    router.get('/viewproducts', async (req, res) => {
        const products = await Product.find({});
        res.json(products)
    })
} catch (error) {

    console.error(error.message)
    res.status(500).send("Internal Server Error");
}

//Fetching the Products: GET "/api/product/categoryview" Login is not required
try {
    router.get('/categoryview/:category',async (req, res) => {
        const products = await Product.find({category:req.params.category});
        res.json(products)
    })
} catch (error) {

    console.error(error.message)
    res.status(500).send("Internal Server Error");
}


//Fetching the Products: GET "/api/product/fetchproduct" Login is required

try {
    router.get('/fetchproduct', fetchuser, async (req, res) => {
        const product = await Product.find({ supplier: req.user.id });
        res.json(product)
    })
} catch (error) {

    console.error(error.message)
    res.status(500).send("Internal Server Error");
}


//Adding the Product:POST "/api/product/addproduct" Login is required
router.post('/addproduct', fetchuser, [
    body('name').isLength({ min: 5 }),
    body('description', 'Enter a Valid Description').isLength({ min: 10 }),
    body('category', 'Enter a Valid Category').exists(),
    body('price', 'Enter a Valid Price of the Product').exists(),
    body('brand', 'Brand Name').isLength({ min: 3 }).exists()], async (req, res) => {

        try {

            const { name, description, price, category, brand } = req.body

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            
            const product = new Product({
                name:name,
                description:description,
                price:price, 
                category:category, 
                brand:brand,
                supplier: req.user.id
            })
            const savedproduct = await product.save()
            res.json(product)

        }

        catch (error) {

            console.error(error.message)
            res.status(500).send("Internal Server Error");
        }

    })


//Updating the Product: put "/api/product/updateproduct" Login is required

router.put('/updateproduct/:id', fetchuser, async (req, res) => {
    const { name, description, category, price, brand, imageUrl } = req.body;

    // Create a new product object
    const newProduct = {};
    if (name) newProduct.name = name;
    if (description) newProduct.description = description;
    if (category) newProduct.category = category;
    if (price) newProduct.price = price;
    if (brand) newProduct.brand = brand;
    if (imageUrl) newProduct.imageUrl = imageUrl;

    try {
        // Find the product to be updated
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send("Product Not Found");
        }

        // Checking if the user is authorized
        if (product.supplier.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        // Update the product
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: newProduct },
            { new: true }
        );

        // Return the updated product
        res.json({ message: "Product Updated Successfully", product: updatedProduct });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});



//Removing the Product: Delete "/api/product/removeproduct/:id" Login is required

router.delete('/removeproduct/:id', fetchuser, async (req, res) => {
    try {
        // Find the Product to be removed
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send("Product Not Found");
        }

        // Checking if the user is valid or not
        if (product.supplier.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product Removed Successfully", product: product });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router