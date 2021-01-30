const express = require('express');

require('dotenv').config();


fs = require('fs');


const mongoose = require('mongoose')

const app = require('../app');

const jwt = require('jsonwebtoken')
const joi=require('joi');
const bcrypt = require('bcrypt');
const user = require('../models/user');

var key = process.env.PRIVATEKEY;
const requests=require('../models/request.model');

const courseschedule=require('../models/courseschedule');
const location = require('../models/location');
const faculty = require('../models/faculty');
const department=require('../models/department');
const attendance=require('../models/attendance');
const tokenBlacklist = require('../models/tokenBlacklist');
const course=require('../models/courses');
const { string, date } = require('joi');
const courses = require('../models/courses');

var days=["saturday","sunday","monday","tuesday","wednesday","thursday"];
var types = ["hr", "hod", "ci", "cc", "am"];


const router = express.Router();
const cors = require('cors');
router.use(cors());
var verifyToken =async function (req, res, next) {

    try {
        var tokenString = jwt.verify(req.headers.token, key);
        req.id = tokenString.id;
        req.userType = tokenString.userType;
        if (tokenString.userType == "hr") {
            res.send("You are not an academic member " + req.userType);
            return;
        }
        const i=await tokenBlacklist.exists({token:req.headers.token});
        if(i){
            res.send("token expired please log in again ");
            return;
        }
        
        next();
    } catch (err) {
        console.log(err);
        res.send("Invalid token");
    }
};
router.use(verifyToken);
router.route("/sendlinkingrequest").post(async(req,res)=>{
    try{
        const schema=joi.object({
            reqid:joi.string().required(),
            id:joi.string().required(),
            slot:joi.number().required(),
            day:joi.string().required(),
            course:joi.string().required(),
            location:joi.string().required()
           // destinationid:joi.string().required()
        });
        const {error,value}=schema.validate(req.body);
        if(error!=undefined){
            console.log(error)
            res.send("please double check enterd data");
            return;
        }

        //check if this slot exists
        var exists=await courseschedule.findOne({
            courseid:value.course,day:value.day,location:value.location,slot:value.slot
        });
        if(!exists){
            res.send("this slot doesnt exist");
            return;
        }
        //make the request
       let destid=await courses.findOne({courseid:req.body.course})
       console.log(destid.cordinatorid)
        var newrequest= new requests.SlotLinkingRequest(
            {
                id:req.body.reqid,
                senderid:req.body.id,
                day:req.body.day,
                slot:req.body.slot,
                location:req.body.location,
                destinationid:destid.cordinatorid,
                course:req.body.course
            }
        )
          
        
        await newrequest.save();
        
    res.send("linking request sent"); 
    }catch(err){

        console.log(err);
        res.send("error occurred while sending request")
    }


});

router.route("/viewlinkingrequest").get(async(req,res)=>{
    try{
        var id=req.id;
        var results=await requests.SlotLinkingRequest.find({senderid:id});
        res.send(results);

    }catch(err){
        console.log(err);
        res.send("error occurred while viewing requests");
    }
    
})




module.exports = router;