const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
var fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = "Thisisa@#secretkey ";

// Creating a USER using POST "/api/auth/createuser"
router.post('/createuser', [
    body('usertype').exists(),
    body('name', 'Enter a Valid Name').isLength({ min: 3 }),
    body('email', 'Enter a Valid Email').isEmail(),
    body('phone', 'Enter a Valid Phone No.').isLength({ min: 10 }),
    body('password', 'Password Must be at least 5 Characters').isLength({ min: 5 }),
    body('address', 'Address Must be at least 20 Characters').isLength({ min: 20 })
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        var user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "With This Email An account Already Exists" })
        }

        var user = await User.findOne({ phone: req.body.phone });
        if (user) {
            return res.status(400).json({ error: "With This Phone No. An account Already Exists" })
        }

        else {
            const salt = await bcrypt.genSalt(10)
            secPass = await bcrypt.hash(req.body.password, salt);

            user = await User.create({
                usertype: req.body.usertype,
                profilepic: req.body.profilepic,
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: secPass,
                address: req.body.address,
            })
        };
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);

        return res.status(200).json({ message: "User created successfully", authtoken });
    }
    catch (error) {

        console.error(error.message)
        res.status(500).send("Internal Server Error");
    }

});

//  Authenticating a USER using POST "/api/auth/login"

router.post('/login', [
    body('email', 'Enter a Valid Email or Phone No.').isEmail().optional(),
    body('phone', 'Enter a Valid Email or Phone No.').isLength({ min: 10 }).optional(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, phone, password } = req.body;
    try {
        let user;
        // Check if the input matches an email
        if (email) {
            user = await User.findOne({ email });
        }
        // If not, check if the input matches a phone number
        if (!user && phone) {
            user = await User.findOne({ phone });
        }
        // If no user found, return error
        if (!user) {
            return res.status(400).json({ error: "Try to login with correct Credentials" });
        }
        // If user found, compare passwords
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Try to login with correct Credentials" });
        }
        // If passwords match, generate and return JWT token
        const data = {
            user: {
                id: user.id
            }
        };
        const authtoken = jwt.sign(data, JWT_SECRET);
        return res.json({ authtoken });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error");
    }
});

//Get Loggedin User Details using POST "/api/auth/getuser"
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;