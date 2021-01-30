const express = require('express');

require('dotenv').config();


fs = require('fs');


const mongoose = require('mongoose')

const app = require('../app');

const jwt = require('jsonwebtoken')
const joi=require('joi');
const bcrypt = require('bcrypt');
const user = require('../models/user');


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
var key = process.env.PRIVATEKEY;
const cors = require('cors');
router.use(cors());
let tokenString;
var verifyToken =async function (req, res, next) {

    try {
         tokenString = jwt.verify(req.headers.token, key);
        req.id = tokenString.id;
        req.userType = tokenString.userType;
        if (tokenString.userType != "cc") {
            res.send("You dont have permission for cc ur type is " + req.userType);
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

router.route("/viewslotlinking").get(async(req,res)=>{
    try{
    var id=tokenString.id;
    // var cours=await courses.find({cordinatorid:id},{_id:0}).select('courseid');
    // //courses which this cord gives
    // var cordcourses=[];
    // for(var i=0;i<cours.length;i++){
    //     cordcourses.push(cours[i].courseid);
    // }
    //i saved 2 requests with the course
    
    var results=await requests.SlotLinkingRequest.find({destinationid:id,status:"pending"},{_id:0});

    res.send(results);
    }
    catch(err){
        console.log(err);
        res.send('error occurred    ')
    }


});

router.route("/acceptslotlinking").post(async(req,res)=>{
    try{
        const schema=joi.object({
            id:joi.string().required(),//reqid
             //answer:joi.string().required(),
            // course:joi.string().required()
        });
        const {error,value}=schema.validate(req.body);
        if(error!=undefined){
            res.send(error.details[0].message);
            return;
        }
        const r=await requests.SlotLinkingRequest.findOne({id:req.body.id});
        if(r==undefined){
            res.send("cannot find the request");
        }
        const slot=await courseschedule.findOne({courseid:r.course,location:r.location,slot:r.slot,day:r.day});
        if (slot) {
            if(slot.userid==undefined){
                await courseschedule.findOneAndUpdate({courseid:r.course,location:r.location,slot:r.slot,day:r.day},{userid:r.senderid});
                await requests.SlotLinkingRequest.findOneAndUpdate(value,{status:"accepted"});
                res.send("request accepted and slot has been updated")
            }else{
                res.send("this slot is already taken by another ta or it dosent exist");

            }
            
        }res.send("slot dosent exist");
        
    }catch(err){
        console.log(err);
        res.send("an error has occurred");
    }

});
router.route("/rejectslotlinking").post(async(req,res)=>{

    try{
        const schema=joi.object({
            id:joi.string().required(),
            // senderid:joi.string().required(),
            // course:joi.string().required()
        });
        const {error,value}=schema.validate(req.body);
        if(error!=undefined){
            res.send(error.details[0].message);
            return;
        }
        const r=await requests.SlotLinkingRequest.findOne(value);
        if(!r){
            res.send("cant find this request");
            return;
        }
        if(r.status=="accepted"){
            res.send("cannot reject an already accepted request");
            return;
        }
        await requests.SlotLinkingRequest.findOneAndUpdate(value,{status:"rejected"});
        res.send("request has been rejected")

    }catch(err){
        console.log(err);
        res.send("an error has occurred");
    }

});
router.route("/editcourseschedule")
.get(async(req,res)=>{

    var results=await courseschedule.find();
    res.send(results);
})
.post(async(req,res)=>{
    try{
    const schema=joi.object({
        //courseid, day,slot, location
        courseid:joi.string().required(),
        day:joi.string().required(),
        slot:joi.number().required(),
        location:joi.string().required(),
        //userid:joi.string()
    });
    const {error,value}=schema.validate(req.body);
    if(error!=undefined){
        res.send(error.details[0].message);
        return;
    }
    let exist=await courses.findOne({courseid:req.body.courseid})
    if (exist) {
        var newslot= new courseschedule(value);;
    await newslot.save();
    res.send("slot added")
    } else {
        res.send("no such course")
    }
    
}
catch(err){
    console.log(err)
    res.send('error occurred while adding slot')
}


})
.put(async(req,res)=>{
    try{
        const schema=joi.object({
            //courseid, day,slot, location
            courseid:joi.string().required(),
            day:joi.string().required(),
            slot:joi.number().required(),
            location:joi.string().required(),
            nday:joi.string().required(),
            nslot:joi.number().required(),
            nlocation:joi.string().required(),
           // userid:joi.string()
        });
        const {error,value}=schema.validate(req.body);
        if(error!=undefined){
            res.send(error.details[0].message);
            return;
        }
        console.log(req.body)
        let exist=await courses.findOne({courseid:req.body.courseid})

        
        if (exist) {
            await courseschedule.findOneAndUpdate({courseid:req.body.courseid,day:req.body.day,slot:req.body.slot,location:req.body.location},{day:req.body.nday,slot:req.body.nslot,location:req.body.nlocation});
        res.send("slot UPDATED")
        } else {
            res.send("no such data")
        }
    }
    catch(err){
        console.log(err)
        res.send('error occurred while deleting slot')
    }

})
.delete(async(req,res)=>{
    try{
        const schema=joi.object({
            //courseid, day,slot, location
            courseid:joi.string().required(),
            day:joi.string().required(),
            slot:joi.number().required(),
            location:joi.string().required(),
           // userid:joi.string()
        });
        const {error,value}=schema.validate(req.body);
        if(error!=undefined){
            res.send(error.details[0].message);
            return;
        }let exist=await courses.findOne({courseid:req.body.courseid})
        let exist1=await courseschedule.findOne(value)
        if (exist&&exist1) {
            await courseschedule.deleteOne(value);
        res.send("slot deleted")
        } else {
            res.send("no such course or slot")
        }

    }
    catch(err){
        console.log(err)
        res.send('error occurred while deleting slot')
    }


})
;






module.exports = router;