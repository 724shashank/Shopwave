const express = require('express');
const router = express.Router();
const Products = require('../models/Product');

router.get('/results', async (req, res) => {
  try {
      const products = await Products.find({});
      res.json(products);
  } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
  }
});


module.exports = router;
