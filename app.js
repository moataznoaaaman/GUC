const express = require('express');

const mongoose = require('mongoose');

//requiring the DB models to be able to add elements to our DB with these models
var user = require('./models/user');


//to be able to use .env
require('dotenv').config();


const jwt = require('jsonwebtoken')

//importing the login_routes to be able to redirect to it
const login = require('./routes/login_route.js');

const am=require('./routes/am_route');
const hr = require('./routes/hr_route.js');
const am1=require('./routes/am1_route');
const request = require('./routes/request.js');
const cc=require('./routes/cc1_route');
//const request = require('./routes/request.js');
const hod=require('./routes/hod_route.js');
const ci=require('./routes/ci_routes.js');

var app=express();
const cors = require('cors');
app.use(cors());
//var app = express();
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

//any localhost:3000/authentication/....
//2-GUC Staff Members Functionalities are here
app.use('/authentication',login);
app.use('/hr',hr);

app.use('/request', request);
app.use('/cc',cc);
app.use('/request', request);
app.use('/hod',hod);
app.use('/ci',ci);
app.use('/am1',am1);
app.use('/am',am);



//exporting app to be able to use it in the rest of our files
module.exports.app=app;