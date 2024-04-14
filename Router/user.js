const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const books = require('../models/books');
const Category = require('../models/Category');
const User = require('../models/user');







// routes/auth.js

const router = express.Router();

// Login page
router.get('/login', (req, res) => {
    res.render('login'); // Render the login page view
});

// Login form submission
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Check if username and password are valid (e.g., compare against records in the database)
    if (username === 'example' && password === 'password') {
        req.session.user = username; // Store user information in session
        res.redirect('/dashboard'); // Redirect to dashboard upon successful login
    } else {
        res.render('login', { error: 'Invalid username or password' }); // Render login page with error message
    }
});



// Registration page
router.get('/register', (req, res) => {
    res.render('register'); // Render the registration page view
});

// Registration form submission
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('register', { error: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        // Save the new user to the database
        await newUser.save();
        res.redirect('/login'); // Redirect to login page upon successful registration
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;
