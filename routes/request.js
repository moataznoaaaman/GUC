const express = require('express');
const mongoose = require('mongoose');
const app = require('../app');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

fs = require('fs');
require('dotenv').config();

var key = process.env.PRIVATEKEY;

const router = express.Router();
const location = require('../models/location');
const faculty = require('../models/faculty');


var verifyToken = (req, res, next) => {
    try {
        var tokenString = jwt.verify(req.headers.token, key);
        
        req.id = tokenString.id;
        req.userType = tokenString.userType;

        next();
    } catch (err) {
        console.log(err);
        res.send('Invalid Token');
    }
};

// Getting a request
router.route('/get/').get(async (req, res) => {     // Getting all requests

});


router.route('/get/:requestid').get();

// Adding a request
router.route('/add/:requestType').post(async (req, res) => {    // Posting a request, input: request type
    
});


// Updating a request (accepting, rejecting, editing)



// Deleting a request



module.exports = router;
