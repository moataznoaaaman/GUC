const express=require('express');
const jwt=require('jsonwebtoken');
const bcrypt = require('bcrypt');
const user=require('../models/user.js');
const schedule=require('../models/schedule');
const location=require('../models/location');
const faculty=require('../models/faculty');
const department=require('../models/department');
const courseschedule=require('../models/courseschedule');
const courses=require('../models/courses');
const requests=require('../models/request.model');
const { app } = require('../app');
var key = 'el5atir';
var validator = require("email-validator");
const { route } = require('./login_route.js');
const { findByIdAndUpdate } = require('../models/user.js');
const { date } = require('joi');
const router=express.Router();
const tokenblacklist=require('../models/tokenBlacklist');
const Joi=require('joi');
router.use(express.json());
const cors = require('cors');
router.use(cors());
let payload;
var verifyToken = async function (req, res, next) {
    try {
        //console.log("here: "+req.header('token'));
        payload = jwt.verify(req.header('token'), key);
        req.id = payload.id;
        req.userType = payload.userType;
        let i=await tokenblacklist.exists({token:req.header('token')})
       // console.log(payload.userType == 'am');
        if (payload.userType == 'hod') {
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

 router.use(verifyToken);
router.route('/hel')
.get(async(req,res)=>
{
   
    // let c=new courses(
    //     {
        
    //     courseid:'csen2',
    //     coursename:'csen1name',
    //     faculty:'met',
    //     instructorid:['ci-2','ci-3'],
    //     department:'cs',
    //     coverage:0,
    //     numberofslots:6,
    //     coveredslots:0 
    //     }
    // )
   let annual=requests.CompensationLeaveRequest
   
    let c=new annual
    ({
        id:"A" ,
        senderid:"am-2",
        reason:"ana asef",
        targetdate:"2020-12-26T09:25:24.462Z",
        document:"sdvasdvcesrfadsvfgrtgsecde",
        destinationid:"hod-1"
    
    }
    )
// let c=new courseschedule({
//     courseid:"csen", 
//     day:"tuesday",
//     slot:2,
//     userid:"am-1",
//     location:"d4",
        
// })
    await c.save();
//   let out =await courses.findOne({courseid:'csen1'}) 
//   let inss=["am-2","ci-100"]
//  inss.push(2)
 //await courses.findOneAndUpdate({courseid:'csen1'},{instructorid:inss}) 
    res.send('dsf' );
}) 
 


//router.use(verifyToken);
 
router.route('/courseinstructor')
.post(async(req,res)=> //assign
{  //expected input  insid  courseid  
      try {

        const schema = Joi.object({
            insid: Joi.string().required(),
            courseid:Joi.string().required()
        })
        let {value,error}=schema.validate(req.body);

        let id=payload.id;//will be from payload
        let hoduser=await user.findOne({id:id}); 
        let instr=await user.findOne({id:req.body.insid,department:hoduser.department,userType:['am','ci']});
        let course=await courses.findOne({courseid:req.body.courseid,department:hoduser.department,instructorid:{$ne:req.body.insid}})
        // console.log(course);
        // console.log("////////////////////");
        // console.log(instr);
      //  res.send()
        if (!instr||!course||course.coverage==1||error!=undefined) {//if either of enterd data is incorrect
            // console.log(course.department);
            // console.log(instr.email);  
           res.send("please double check the enterd data");
            return; 
        }
        await user.findOneAndUpdate({id:req.body.insid},{userType:"ci"});
        let sched=await courseschedule.findOneAndUpdate({courseid:req.body.courseid,userid:undefined},{userid:req.body.insid})//check
        let newcoverage=(course.coveredslots+1)/course.numberofslots;
        let newcoverd=course.coveredslots+1;
        let inss=course.instructorid
        //console.log(""+req.body.insid);  
        inss.push(req.body.insid);
        course= await courses.findOneAndUpdate({courseid:req.body.courseid},{instructorid:inss,coverage:newcoverage,coveredslots:newcoverd});
        console.log(inss);  
      res.send("done");  
       return;  
      } catch (error) { 
          console.log(error);
          res.send("an err happend while in progress"); 
          return;  
     }
    
})


.put(async (req,res)=>//replace
{//expected input  new insid  courseid  old insid
 
    try {

        const schema = Joi.object({
            insidold: Joi.string().required(),
            insidnew: Joi.string().required(),
            courseid:Joi.string().required()
        })
        let {value,error}=schema.validate(req.body);

        let id=payload.id;;//will be from payload
        let hoduser=await user.findOne({id:id});  
        let instrold=await user.findOne({id:req.body.insidold,department:hoduser.department});
        let instrnew=await user.findOne({id:req.body.insidnew,department:hoduser.department,userType:['am','ci']});
        let course=await courses.findOne({courseid:req.body.courseid,instructorid:req.body.insidold,department:hoduser.department})
        // console.log(course);
        // console.log("////////////////////");
        // console.log(instrnew);
        // res.send();
        if (!instrold||!instrnew||!course||error!=undefined) { 
        // console.log(instrnew.department);
        // console.log(instrold.id);   
        res.send("please double check enterd data");
            return;  }
        else{
                let inss=course.instructorid
                inss.forEach(function(item,index)
                {
                    if (item==req.body.insidold) {
                        inss[index]=req.body.insidnew
                    }
                })
                await user.findOneAndUpdate({id:req.body.insidnew},{userType:"ci"});
                await courses.findOneAndUpdate({courseid:req.body.courseid,instructorid:req.body.insidold},{instructorid:inss});
                await courseschedule.findOneAndUpdate({courseid:req.body.courseid,userid:req.body.insidold},{userid:req.body.insidnew})
                let rest=await courses.find({userid:req.body.insidold});
                if (rest.length==0) {
                    await user.findOneAndUpdate({id:req.body.insidold},{userType:"am"});
                }
                res.send('done');
                return;
            }
    } catch (error) {
        res.send("an err happend while in progress");
    }
    
})  


.delete(async(req,res)=>
{

    try {  //expected input  insid  courseid  

        const schema = Joi.object({
            insid: Joi.string().required(),
            courseid:Joi.string().required()
        })
        let {value,error}=schema.validate(req.body);

        let id=payload.id;//will be from payload
        let hoduser=await user.findOne({id:id});  
        let course=await courses.findOne({courseid:req.body.courseid,instructorid:req.body.insid,department:hoduser.department})
        let instr=await user.findOne({id:req.body.insid,department:hoduser.department,userType:['am','ci']});
        if (!course||!instr||error!=undefined) {
            res.send("please double check enterd data");
            return;
        }
        else{
            let newcoverage=(course.coveredslots-1)/course.numberofslots;
            let inss=course.instructorid
            let index=inss.indexOf(req.body.insid)
            inss.splice(index,1);
        await courses.findOneAndUpdate({courseid:req.body.courseid,instructorid:req.body.insid},{instructorid:inss,coverage:newcoverage});//check
        await courseschedule.findOneAndUpdate({courseid:req.body.courseid,userid:req.body.insid},{userid:undefined})//check
        let rest=await courses.find({userid:req.body.insid});
                if (rest.length==0) {
                    await user.findOneAndUpdate({id:req.body.insid},{userType:"am"});
                }
        res.send('done');
        }
         
    } catch (error) {
        res.send("an err happend while in progress");
    }
})


router.route('/staffindept')
.get(async(req,res)=>
{//expected input hodid from token payload
    try {
        const schema = Joi.object({})
        let {value,error}=schema.validate(req.body);

        if (error!=undefined) {
            res.send("please double check enterd data");
        } else {
            let id=payload.id;//will be from payload
        let hoduser=await user.findOne({id:id});  
        let out =await user.find({department:hoduser.department}).select({_id:0,password:0,salary:0}); 
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
            courseid:Joi.string().required()
        })
        let {value,error}=schema.validate(req.body);
        let courseid=req.body.courseid;
  let id=payload.id;//will be from payload
  let hoduser=await user.findOne({id:id}); 
  let exists=await courses.findOne({courseid:courseid,department:hoduser.department});
  if (!exists||error!=undefined) {
    res.send("please double check enterd data");
  }
  else{
        let out=await courseschedule.find({courseid:courseid}).select({userid:1,_id:0}); 
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

        //console.log(out); 
        res.send(out); 
        }  
    } catch (error) {
        console.log(error); 
        res.send("an err happend while in progress");
    }
  
})


router.route('/getdoffall')
   .get(async(req,res)=>
   {//expected input hodid from payload
    try {
        const schema = Joi.object({})
        let {value,error}=schema.validate(req.body);
        if (error!=undefined) {
            res.send("please double check enterd data");
        } else {
            let id=payload.id;//will be from payload  
            let hoduser=await user.findOne({id:id}); 
            let out=await user.find({department:hoduser.department,id:{$ne: id}}).select({id:1,name:1,dayoff:1,_id:0}); 
            res.send(out);
        }
       
    } catch (error) {
        res.send("an err happend while in progress");
    }
    
   })

   router.route('/getdoffsingle')
   .post(async(req,res)=>
   {//expected input userid from payload
    try {
        const schema = Joi.object({
            userid:Joi.string().required()
        })
        let {value,error}=schema.validate(req.body);
        if (error!=undefined) {
            res.send("please double check enterd data");
        } else {
            let id=payload.id;//will be from payload  
        let hoduser=await user.findOne({id:id});  
        let out=await user.find({department:hoduser.department,id:req.body.userid}).select({id:1,name:1,dayoff:1,_id:0});
        //console.log(out);
        res.send(out);
        }
        
    } catch (error) {
        res.send("please double check enterd data");
    }
   
   })



router.route('/coursecoverage')
.post(async(req,res)=>
{//expected input courseid
    try {
        const schema = Joi.object({
            courseid:Joi.string().required()
        })
        let {value,error}=schema.validate(req.body);
        let id=payload.id;//will be from payload  
    let hoduser=await user.findOne({id:id});
    let course=await courses.findOne({courseid:req.body.courseid,department:hoduser.department}).select({coverage:1,_id:0});
    if (!course||error!=undefined) {
        res.send("please double check the enterd data");return;
    }
    else
    res.send(course);  return;
    } catch (error) {
        res.send("an err happend while in progress");
    }
    
}) 


router.route('/teachingassignments')
.post(async(req,res)=>
{//expected input courseid
    try {
        const schema = Joi.object({
            courseid:Joi.string().required()
        })
        let {value,error}=schema.validate(req.body);
        let id=payload.id;//will be from payload  
    let hoduser=await user.findOne({id:id});
    let course=await courses.findOne({courseid:req.body.courseid,department:hoduser.department}).select({courseid:1,_id:0});
    if (!course||error!=undefined) {
        res.send("please double check the enterd data");return;
    }
    else{
        let out=await courseschedule.find({courseid:course.courseid});
        res.send(out);  
    }
    } catch (error) {
        res.send("an err happend while in progress"); 
    }
})

router.route('/dayoffrequest')
.get(async(req,res)=>//view
{
    try {
        const schema = Joi.object({})
        let {value,error}=schema.validate(req.body);
        if (error!=undefined) {
            res.send("please double check the enterd data");return;
        } else {
            let id=payload.id;//will be from payload
        let hoduser=await user.findOne({id:id}); 
        let users=await user.find ({department:hoduser.department}).select({id:1,_id:0});
        users.forEach((item,index)=>
        {
            users[index]=item.id;
        });
        //.log(await requests.ChangeDayoffRequest.find({senderid:users,status:"pending"}))
        res.send(await requests.ChangeDayoffRequest.find({senderid:users,status:"pending"}))
    }
    } catch (error) {
        
    }
    
    

})
.delete(async(req,res)=>//reject
{//expected input reqtid comment(optional)
    try {
        const schema = Joi.object({
            reqid:Joi.string().required(),
            comment:Joi.string()
        })
        let {value,error}=schema.validate(req.body);
        let id=payload.id;//will be from payload
        let hoduser=await user.findOne({id:id}); 
      let request=await requests.ChangeDayoffRequest.findOne({id:req.body.reqid,status:"pending"});
      if (!request||error!=undefined) {
        res.send("please double check the data")
      } else {
                let sender=await user.findOne({id:request.senderid,department:hoduser.department})
                if (!sender) {
                    res.send("please double check the data")
                } else {
                    
                        await requests.ChangeDayoffRequest.findOneAndUpdate({id:req.body.reqid,status:"pending"},{status:"rejected",comment:req.body.comment});
                        let not=sender.notifications;//"request :"+req.body.requestid+" is assepted "
                       let r="request :"+req.body.reqid+" is accepted "
                       not.push(r);
                      // console.log(""+not);
                       await user.findOneAndUpdate({id:request.senderid},{annualleavebalance:sender.annualleavebalance-1,notifications:not});
                        res.send("done");
                }
      }
    } catch (error) {
        res.send("an err happend while in progress"); 
    }
    
  
})


.post(async(req,res)=>//accept
{//expected input reqid
    try {
        const schema = Joi.object({
            reqid:Joi.string().required()
        })
        let {value,error}=schema.validate(req.body);
        let id=payload.id;//will be from payload
        let hoduser=await user.findOne({id:id}); 
        let request=await requests.ChangeDayoffRequest.findOne({id:req.body.reqid,status:"pending"});
        if (!request||error!=undefined) {
            res.send("please double check the data")
        } else {
                let sender=await user.findOne({id:request.senderid,department:hoduser.department})
                if (!sender) {
                    res.send("please double check the data")
                } else {
                    let not=sender.notifications;//"request :"+req.body.requestid+" is assepted "
                       let r="request :"+req.body.reqid+" is accepted "
                       not.push(r);
                      // console.log(""+not);
                       await user.findOneAndUpdate({id:request.senderid},{annualleavebalance:sender.annualleavebalance-1,notifications:not});
                        await user.findOneAndUpdate({id:request.senderid},{dayoff:request.dayoff});
                        await requests.ChangeDayoffRequest.findOneAndUpdate({id:req.body.reqid,status:"pending"},{status:"accepted"});
                        
                        res.send("done");
                }
        }
    } catch (error) {
        res.send("an err happend while in progress"); 
    }
    
    
})


router.route('/leaverequests')
.get(async(req,res)=>
{
    try {
        const schema = Joi.object({})
    let {value,error}=schema.validate(req.body);
    if (error!=undefined) {
        res.send("please double check the data")
    } else {
        let id=payload.id;//will be from payload
        let hoduser=await user.findOne({id:id}); 
        let users=await user.find ({department:hoduser.department}).select({id:1,_id:0});
        users.forEach((item,index)=>
        {
            users[index]=item.id;
        });
       let result=await requests.annualleaverequest.find({senderid:users,status:"pending"})
       result=result.concat(await requests.CompensationLeaveRequest.find({senderid:users,status:"pending"}))
       result=result.concat(await requests.AccidentalLeaveRequest.find({senderid:users,status:"pending"}))
       result=result.concat(await requests.SickLeavesRequest.find({senderid:users,status:"pending"}))
       result=result.concat(await requests.MaternityLeaveRequest.find({senderid:users,status:"pending"}))
       res.send(result);
       //console.log(result);
    }
    } catch (error) {
        res.send("an err happend while in progress"); 
    }
    
   
    
})

.post(async(req,res)=>//accept
{//expected input requestid 
    try {
        const schema = Joi.object({
            requestid:Joi.string().required()
        })
        let {value,error}=schema.validate(req.body);
        let id=payload.id;//will be from payload
       // let hoduser=await user.findOne({id:id}); 
    
        let result=await requests.annualleaverequest.find({id:req.body.requestid,status:"pending",destinationid:id})
        result=result.concat(await requests.CompensationLeaveRequest.find({id:req.body.requestid,status:"pending",destinationid:id}))
        result=result.concat(await requests.AccidentalLeaveRequest.find({id:req.body.requestid,status:"pending",destinationid:id}))
        result=result.concat(await requests.SickLeavesRequest.find({id:req.body.requestid,status:"pending",destinationid:id}))
        result=result.concat(await requests.MaternityLeaveRequest.find({id:req.body.requestid,status:"pending",destinationid:id}))
        console.log(result);
        //res.send("d")
        if (result.length==0||error!=undefined) {
            res.send("please double check enterd data")
        } else {
             let type=result[0].type;
           // res.send("length:"+result.length+"   "+type);
            let sender=await user.findOne({id:result[0].senderid});
    
            switch (type) {
                case "annualleaverequest":{//
                  
                    var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                    var dayName = days[result[0].targetdate.getDay()];//check
                    let obligations=await courseschedule.find({userid:result[0].senderid,day:dayName});
                   // res.send(obligations);
                    if (sender.annualleavebalance>=1&&obligations.length>0) {
                       
                       await requests.annualleaverequest.findOneAndUpdate({id:req.body.requestid},{status:"accepted"});
                       let not=sender.notifications;//"request :"+req.body.requestid+" is assepted "
                       let r="request :"+req.body.requestid+" is accepted "
                       not.push(r);
                      // console.log(""+not);
                       await user.findOneAndUpdate({id:result[0].senderid},{annualleavebalance:sender.annualleavebalance-1,notifications:not});
                        let replacereq=result[0]//.replacmentid;
                       // console.log(replacereq);
                        obligations.forEach(async(item,index)=>
                        {
                            let old=await courseschedule.findOne({courseid:item.courseid,day:item.day,slot:item.slot,userid:item.userid,location:item.location})
                            let tar=[];
                            tar=tar.concat(old.replacment);
                            tar.push(replacereq.replacmentid)
                            tar.push(replacereq.targetdate)
                            //console.log(tar);
                            await courseschedule.findOneAndUpdate({courseid:item.courseid,day:item.day,slot:item.slot,userid:item.userid,location:item.location},{replacment:tar})
                        })
    
                        res.send("done1")
                    }
    
                    else if (sender.annualleavebalance>=1&&obligations.length==0) {
                       // console.log("obligations");
                        await user.findOneAndUpdate({id:result[0].senderid},{annualleavebalance:sender.annualleavebalance-1});
                        await requests.annualleaverequest.findOneAndUpdate({id:req.body.requestid},{status:"accepted"});
                        res.send("done2")
                    } 
                    
                    else {
                        res.send("not enough leave days balance")
                    }
                   
                    break;}
    
                case "CompensationLeaveRequest":{//missing days??
                        var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                        var dayName = days[result[0].targetdate.getDay()];
                       
                       
                        if (dayName==sender.dayoff) {
                            await requests.CompensationLeaveRequest.findOneAndUpdate({id:req.body.requestid},{status:"accepted"});
                            let not=sender.notifications;//"request :"+req.body.requestid+" is assepted "
                            let r="request :"+req.body.requestid+" is accepted "
                            not.push(r);
                            await user.findOneAndUpdate({id:result[0].senderid},{notifications:not});
                            res.send("done3");
                        } else {
                            res.send("sender day must be his day off")
                        }
                    break;    }
                    
                case "AccidentalLeaveRequest":{//if request is accpeted we have to check for each new day as he has 6 days
                      //target date is actually starting date
                       await requests.AccidentalLeaveRequest.findOneAndUpdate({id:req.body.requestid},{status:"accepted"});
                       var today = new Date();
                      
                       
                       //console.log(today);
                       let duration=Math.abs(((today).getDay())-(result[0].targetdate.getDay()))+1;
                        var userbalance=sender.annualleavebalance;
                        // console.log(duration);
                        // res.send(userbalance);
                        if (duration>6) {
                            if (userbalance<6) {
                                let not=sender.notifications;//"request :"+req.body.requestid+" is assepted "
                                let r="request :"+req.body.requestid+" is accepted "
                                not.push(r);
                                await user.findOneAndUpdate({id:result[0].senderid},{notifications:not});
                                await user.findOneAndUpdate({id:result[0].senderid},{annualleavebalance:0});
                                //we should handle missing days
                            } else {
                                let not=sender.notifications;//"request :"+req.body.requestid+" is assepted "
                                let r="request :"+req.body.requestid+" is accepted "
                                not.push(r);
                                await user.findOneAndUpdate({id:result[0].senderid},{notifications:not});
                                await user.findOneAndUpdate({id:result[0].senderid},{annualleavebalance:userbalance-6});
                                //we should handle missing days
                            }
                        } else {
                            let not=sender.notifications;//"request :"+req.body.requestid+" is assepted "
                            let r="request :"+req.body.requestid+" is accepted "
                            not.push(r);
                            await user.findOneAndUpdate({id:result[0].senderid},{notifications:not});
                            await user.findOneAndUpdate({id:result[0].senderid},{annualleavebalance:userbalance-duration});
                        }
    
                    res.send("done")
                    break;}
    
                case "SickLeavesRequest":{
                    await requests.SickLeavesRequest.findOneAndUpdate({id:req.body.requestid},{status:"accepted"});
                    let not=sender.notifications;//"request :"+req.body.requestid+" is assepted "
                    let r="request :"+req.body.requestid+" is accepted "
                    not.push(r);
                    await user.findOneAndUpdate({id:result[0].senderid},{notifications:not});
                    res.send("done")
                    break;   }
    
                 case "MaternityLeaveRequest":{
                    let not=sender.notifications;//"request :"+req.body.requestid+" is assepted "
                    let r="request :"+req.body.requestid+" is accepted "
                    not.push(r);
                    await user.findOneAndUpdate({id:result[0].senderid},{notifications:not});
                    await requests.MaternityLeaveRequest.findOneAndUpdate({id:req.body.requestid},{status:"accepted"});
                    res.send("done")
                    break;    }
            
                default:
                    break;
            }
        }
    } catch (error) {
        res.send("an error happend while in progress")
    }

})

.delete(async(req,res)=>
{//expected input requestid  comment(optional)
    try {
        const schema = Joi.object({
            requestid:Joi.string().required(),
            comment:Joi.string()
        })
        let {value,error}=schema.validate(req.body);
        let id=payload.id;//will be from payload
       // let hoduser=await user.findOne({id:id}); 
       
        let result=await requests.annualleaverequest.find({id:req.body.requestid,status:"pending",destinationid:id})
        result=result.concat(await requests.CompensationLeaveRequest.find({id:req.body.requestid,status:"pending",destinationid:id}))
        result=result.concat(await requests.AccidentalLeaveRequest.find({id:req.body.requestid,status:"pending",destinationid:id}))
        result=result.concat(await requests.SickLeavesRequest.find({id:req.body.requestid,status:"pending",destinationid:id}))
        result=result.concat(await requests.MaternityLeaveRequest.find({id:req.body.requestid,status:"pending",destinationid:id}))
        
        if (result.length==0||error!=undefined) {
            res.send('please double check enterd data');
        } else {
            let sender=await user.findOne({id:result[0].senderid});
            let type=result[0].type;
            switch (type) {
                case "annualleaverequest":{//
                    let not=sender.notifications;//"request :"+req.body.requestid+" is assepted "
                    let r="request :"+req.body.requestid+" is rejected "
                    not.push(r);
                    console.log(not);
                    console.log( await user.findOneAndUpdate({id:result[0].senderid},{notifications:not}));
                    await requests.annualleaverequest.findOneAndUpdate({id:req.body.requestid,status:"pending",destinationid:id},{status:"rejected",comment:req.body.comment})
                    res.send("done")
                    break;}
    
                case "CompensationLeaveRequest":{//missing days??
                    let not=sender.notifications;//"request :"+req.body.requestid+" is assepted "
                    let r="request :"+req.body.requestid+" is rejected "
                    not.push(r);
                    await user.findOneAndUpdate({id:result[0].senderid},{notifications:not});
                    await requests.CompensationLeaveRequest.findOneAndUpdate({id:req.body.requestid,status:"pending",destinationid:id},{status:"rejected",comment:req.body.comment})
                    res.send("done")
                    break;    }
                    
                case "AccidentalLeaveRequest":{//if request is accpeted we have to check for each new day as he has 6 days
                      //target date is actually starting date
                      let not=sender.notifications;//"request :"+req.body.requestid+" is assepted "
                    let r="request :"+req.body.requestid+" is rejected "
                    not.push(r);
                    await user.findOneAndUpdate({id:result[0].senderid},{notifications:not});
                      await requests.CompensationLeaveRequest.findOneAndUpdate({id:req.body.requestid,status:"pending",destinationid:id},{status:"rejected",comment:req.body.comment})
                      res.send("done")
                    break;}
    
                case "SickLeavesRequest":{
                    let not=sender.notifications;//"request :"+req.body.requestid+" is assepted "
                    let r="request :"+req.body.requestid+" is rejected "
                    not.push(r);
                    await user.findOneAndUpdate({id:result[0].senderid},{notifications:not});
                    await requests.SickLeavesRequest.findOneAndUpdate({id:req.body.requestid,status:"pending",destinationid:id},{status:"rejected",comment:req.body.comment})
                   
                    res.send("done")
                    break;   }
    
                 case "MaternityLeaveRequest":{
                    let not=sender.notifications;//"request :"+req.body.requestid+" is assepted "
                    let r="request :"+req.body.requestid+" is rejected "
                    not.push(r);
                    await user.findOneAndUpdate({id:result[0].senderid},{notifications:not});
                    await requests.MaternityLeaveRequest.findOneAndUpdate({id:req.body.requestid,status:"pending",destinationid:id},{status:"rejected",comment:req.body.comment})
       
                    res.send("done")
                    break;    
                 }
                default:
                    break;
            }
        }
    } catch (error) {
        res.send("an error happend while in progress");
    }
    
})
module.exports=router; 

 