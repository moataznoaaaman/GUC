//Bassel
const express = require('express');

require('dotenv').config();


fs = require('fs');


const mongoose = require('mongoose')

const app = require('../app');

const jwt = require('jsonwebtoken')
const joi=require('joi');
const bcrypt = require('bcrypt');
const user = require('../models/user');

const courseschedule=require('../models/courseschedule');
const location = require('../models/location');
const faculty = require('../models/faculty');
const department=require('../models/department');
const attendance=require('../models/attendance');
const tokenBlacklist = require('../models/tokenBlacklist');
const course=require('../models/courses');
const { string, date } = require('joi');
const courses = require('../models/courses');
const { find } = require('../models/user');
const requests=require('../models/request.model');
var days=["saturday","sunday","monday","tuesday","wednesday","thursday"];
var types = ["hr", "hod", "ci", "cc", "am"];


const router = express.Router();
var key = process.env.PRIVATEKEY;
const cors = require('cors');
router.use(cors());


router.route("/users").get(async (req, res) => {
    var newID
    await user.find({
            userType: "hr"
        })
        .limit(1).sort({
            id: -1
        })
        .select({
            id: 1
        })
        .exec((err, record) => {
            //id in string
            newID = parseInt(record[0].id.split('-')[1]) + 1;
        });

})
router.route("/seedfirsthr").get(async(req,res)=>{
    try{
   // await user.deleteOne({id:"hr-1"});
    var salt =10;
    var pass= await bcrypt.hash("123456", salt);
    var u=new user({
        id:"hr-1",
        name:"bassel",
        email:"b12345@gmail.com",
        password:pass,
        userType:"hr",
        salary:7000,
        office:"c2.303",
        dayoff:"saturday"
    });
    await u.save();
    res.send("your first hr password 123456 \n"+u);
    }
        catch(err){
    console.log(err);
    res.send("error occurred while creating first hr")
}


})


var verifyToken =async function (req, res, next) {

    try {
        var tokenString = jwt.verify(req.headers.token, key);
        req.id = tokenString.id;
        req.userType = tokenString.userType;
        if (tokenString.userType != "hr") {
            res.send("You dont have permission for hr ur type is " + req.userType);
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
//location
router.route('/locationEdit')

    .get(async (req, res) => {
        var locations = await location.find();
        res.send(locations);
    })
    //add 
    .post(async (req, res) => {
        try {
        var schema=joi.object({
            room:joi.string().required(),
            type:joi.string().required(),
            capacity:joi.number().required()
        });
        var {error,value}=schema.validate(req.body);
        if(error!=undefined){
            res.send(error.details[0].message);
        }
        var newLocation = new location({
            room: req.body.room,
            type: req.body.type,
            capacity: req.body.capacity
        });
       
            await newLocation.save();
            res.send("Location added ");
        } catch (err) {
            console.log(err);
            res.send('Problem occured while saving the location')
        }

    })
    //delete
    .delete(async (req, res) => {

        try {
            var schema=joi.object({
                room:string().required()
            });
            var {error,value}=schema.validate(req.body);
            if(error!=undefined){
                res.send(error.details[0].message)
                return;
            }
            var exists = await location.exists({
                room: req.body.room
            });
            if (exists) {
                //delete location from the locationtable
                var deleteLocation = await location.deleteOne({
                    room: req.body.room
                });
                //delete the location from other tables

                res.send("Location deleted \n" + req.body.room);
            } else {
                res.send('room was not found: ' + req.body.room);
            }

        } catch (err) {
            console.log(err);
            res.send("Problem occurred while deleting room");

        }

    })
    //update
    .put(async (req, res) => {
        try {
            var room = req.body.room;

            var schema=joi.object({
            //my data types and are they required
            room:joi.string().required(),
            type:joi.string(),
            capacity:joi.number()
        });
        //check on the input data with the types
        var {error,value}=schema.validate(req.body);
        //if error is not undefined then there is a problem with the data
        if(error!=undefined){
            res.send(error.details[0].message);
        }
            var exists = await location.exists({
                room
            })
            if (exists) {
                var updatedLocation = await location.findOneAndUpdate({
                    room: room
                }, req.body);
                res.send("location: " + room + " has been updated: \n" + updatedLocation)
            } else {
                res.send("The room you are trying to update doesnt exist: " + room);
            }
        } catch (err) {
            console.log(err);
            res.send("Problem ocurred while updating room");

        }


    });;
//faculty
router.route('/facultyEdit')
    //show faculties
    .get(async (req, res) => {
        var faculties = await faculty.find();
        res.send(faculties);
    })

    //add 
    .post(async (req, res) => {
        try {
            var schema=joi.object({name:joi.string().required()});

            const {error,value}=schema.validate(req.body);

            if(error!=undefined){
                res.send(error.details[0].message);
                return;
            }
            var newFaculty = new faculty({
                name: req.body.name
            });
            await newFaculty.save();
            res.send(req.body.name + " faculty has been added");
        } catch (err) {
            console.log(err);
            res.send("error ocurred while adding faculty please revise your data");
        }
    })

    //delete faculty by name
    .delete(async (req, res) => {
        try{
            var schema=joi.object({name:joi.string().required()});
            
            const {error,value}=schema.validate(req.body);

            if(error!=undefined){
                res.send(error.details[0].message);
                return;
            }
        await faculty.deleteMany(req.body);

        await department.updateMany({faculty:req.body.name},{faculty:"undefined"});

       
        await user.updateMany({faculty:req.body.name},{faculty:"undefined"});
        res.send(req.body.name+" deleted");

        }catch(err){
            console.log(err);
            res.send("error occurred while deleting faculty");
        }
    })
    //update faculties name
    .put(async (req, res) => {
        try{
            var schema=joi.object({name:joi.string().required(),
            newname:joi.string().required()});
            
            const {error,value}=schema.validate(req.body);

            if(error!=undefined){
                res.send(error.details[0].message);
                return;
            }

        var name=req.body.name;
        var newname=req.body.newname;
        await faculty.findOneAndUpdate({name:name},{name:newname});

        await department.updateMany({faculty:name},{faculty:newname});

        await user.updateMany({faculty:name},{faculty:newname});

        res.send(name+" updated to "+newname);
        }catch(err){

        }
    });
;

// department
router.route("/departmentEdit")
    .get(async(req,res)=>{
        var results=await department.find();
        res.send(results);
    })
    .post(async(req,res)=>{
        try{
        const schema=joi.object({
            faculty:joi.string().required(),
            department:joi.string().required(),
            hod:joi.string()
        });
        const {error,value}=schema.validate(req.body);
        if(error!=undefined){
            res.send(error.details[0].message);
            return;
        }
        
        var newDepartment=new department(value);
        await newDepartment.save();
        res.send(req.body.department+" added");
    }catch(err){
        console.log(err);
        res.send("error occurred while adding department");
    }
    })
    
    .delete(async(req,res)=>{
        try{
            const schema=joi.object({
                faculty:joi.string().required(),
                department:joi.string().required()
            });
            const {error,value}=schema.validate(req.body);
            if(error!=undefined){
                res.send(error.details[0].message);
                return;
            }
        var nfaculty=req.body.faculty;
        var ndepartment=req.body.department;
        //department
        await department.deleteMany(req.body);
        //course
        //await course.updateMany({department:ndepartment},{department:"undefined"});
        //user
        await user.updateMany({department:ndepartment},{department:"undefined"});

        res.send(ndepartment+" has been deleted");
        }catch(err){
            console.log(err);
            res.send("error occurred while deleting department");
        }
    })
    .put(async(req,res)=>{
        try{
            const schema=joi.object({
                faculty:joi.string().required(),
                department:joi.string().required(),
                newdepartment:joi.string().required()
            });
            const {error,value}=schema.validate(req.body);
            if(error!=undefined){
                res.send(error.details[0].message);
                return;
            }
        var nfaculty=req.body.faculty;
        var ndepartment=req.body.department;
        var newdepartment=req.body.newdepartment;
        //update in department
        await department.updateMany({department:ndepartment},{department:newdepartment});
        //update in course
        //await course.updateMany({department:ndepaertment},{department:newdepartment});
        //update in user
        await user.updateMany({departmen:ndepartment},{department:newdepartment});

        res.send(ndepartment+" updated to "+newdepartment);
        }catch(err){
            console.log(err);
            res.send("error ocurred while updating department");
        }
    })

    

router.route("/courseEdit")
    .get(async(req,res)=>{
        
        var results=await course.find();
        res.send(results);
    })
    .post(async(req,res)=>{
        try{
        var schema=joi.object({
            courseid:joi.string().required(),
            coursename:joi.string().required(),
            faculty:joi.string().required(),
            department:joi.string().required(),
            numberofslots:joi.number().required(),
        });
        const {error,value}=schema.validate(req.body);
        if(error!=undefined){
            res.send(error.details[0].message);
            return;
        }

        req.body.coverage=0;
        req.body.coveredslots=0;
        var newCourse=new course(req.body);
        await newCourse.save();
        res.send("Course added");
    }
    catch(err){
        console.log(err);
        res.send("Error occurred while adding the course")
    }
    })

    .put(async(req,res)=>{
        try{
            const schema=joi.object({
                courseid:joi.string().required(),
                coursename:joi.string(),
                department:joi.string(),
                faculty:joi.string(),
                numberofslots:joi.number()
            });
            const {error,value}=schema.validate(req.body);
            if(error!=undefined){
                res.send(error.details[0].message);
                return;
            }

            //course table
            await course.updateMany({courseid:value.courseid},req.body);
            res.send("course updated");
            }
            catch(err){
                console.log(err);
                res.send("error occurred while updating course");
            }
    })
    .delete(async(req,res)=>{
        try{
            var schema=joi.object({
                courseid:joi.string().required()
            });
            const{error,value}=schema.validate(req.body);
            if(error!=undefined){
                res.send(error.details[0].message);
                return;
            }
            await course.deleteMany({courseid:value.courseid});
            //courseschedule table
            //await courseschedule.updateMany({courseid:value.courseid},{courseid:"undefined"});
            res.send("course deleted ");
        }
        catch(err){
            console.log(err);
            res.send("error occurred while deleting course");
        }
    })

//ADD USER
router.route("/addUser")
    .get(async(req,res)=>{
        var v=await user.find();
        res.send(v);
    })
    .post(async (req, res) => {
        try {
            //id,name,email,salary,office
            const schema=joi.object({
                name: joi.string().required(),
                email:joi.string().email().required(),
                office:joi.string().required(),
                salary:joi.number().required(),
                userType:joi.string().required(),
                dayoff:joi.string(),
                department:joi.string(),
                faculty:joi.string()
            });
            var name = req.body.name;
            var email = req.body.email;
            var userType = req.body.userType;
            var salary = req.body.salary;
            var office = req.body.office;
            var dayoff = req.body.dayoff;
            var department=req.body.department;
            var faculty=req.body.faculty;
            const{error,value}=schema.validate(req.body);
            if(error!=undefined){
                res.send(error.details[0].message);
                return;
            }

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
            
            //user type correct
            
            if (!(types.includes(userType))) {
                res.send("the user type should be:[hr,hod,ci,cc,am]");
                return;
            }
            //day is valid
            if(!days.includes(dayoff)){
                res.send("please enter a day from "+days);
                return;
            }
            
            //if hr dayoff must be saturday
            if (userType == "hr") {
                req.body.dayoff="saturday";
                dayoff = "saturday";
            }
            //SET DEFAULT PASSWORD
            salt=10;
            var password = await bcrypt.hash("123456", salt);
            req.body.password=password;
            //give user id
            var newID = userType + "-";
            await user.exists({userType:userType})
            var firstUser=! (await user.exists({userType:userType}));
            if(firstUser){
                newID+=1;
                req.body.id=newID;
                    var newUser=new user(
                        req.body
                    );
                    await newUser.save();
                    res.send(newUser);
            }
            else{
            await user.find({
                    userType: userType
                })
                .limit(1).sort({
                    id: -1
                })
                .select({
                    id: 1
                })
                .exec(async(err, record) => {
                    try{
                    if(record==undefined){
                        newID+=1;
                    }else{
                    newID += (parseInt(record[0].id.split('-')[1]) + 1);}
                    req.body.id=newID
                    var newUser=new user(
                       req.body
                    );
                    await newUser.save();
                    res.send(newUser);
                }
                    catch(err){
                        console.log(err);
                        res.send("error occurred while adding user")
                    }
                      
                    
                });
            }

        } catch (err) {
            console.log(err);
            res.send("Cant add the new user with this data ")
        }


    });;

router.route("/editStaffMember")
    .delete(async(req,res)=>{
        try{
            const schema=joi.object({
                staffid:joi.string().required()
            });
            const {error,value}=schema.validate(req.body);
            if(error!=undefined){
                res.send(error)
            }
            //hr can edit department,faculty,email,salary
            await user.deleteOne({id:value.staffid});
            await attendance.deleteMany({id:value.staffid});
            
            await course.updateMany({hod:value.staffid},{hod:"undefined"});
            await course.updateMany({cordinatorid:value.staffid},{cordinatorid:"undefined"});
            await courseschedule.updateMany({userid:value.staffid},{userid:"undefined"});
            await requests.SlotLinkingRequest.deleteMany({senderid:value.staffid});
            await requests.ChangeDayoffRequest.deleteMany({senderid:value.staffid});
            await requests.ReplacementRequest.deleteMany({senderid:value.staffid});

            res.send("staff member removed")

        }
        catch(err){
            console.log(err);
            res.send("error occurred while deleting staff member")
        }

    })

    .put(async(req,res)=>{
        //update the department,faculty,usertype,email
        try{
            const schema=joi.object({
                staffid:joi.string().required(),
                email:joi.string().email(),
                department:joi.string(),
                faculty:joi.string(),
                userType:joi.string(),
                office:joi.string(),
                dayoff:joi.string()
            });
            
            const{error,value}=schema.validate(req.body);
            if(error!=undefined){
                res.send(error.details[0].msg);
                return;
            }
            var officeExists = await location.exists({
                room: value.office
            });
            if (!officeExists) {
                res.send("this office doesnt exist please add it ");
                return;
            }
            //check office capacity
            var officeC = await location.findOne({
                room: value.office
            });
            var capacity=officeC.capacity;
            if (capacity == 0) {
                res.send("Office full capacity please change it");
                return;
            }
            var u=await user.findOne({id:value.staffid});
           
            if(u.userType=="hr"){
                value.dayoff="saturday";
                
            }

            await user.updateOne({id:value.staffid},value);
            res.send("staff member updated ")
        }
        catch(err){
            console.log(err);
            res.send("error has occurred while updating staff member    ");
        }
    })


//view any member attendance record
router.route("/viewStaffAttendance")
    .get(async(req,res)=>{
        try{
            var results=await attendance.find({id:req.body.staffid},{"_id":0,"__v":0});
            if(results.length==0){
                res.send("this user didnt sign in or out yet :(")
            }else{
            res.send(results);
        }
            }catch(err){
                console.log(err);
                res.send("an error occurred while viewing the attendance");
            }
    })


router.route("/editStaffSalary")
    .post(async(req,res)=>{
        try{
        const schema=joi.object({
            staffid:joi.string().required(),
            newsalary:joi.number().required()
        });
        const {error,value}=schema.validate(req.body);
        if(error!=undefined){
            res.send(error.details[0].message);
        }
        const newMem=await user.findOneAndUpdate({id:value.staffid},{salary:value.newsalary});
        if(newMem==null){
            res.send("there is no user with this id");
            return;
        }
        res.send("salary updated to "+value.newsalary);
    }
        catch(err){
            console.log(err);
            res.send("error occurred while saving staff salary")
        }
    })

//TODO: hod
router.route("/assignHOD")
    .post(async(req,res)=>{
        const schema=joi.object({
            staffid:joi.string().required(),
            department:joi.string().required()
        });
        const {error,value}=schema.validate(req.body);
        if(error!=undefined){
            res.send(error.details[0].message);
            return;
        };
       

        await user.updateOne({id:value.staffid},{usertype:"hod"});
        await department.updateOne({department:value.department},{hod:value.staffid});
        res.send('HOD assigned');
    });

var days = ["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday"];
var getH=function (hour){
    if(hour[0]=='0'){
        console.log('hi');
    }

}
//TODO: manual add sign in
router.route("/addSignin")
    .post(async(req,res)=>{
        try{
            const schema=joi.object({
                staffid:joi.string(),
                year:joi.number().integer().min(2015).max(2021).required(),
                month:joi.number().integer().min(1).max(12).required(),
                day:joi.number().integer().min(1).max(31).required(),
                hour:joi.number().integer().min(0).max(23).required(),
                minute:joi.number().integer().min(0).max(59).required()
            });
            const{error,value}=schema.validate(req.body);
            if(error!=undefined){
                res.send(error.detals[0].msg);
                return;
            }
            
            var staffid=value.staffid;
            var chosenDate = value.year + '-' + value.month + '-' + value.day;
            var d=new Date(chosenDate);
            if(value.hour<9){
                //value.hour="0"+value.hour
            }
            var chosenTime = value.hour + ":" + value.minute + ":" + "00";
            var dayName = days[d.getDay()+1];

            var record = await attendance.findOne({
                id: staffid,
                date: chosenDate
            });
            var newattendance;
            var signin ={signin:chosenTime};
            if (record == null) {
                //first sign of the day
                var attended = new attendance({
                    id: staffid,
                    date: chosenDate,
                    dayname: dayName,
                    signs: [signin]
                });
                newattendance = await attended.save();
               //console.log(attended);
            }else {
                //signed before
                var newsigns = record.signs
                var inserted=false;
                var key,time,h,m;
                for(var i=0;i<newsigns.length;i++){
                    key=Object.keys(newsigns[i])[0];
                    time=newsigns[i][key].split(':');
                    h=time[0];m=time[1];
                    if(value.hour<=h&&value.minute<=m){
                        newsigns.splice(i, 0, signin);
                        inserted=true; 
                        break;
                    }
                }
                if(!inserted){
                    newsigns.push(signin);
                }
                
                newattendance = await attendance.findOneAndUpdate({
                    id: value.staffid,
                    date: chosenDate
                }, {
                    signs: newsigns
                });
                console.log(newattendance)
            }

            
            res.send("sign in added to user attendance");

        }
        catch(err){
            console.log(err);
            res.send("error occurred while adding sign in ")
        }
    });


router.route("/addSignout")
    .post(async(req,res)=>{
        try{
            const schema=joi.object({
                staffid:joi.string(),
                year:joi.number().integer().min(2015).max(2021).required(),
                month:joi.number().integer().min(1).max(12).required(),
                day:joi.number().integer().min(1).max(31).required(),
                hour:joi.number().integer().min(0).max(23).required(),
                minute:joi.number().integer().min(0).max(59).required()
            });
            const{error,value}=schema.validate(req.body);
            if(error!=undefined){
                res.send(error.detals[0].msg);
                return;
            }
            
            var staffid=value.staffid;
            var chosenDate = value.year + '-' + value.month + '-' + value.day;
            var d=new Date(chosenDate);
            if(value.hour<9){
                //value.hour="0"+value.hour
            }
            var chosenTime = value.hour + ":" + value.minute + ":" + "00";
            var dayName = days[d.getDay()+1];

            var record = await attendance.findOne({
                id: staffid,
                date: chosenDate
            });
            var newattendance;
            var signin ={signout:chosenTime};
            if (record == null) {
                //first sign of the day
                var attended = new attendance({
                    id: staffid,
                    date: chosenDate,
                    dayname: dayName,
                    signs: [signin]
                });
                newattendance = await attended.save();
               //console.log(attended);
            }else {
                //signed before
                var newsigns = record.signs
                var inserted=false;
                var key,time,h,m;
                for(var i=0;i<newsigns.length;i++){
                    key=Object.keys(newsigns[i])[0];
                    time=newsigns[i][key].split(':');
                    h=time[0];m=time[1];
                    if(value.hour<=h&&value.minute<=m){
                        newsigns.splice(i, 0, signin);
                        inserted=true; 
                        break;
                    }
                }
                if(!inserted){
                    newsigns.push(signin);
                }
                
                newattendance = await attendance.findOneAndUpdate({
                    id: value.staffid,
                    date: chosenDate
                }, {
                    signs: newsigns
                });
                console.log(newattendance)
            }

            
            res.send("sign out added to user attendance");

        }
        catch(err){
            console.log(err);
            res.send("error occurred while ading sign out ")
        }
        
    });

router.route("/staffmissinghours").get(async(req,res)=>{
    try{
       
        var users=await user.find({},{"_id":0}).select('id name missinghours');
        //pick only who have missing hours
        users=users.filter(user=>user.missinghours>0);
        res.send(users);
    }
    catch(err){
        console.log(err);
        res.send("Error occurred while getting users with missing hours");
    }
})

router.route("/staffmissingdays").get(async(req,res)=>{
    try{
        
        var users =await user.find({},{"_id": 0}).select('name id missingdays');
        users=users.filter(user=>user.missingdays>0);

        res.send(users);

    }
    catch(err){
        console.log(err);
        res.send("error occurred while getting staff missing days");
    }
});


router.route("/updatemissingdays").post(async(req,res)=>{
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

})


router.route("/test")
    .get(async(req,res)=>{
        var c=await user.findOne({id:"ci-4"})
        var d=c.name;
        console.log(d);
        res.send(c)
    })







module.exports = router;