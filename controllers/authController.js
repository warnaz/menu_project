const User = require('../models/User.js')
const Role = require('../models/Role.js')
const bcrypt = require('bcrypt')
const express = require('express')
const session = require('express-session');
const crypto = require('crypto');
const Cookies = require('js-cookie')
const app = express()

const secretKey = crypto.randomBytes(32).toString('hex');
app.use(session({
  secret: secretKey, // Secret key for signing session cookies
  resave: false,
  saveUninitialized: false
}));

class authController {
    async index(req, res) {
        res.send('Its main page')
    }
    async showRegisterForm(req, res) {
        res.render('register')
    }

    async showLoginForm(req, res) {
        res.render('login')
    }

    async register(req, res) {
    const {
        username,
        password,
        confirmPassword
    } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).send('Password and confirmation do not match.');
    }

    try {

        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = await Role.findOne({value: "USER"})

        const newUser = new User({
            username,
            password: hashedPassword,
            roles: [userRole.value]
        });
        await newUser.save();

        res.status(201).send('User successfully registered!');
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).send('Something went wrong. Please try again.');
    }
}

    async login(req, res) {
    const {
        username,
        password
    } = req.body;

    try {

        const user = await User.findOne({
            username
        });

        if (!user) {
            return res.status(404).send('User not found.');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).send('Invalid password.');
        }

        Cookies.set('id',user._id)
        console.log(user._id.toString())

        res.redirect('/dashboard')
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Something went wrong. Please try again.');
    }
}

    async dashboard(req, res) {
        res.render('dashboard')
    }
}

module.exports = new authController()