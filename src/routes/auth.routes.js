const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');


router.post('/register', authController.registerUser)  //route for user registration, when a post request is made to /register, the registerUser function from authController will be called


router.post('/login', authController.loginUser)  //route for user login, when a post request is made to /login, the loginUser function from authController will be called

module.exports = router;