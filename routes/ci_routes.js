const express=require('express');
const jwt=require('jsonwebtoken');
const bcrypt = require('bcrypt');
const user=require('../models/user.js');
const schedule=require('../models/schedule');
const location=require('../models/location');
const faculty=require('../models/faculty');
const department=require('../models/department');
const courseschedule=require('../models/courseschedule');
const tokenblacklist=require('../models/tokenBlacklist')
const courses=require('../models/courses');
const { app } = require('../app');
const { route } = require('./login_route.js');
const Joi=require('joi');
var key = 'el5atir';  

const router=express.Router();
router.use(express.json());

let payload;
var verifyToken = async function (req, res, next) {
    try {
        //console.log("here: "+req.header('token'));
        payload = jwt.verify(req.header('token'), key);
        req.id = payload.id;
        req.userType = payload.userType;
        let i=await tokenblacklist.exists({token:req.header('token')})
       // console.log(payload.userType == 'am');
        if (payload.userType == "ci") {
           // res.send("You dont have permission for am you are a " +payload.userType);
           next();
        }
        else if (i) {
            res.send("expired token");
        }
        else{
            res.send("You dont have permission for am you are a " +payload.userType);
        }
       
    } catch (err) {
        console.log(err);
        res.send("Invalid token");
    }
    
};
// function auth(req,res,next)
//      {
//          //permisson=token
//          const token =req.header('token')
//          if (!token) {
//              return res.status(403).send("no token")
//             }
//              try {
//                  payload=jwt.verify(token,key)
//                  next();
//              } catch (error) {
//                  //not valed taken
//                  return res.status(403).send("no token1")
//              }
         
//      }

router.use(verifyToken);
router.route('/hel')
.get(async(req,res)=>
{
   
    
   
        let out =await user.find({id:payload.id}) 
       res.send(out);
    
    
})
router.route('/coursecoverage')
.post(async (req,res)=>
{//expected input courseid[]  ciid from payload
    try {
        const schema = Joi.object({
            courseid: Joi.array().items(Joi.string()).required()})
            let {value,error}=schema.validate(req.body);
        let id=payload.id; 
        //let ci=user.find({id:id});
        let course=await courses.find({courseid:req.body.courseid,instructorid:id}).select({coverage:1,courseid:1,_id:0})
        if (course.length==0||error!=undefined) {
            res.send("please double check data");
            console.log(error)
        }
        else 
        {
        res.send(course);
        }
    } catch (error) {
        res.send("an err happend while in progress"); 
    }
})

router.route('/slotsassignment')
.post(async(req,res)=>
{
    try {//expected input courseid[]  ciid from payload
        const schema = Joi.object({
            courseid: Joi.array().items(Joi.string()).required()})
            let {value,error}=schema.validate(req.body);
        let id=payload.id; 
        //let ci=user.find({id:id});
        let course=await courses.find({courseid:req.body.courseid,instructorid:id}); 
        if (course.length==0||error!=undefined) {
            res.send("please double check data");
        }
        else 
        {
           // console.log(course);
           // console.log('wsdfsd');
        let slots=await courseschedule.find();
        //console.log(slots); 
        let resl=[]
        course.forEach(function (item,index)
        {
           slots.forEach(function(item1,index1)
           {
               if (item.courseid==item1.courseid) {
                   resl.push(item1);
               }
           })
        }) 
        res.send(resl);
        }
    } catch (error) { 
        console.log(error);
        res.send("an err happend while in progress"); 
    }
})

router.route('/staffindept')
.get(async(req,res)=>
{//expected input hod id from token payload
    try {
        const schema = Joi.object({})
        let {value,error}=schema.validate(req.body);
        if (error!=undefined) {
        res.send("please double check data");
        } else {
        let id=payload.id;//will be from payload
        let ciuser=await user.findOne({id:id});  
        let out =await user.find({department:ciuser.department,id:{$ne: id}}); 
        res.send(out);  
       }
        
    } catch (error) {
        res.send("an err happend while in progress");
    }
  
})

router.route('/staffincourse')
.post(async(req,res)=>
{//expected input courseid from body
    try {
        const schema = Joi.object({
        courseid: Joi.array().items(Joi.string()).required()})
        let {value,error}=schema.validate(req.body);
        //let courseid=req.body.courseid;
        let id=payload.id;//will be from payload
        //let ciuser=await user.findOne({id:id}); 
        let exists=await courses.find({courseid:req.body.courseid,instructorid:id}); 
        //console.log(exists);
        //console.log("exists"); 
        if (exists.length==0||error!=undefined) { 
            res.send("please double check data");
        }
        else{
        exists.forEach(function(item,index)
        {
            exists[index]=item.courseid
        })
        let out=await courseschedule.find({courseid:exists,userid:{$ne:null}}).select({userid:1,_id:0}); 
        //console.log(out);
        out.forEach(function(item, index, array) {out[index]=item.userid;});   
        out=[...new Set(out)];

            let users=await user.find();
            out.forEach(async function(item, index, array) {
            users.forEach(function(item1,index1,array1)
            {
                if (users[index1].id==item) {
                    out[index]=users[index1]
                } 
            })  
            
            //  console.log(out);  
        ;});   

        console.log(out); 
        res.send(out); 
        }  
    } catch (error) {
        
        res.send("an err happend while in progress");
    }
  
})


router.route('/assigncoordinator')
.post(async (req,res)=>
{//expected input courseid[]   memberid  ciid from payload
    try {
        const schema = Joi.object({
            courseid: Joi.array().items(Joi.string()).required(),
            amid:Joi.string().required()
        })
            let {value,error}=schema.validate(req.body);
        let instructor=payload.id;
    instructor=await user.findOne({id:instructor})
    let coursess=await courses.find({courseid:req.body.courseid,instructorid:instructor.id})
    //res.send(coursess);
    let amem=await user.findOne({id:req.body.amid,department:instructor.department,userType:"am"})
    //res.send(amem);
    if (!amem||coursess.length==0||error!=undefined) {
        res.send("please double check the data")
    } else {
        await user.findOneAndUpdate({id:req.body.amid},{userType:"cc"})
        coursess.forEach(async function(item,index)
        {
            
            await courses.findOneAndUpdate({courseid:item.courseid},{cordinatorid:amem.id})
            //console.log(await courses.findOne({courseid:item.courseid}));
        })
       // await courses.findOneAndUpdate({courseid:req.body.courseid},{cordinatorid:amem.id})
        res.send("done");
    }
  

    } catch (error) {
        console.log(error);
        res.send("err happend while in progress");
    }
    
})

router.route('/assignacmemtoslot')
.post(async(req,res)=>
{// expected input courseid  amid replace=>wether to replace existing slots day slot location
    try {
        const schema = Joi.object({
            courseid:Joi.string().required(),
            amid:Joi.string().required(),
            day:Joi.string().required(),
            slot:Joi.number().integer().required(),
            location:Joi.string().required(),
            replace:Joi.number().integer().required()
        })
            let {value,error}=schema.validate(req.body);
        let instructor=payload.id;
    instructor=await user.findOne({id:instructor})
    let xcourses=await courses.findOne({courseid:req.body.courseid,instructorid:instructor.id}).select({courseid:1,_id:0})
    //res.send(xcourses)
     let amem=await user.findOne({id:req.body.amid,department:instructor.department,userType:"am"})
     let slotexist=await courseschedule.findOne({courseid:req.body.courseid,day:req.body.day,slot:req.body.slot,userid:undefined,location:req.body.location})
     
    // res.send(slotexist);
    if (error!=undefined||!amem||!xcourses||!slotexist) {
        res.send("please double check the data")
    } else 
    {
        let obligatio=await courseschedule.findOne({userid:amem.id,day:req.body.day,slot:req.body.slot})
        //console.log(obligatio);
        if (req.body.replace==0&&obligatio) 
        {
            res.send("this member has an obligation"); 
        }
        else
        {
            await courseschedule.findOneAndUpdate({userid:amem.id,day:req.body.day,slot:req.body.slot},{userid:undefined});//obli
            await courseschedule.findOneAndUpdate({courseid:req.body.courseid,day:req.body.day,slot:req.body.slot,userid:undefined,location:req.body.location},{userid:req.body.amid});
            res.send("done");
        }
    }
    } catch (error) {
        console.log(error)
        res.send("please double check the data");
    }
        
    })
.put(async(req,res)=>
{// expected input courseid  amidold amidnew replace=>wether to replace existing slots day slot location
    try {
        const schema = Joi.object({
            courseid:Joi.string().required(),
            amidold:Joi.string().required(),
            amidnew:Joi.string().required(),
            day:Joi.string().required(),
            slot:Joi.number().integer().required(),
            location:Joi.string().required(),
            replace:Joi.number().integer().required()
        })
            let {value,error}=schema.validate(req.body);
        let instructor=payload.id;//payload
    instructor=await user.findOne({id:instructor})
    let taught=await courses.findOne({courseid:req.body.courseid,instructorid:instructor.id})
    //res.send(taught);
    // console.log(taught);
    // console.log("//////////////////////////");
    let slotexistance=await courseschedule.findOne({courseid:req.body.courseid,day:req.body.day,slot:req.body.slot,userid:req.body.amidold,location:req.body.location})
   // res.send(slotexistance);
    // console.log(slotexistance);
    // console.log("//////////////////////////");
    let amemnew=await user.findOne({id:req.body.amidnew,department:instructor.department,userType:"am"})
    //res.send(amemnew);
    //console.log(amemnew);
    //console.log("//////////////////////////");
    if (error!=undefined||!slotexistance||!amemnew||!taught) {
        res.send("please double check the data")
    } else {
        
        let obligatio=await courseschedule.findOne({userid:amemnew.id,day:req.body.day,slot:req.body.slot});
       // res.send(obligatio)
        if (req.body.replace==0&&obligatio) 
        {
            res.send("this new member has an obligation"); 
        }
        else{
            await courseschedule.findOneAndUpdate({userid:amemnew.id,day:req.body.day,slot:req.body.slot},{userid:undefined});//obligation
            await courseschedule.findOneAndUpdate({courseid:req.body.courseid,day:req.body.day,slot:req.body.slot,userid:req.body.amidold,location:req.body.location},{userid:req.body.amidnew});
            res.send("done");
        }
    }

    } catch (error) {
        res.send("err happend while in progress");
    }
    
})
.delete(async(req,res)=>
{// expected input courseid  amid 
    try {
        const schema = Joi.object({
            courseid:Joi.string().required(),
            amid:Joi.string().required(),
            day:Joi.string().required(),
            slot:Joi.number().integer().required(),
            location:Joi.string().required()
        })
            let {value,error}=schema.validate(req.body);
        let instructor=payload.id;//payload
    instructor=await user.findOne({id:instructor});
    let taught=await courses.findOne({courseid:req.body.courseid,instructorid:instructor.id});
    
    let slotexistance=await courseschedule.findOne({courseid:req.body.courseid,day:req.body.day,slot:req.body.slot,userid:req.body.amid,location:req.body.location})
   // console.log(taught)
   // res.send();
    if (error!=undefined||!slotexistance||!taught) {
        res.send("please double check the data");
    } else {
        await courseschedule.findOneAndUpdate({courseid:req.body.courseid,day:req.body.day,slot:req.body.slot,userid:req.body.amid,location:req.body.location},{userid:undefined});
        res.send("done");
    }
    } catch (error) {
        res.send("err happend while in progress");
    }
    
})


router.route('/removememfromcourse')
.delete(async(req,res)=>
{//expected input amid courseid[]
    try {
        const schema = Joi.object({
            courseid: Joi.array().items(Joi.string()).required(),
            amid:Joi.string().required()
        })
            let {value,error}=schema.validate(req.body);
        let instructor=payload.id;//payload
    instructor=await user.findOne({id:instructor});
    let amem=await user.findOne({id:req.body.amid,department:instructor.department,userType:"am"})
    //res.send(amem);
    //console.log(amem)
    let obligations=await courseschedule.find({courseid:req.body.courseid,userid:req.body.amid});//acmeme
    //res.send(obligations);
    //console.log(obligations);
    let taught=await courses.find({courseid:req.body.courseid,instructorid:instructor.id})
    //res.send(taught);
    if (error!=undefined||!amem||obligations.length==0||taught.length==0) {
        res.send("please double check the data");
        //console.log(error)
    } else {
        obligations.forEach(async(item,index)=>
        {
            await courseschedule.findOneAndUpdate({courseid:item.courseid,day:item.day,slot:item.slot,userid:req.body.amid,location:item.location},{userid:undefined});
        })
        res.send("done");
    }
    } catch (error) {
        res.send("please double check the data1");
    }
    
})
module.exports=router; 

