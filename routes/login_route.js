//Bassels file
const express = require('express');

//Bassel
require('dotenv').config();


fs = require('fs');


const mongoose = require('mongoose')

const app = require('../app');

const jwt = require('jsonwebtoken')
const joi = require('joi')
const bcrypt = require('bcrypt');
const user = require('../models/user');
const cors = require('cors');



//const tokenBlacklist=require('../models/tokenBlacklist');



var tokenBlacklist = require("../models/tokenBlacklist");
const location = require('../models/location');


const requests=require('../models/request.model');

const router = express.Router();

router.use(cors());
var days = ["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday"];
var types = ["hr", "hod", "ci", "cc", "am"];

var key = process.env.PRIVATEKEY;

var validator = require("email-validator");

var verifyToken = function (req, res, next) {
    try {
        //TODO: check 
        var tokenString = jwt.verify(req.headers.token, key);
        //TODO: check blacklist

        req.id = tokenString.id;
        req.userType = tokenString.userType;

        next();
    } catch (err) {
        res.send("Invalid token");
    }
}


router.route('/lol')
.get(async(req,res)=>
{
    res.send("here");
})

// use it to add test users but ba3d keda hateb2a hr accessed only fel a5er

router.route('/testregister')
    .post(async (req, res) => {
        try {
            var name = req.body.name;
            var email = req.body.email;
            var userType = req.body.userType;
            var salary = req.body.salary;
            var office = req.body.office;
            var dayoff = req.body.dayoff;

            /*
            //office must exist 
            var officeExists = await location.exists({
                room: office
            });

            if (!officeExists) {
                res.send("this office doesnt exist please add it ");
                return;
            }
            //check office capacity
            var officeC = await location.findOne({
                room: office
            });
            var capacity=officeC.capacity;
            if (capacity == 0) {
                res.send("Office full capacity please change it");
                return;
            }
            */

            //user type correct

            if (!(types.includes(userType))) {
                res.send("the user type should be:[hr,hod,ci,cc,am]");
                return;
            }
            //day is valid
            if (!days.includes(dayoff)) {
                res.send("please enter a day from " + days);
                return;
            }

            //if hr dayoff must be saturday
            if (userType == "hr") {
                dayoff = "saturday";
            }
            //SET DEFAULT PASSWORD
            salt = 10;
            var password = await bcrypt.hash("123456", salt);

            //give user id
            var newID = userType + "-";
            await user.exists({
                userType: userType
            })
            var firstUser = !(await user.exists({
                userType: userType
            }));
            if (firstUser) {
                newID += 1;
                var newUser = new user({
                    name: name,
                    id: newID,
                    password: password,
                    email: email,
                    salary: salary,
                    dayoff: dayoff,
                    office: office,
                    userType: userType
                });
                await newUser.save();
                res.send(newUser);
            } else {
                await user.find({
                        userType: userType
                    })
                    .limit(1).sort({
                        id: -1
                    })
                    .select({
                        id: 1
                    })
                    .exec(async (err, record) => {
                        try {
                            if (record == undefined) {
                                newID += 1;
                            } else {
                                newID += (parseInt(record[0].id.split('-')[1]) + 1);
                            }
                            var newUser = new user({
                                name: name,
                                id: newID,
                                email: email,
                                password: password,
                                salary: salary,
                                dayoff: dayoff,
                                office: office,
                                userType: userType
                            });
                            await newUser.save();
                            res.send(newUser);
                        } catch (err) {
                            console.log(err);
                            res.send("error occurred while adding user")
                        }


                    });
            }


            //decrease capacity of office

            /* var newCapacity=await location.findOneAndUpdate({room:office},
                 {capacity:capacity-1});*/





    //decrease capacity of office


        } catch (err) {
            console.log(err);
            res.send("Cant add the new user with this data ")
        }
    })
    .get(async (req, res) => {
        var users = await user.find();
        res.send(users);
    });




// log in
router.route('/login')
    .post(async (req, res) => {
        var userEmail = req.body.email;
        var password = req.body.password

        try {

            //does user exist
            var userExists = await user.exists({
                email: userEmail
            });
            if (!userExists) {
                res.send("This email doesnt exist");
                return;
            }
            //find the user
            var currentUser = await user.findOne({
                email: userEmail
            });

            var correctPassword = await bcrypt.compare(password, currentUser.password);

            if (correctPassword) {
                //create token for the user and send it in header
                var msg = "";
                if (password == "123456") {
                    msg = "please change your password"
                }
                //the token is made from user id and userType
                var token = jwt.sign({
                    id: currentUser.id,
                    userType: currentUser.userType
                }, key, {
                    algorithm: 'HS256'
                });
                res.send({
                    "msg": "Login Succesful " + msg,
                    "token": token
                });

            } else {
                res.send("Wrong password please try again");
            }
        } catch (err) {
            console.log(err);
            res.send("An error has ocurred while logging in")
        }



    });

//starting from here the user has logged in and needs to have token

router.use(verifyToken);

//log out

//view attendance their attendance records OR with month

router.route('/logout')
    .post(async (req, res) => {
        try {
            //add token to black list
            var token = new tokenBlacklist({
                token: req.headers.token
            });
            await token.save();
            res.send("Logged out")
        } catch (err) {
            console.log(err);
            res.send("Error occurred while logging out")
        }



    });



router.route('/profile')
    .post(async (req, res) => {
        var id = req.id;
        console.log(id)
        var profile = await user.findOne({
            id: id
        }).select({password:0});
        res.send( profile);

    })
    //edit profile info
    .put(async (req, res) => {
        try {

            //office,email,dayoff
            const schema = joi.object({
                office: joi.string(),
                email: joi.string().email(),
                dayoff: joi.string(),
                //hr 
                salary: joi.number(),

            });
            const {
                error,
                value
            } = schema.validate(req.body);
            if (error != undefined) {
                res.send(error.details[0].message);
            }

            var id = req.id;
            var type = req.userType;
            var user1 = await user.findOne({
                id: id
            });
            var email = req.body.email;
            if (!validator.validate(email)) {
                res.send("please enter a valid email format");
                return;
            }
            var userType = req.body.userType;
            var salary = req.body.salary;
            var office = req.body.office; //
            var dayoff = req.body.dayoff;
            var department = req.body.department;
            var faculty = req.body.faculty;
            req.body.password = user1.password;
            if (userType == "hr") {
                //hr cant change 
                dayoff = "saturday";
                if (req.body.dayoff != 'saturday') {
                    req.body.dayoff = 'saturday'
                }
            }
            if (userType != "hr") {
                //academic member cant change 
                req.body.salary = user1.salary;
            }
            var newUser = await user.findOneAndUpdate({
                id: id
            }, req.body);
            res.send("user updated")
        } catch (err) {
            console.log(err);
            res.send("An error has ocurred while updating profile")
        }
    });
//test
router.route('/resetpassword')
    .post(async (req, res) => {
        try {
            const schema = joi.object({
                newPassword: joi.string().required()
            });
            const {
                error,
                value
            } = schema.validate(req.body);
            if (error != undefined) {
                res.send(error.details[0].message);
                return;
            }
            var newPassword = req.body.newPassword;
            var salt = 10;
            newPassword = await bcrypt.hash(newPassword, salt);
            var updateUser = await user.findOneAndUpdate({
                id: req.id
            }, {
                password: newPassword
            });
            res.send("password updated");
        } catch (err) {

        }
    });

;


//var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


var attendance = require('../models/attendance');
router.route('/signin')
    .get(async (req, res) => {
        var atten = await attendance.find();
        res.send(atten);
    })

    .post(async (req, res) => {
        try {
           // await attendance.deleteMany();
            var today = new Date();
            var currentDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var dayName = days[today.getDay()];
            var currentTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var signin = {
                signin: currentTime
            };
            var record = await attendance.findOne({
                id: req.id,
                date: currentDate
            });
            var newattendance;
            if (record == null) {
                //first sign of the day
                var attended = new attendance({
                    id: req.id,
                    date: currentDate,
                    dayname: dayName,
                    signs: [signin]
                });
                console.log('first time')
                newattendance = await attended.save();
            } else {
                //signed before
                var newsigns = record.signs;
                newsigns.push(signin);
                newattendance = await attendance.findOneAndUpdate({
                    id: req.id,
                    date: currentDate
                }, {
                    signs: newsigns
                })
            }
            res.send("sign in recorded");

        } catch (err) {
            console.log(err);
            res.send("Error occurred while signing in");
        }
    });

router.route('/signout')
    .post(async (req, res) => {
        try {
            // await attendance.deleteMany();
            var today = new Date();
            var currentDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var dayName = days[today.getDay()];
            var currentTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var signout = {
                signout: currentTime
            };
            var record = await attendance.findOne({
                id: req.id,
                date: currentDate
            });
            var newAttendance
            if (record == null) {
                //first sign of the day
                var attended = new attendance({
                    id: req.id,
                    date: currentDate,
                    dayname: dayName,
                    signs: [signout]
                });
                console.log("first attendance")
                newAttendance = await attended.save();
            } else {
                //signed before
                
                var newsigns = record.signs;
                newsigns.push(signout);
                newAttendance = await attendance.findOneAndUpdate({
                    id: req.id,
                    date: currentDate
                }, {
                    signs: newsigns
                })
            }
            res.send("sign out recorded");

        } catch (err) {
            console.log(err);
            res.send("Error occurred while signing out");
        }
    });

router.route('/viewAllAttendance').post(async (req, res) => {
    try {

        var results = await attendance.find({
            id: req.id
        }, {
            "_id": 0,
            "__v": 0
        });
        res.send(results);
    } catch (err) {
        console.log(err);
        res.send("an error occurred while viewing the attendance");
    }

});




router.route('/viewMonthAttendance').post(async (req, res) => {
    //get month attendance
    try {

        const schema = joi.object({
            month: joi.number().required()
        });
        const {
            error,
            value
        } = schema.validate(req.body);
        if (error != undefined) {
            res.send(error.details[0].message);
            return;
        }
        const month = req.body.month + "";
        var results = await attendance.find({
            id: req.id
        }, {
            "_id": 0,
            "__v": 0
        });
        const final = []
        for (let i = 0; i < results.length; i++) {
            const record = results[i];
            const dateString = record.date;
            if (dateString.includes(month)) {
                final.push(record);
            }
        }
        res.send(final);
    } catch (err) {
        console.log(err);
        res.send("error ocurred while retrieving attendance")

    }

   

});


router.route('/viewMissingdays').post(async(req,res)=>{
    try{
        var id=req.id;
        var u=await user.findOne({id:id});
        console.log(u.missingDays);
        
        res.send("missing days:    "+u);

    }catch(err){
        console.log(err);
        res.send("error happened while getting missing days")
    }

});

router.route('/viewHours').get(async(req,res)=>{
    try{
        let payload=jwt.verify(req.headers.token, key);
        var id=payload.id;
        console.log(req.id)
        var u=await user.findOne({id:id});
        var mhours=u.missinghours;
        var ehours=u.extrahours;
        var whours=u.workedhours

        var s="missing hours: "+mhours+"\n extra hours: "+ehours;
        res.send(s);

    }catch(err){
        console.log(err);
        res.send("error happened while getting missing hours")
    }
})




var schedule=require('node-schedule');
const { route } = require('./hr_route');
var updatehours = new schedule.RecurrenceRule();

updatehours.minute = new schedule.Range(0, 59, 1);

schedule.scheduleJob(updatehours,async function(){
    //all users
    var users=await user.find();
    //all attendance
    var attend=await attendance.find();

    //loop on each user id
    var uid,userattendance;
    for(var i=0;i<users.length;i++){
        uid=users[i].id;
        userattendance = attend.filter(u => u.id ==uid);
        //console.log(uid);

    }
   //    console.log('Hours updated');
});


var j = schedule.scheduleJob('* 19 * * *', async function(){
    try{
    var allusers=await user.find();
    var allattend=await attendance.find();
    var hisattend;

    allusers.forEach(async u => {
        //array of the current user attendance records
        hisattend=allattend.filter(a=>a.id==u.id);
        var ehours=0,mhours=0,whours=0;
        hisattend.forEach(record=> {
            var signs=record.signs;
            var sign,type;
            var spent=0;
            for(let i=0;i<signs.length;i++){
                
                var time1,time2;
                var h1,h2;
                var m1,m2
                sign=signs[i];
                type=Object.keys(sign)[0];
                
                if(type=='signin'){
                    if(i+1<signs.length){
                        type2=Object.keys(signs[i+1])[0];
                        
                        if(type2=='signout'){
                            time1=sign[type].split(':');
                            time2=signs[i+1][type2].split(':');
                            h1=parseInt(time1[0]);
                            h2=parseInt(time2[0]);
                            m1=parseInt(time1[1]);
                            m2=parseInt(time2[1]);
                            if(h1<7){
                                h1=7;
                                m1=0;
                            }
                            if(h2>19){
                                h2=19;
                                m2=0;
                            }
                            spent+=h2-h1+( (m2-m1)/100);
                            
                            

                        }
                    }
                }
            }
            //after 1 day of attendance
            whours+=spent;
            if(spent<8.24){ 
                mhours+=8.24-spent;
            }if(whours>8.24){
                ehours+=spent-8.24;
            }
        });
        //finished all attendance records
        mhours=mhours.toFixed(2);
        ehours=ehours.toFixed(2);
        whours=whours.toFixed(2);
        await user.findOneAndUpdate({id:u.id},{workedhours:whours,missinghours:mhours,extrahours:ehours});
        console.log(u.id+' hours updated'); 


    });
}
catch(err){
    console.log('error happened while updating missing hours')
}
  });



var i = schedule.scheduleJob('* 19 * * *', async function(){
    try{
        var allusers=await user.find();
        var allattendancerecords=await attendance.find();
    
        allusers.forEach(async user1 => {
            //all attendance of the chosen user
            var userattendancerecords=allattendancerecords.filter(r=>r.id==user1.id);
            var start=11;
            var d=new Date();
            var end=d.getDate()-1 ;
            var missing=0;
            //check from day 11 to end in current month
            for(var i=start;i<=end;i++){
                d.setDate(i);
                var date=d;
                var datestring=date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
                var recordexists=await attendance.exists({id:user1.id,date:datestring});
                if(recordexists){
                    
                }else{
                    //check if its holiday
                    var day=days[d.getDay()];
    
                    if(day!='friday'&&day!=user1.dayoff){
                        var acleave=await requests.annualleaverequest.exists({senderid:user1.id,targetdate:datestring});;
                        var sleave=await requests.SickLeavesRequest.exists({senderid:user1.id,targetdate:datestring});;
                        var mleave=await requests.CompensationLeaveRequest.exists({senderid:user1.id,targetdate:datestring});
                        var cleave=await requests.AccidentalLeaveRequest.exists({senderid:user1.id,targetdate:datestring});
                        if(!acleave&&!sleave&&!mleave&&!cleave){
                            missing++;
                        }
                       
                    }
                        
                       

                    
                    
                    //check leave request
                }
            }
            console.log(user1.id+' has missed '+missing);
            await user.findOneAndUpdate({id:user1.id},{missingdays:missing});
            
        });
    
        res.send("user missing days updated")
        }
        catch(err){
            console.log(err);
            res.send("an error has occurred")
    
        }
});
module.exports = router;