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
const { app } = require('../app');
const { route } = require('./login_route.js');
const Joi=require('joi');
const requests=require('../models/request.model');
const tokenblacklist=require('../models/tokenBlacklist');

var key = 'el5atir';  

const router=express.Router();
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
        if (payload.userType == 'am'||payload.userType == "ci"||payload.userType == "hod") {
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
    
    res.send(await requests.annualleaverequest.find());
})

router.route('/viewschedule')
.get(async (req,res)=>
{
    try {
        const schema = Joi.object({});
    let {value,error}=schema.validate(req.body);
    if (error!=undefined) {
        res.send("please double check enterd data");
    } else {
        id=payload.id;
        console.log(await courseschedule.find({userid:id}))
    res.send(await courseschedule.find({userid:id}));
    }
    } catch (errorx) {
        console.log(errorx)
        res.send("err happend while in progress");
    }
    
    

})
router.route('/changedayoff')
.post (async(req,res)=>
{//expected input reqestid  newday

    try {
        const schema = Joi.object({
            requestid: Joi.string().required(),
            newday:Joi.string().required()
    
    })
            let {value,error}=schema.validate(req.body);
        
        let id=payload.id;//will be from payload  
        let sender=await user.findOne({id:id});
    
        var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        
        //res.send(days.includes(req.body.newday)+"");
    
        let result=await requests.annualleaverequest.find({id:req.body.requestid})
        result=result.concat(await requests.CompensationLeaveRequest.find({id:req.body.requestid}))
        result=result.concat(await requests.AccidentalLeaveRequest.find({id:req.body.requestid}))
        result=result.concat(await requests.SickLeavesRequest.find({id:req.body.requestid}))
        result=result.concat(await requests.MaternityLeaveRequest.find({id:req.body.requestid}))
        result=result.concat(await requests.ChangeDayoffRequest.find({id:req.body.requestid}))
        result=result.concat(await requests.ReplacementRequest.find({id:req.body.requestid}))
        console.log(result)
        if (result.length!=0||!days.includes(req.body.newday)||req.body.newday==sender.dayoff||error!=undefined) {
           res.send("please double check enterd data")
           console.log(error);
        } else {
            let hod =await department.findOne({department:sender.department})
            let reqs=new requests.ChangeDayoffRequest({
                id:req.body.requestid,
                senderid:id,
                destinationid:hod.hod,
                dayoff:req.body.newday,
                reason:req.body.reason
            })
    
            await reqs.save();
            res.send("done")
        }
        //console.log(result);
    } catch (error) {
        console.log(errorx)
        res.send("err happend while in progress");
    }
    
})

router.route('/annualleaverequest')
.post(async(req,res)=>
{//expected input targetdate  requestid replacmentid  reason

    try {
        const schema = Joi.object({
            requestid: Joi.string().required(),
            targetdate:Joi.date().required(),
            replacmentid:Joi.string(),
            reason:Joi.string()
    
    })
            let {value,error}=schema.validate(req.body);
        let id=payload.id;//will be from payload  
        let sender=await user.findOne({id:id});
    
        var d1 = new Date();
        var d2 = new Date(req.body.targetdate)
        let duration=d2.getDate()-d1.getDate();
    
        let result=await requests.annualleaverequest.find({id:req.body.requestid})
        result=result.concat(await requests.CompensationLeaveRequest.find({id:req.body.requestid}))
        result=result.concat(await requests.AccidentalLeaveRequest.find({id:req.body.requestid}))
        result=result.concat(await requests.SickLeavesRequest.find({id:req.body.requestid}))
        result=result.concat(await requests.MaternityLeaveRequest.find({id:req.body.requestid}))
        result=result.concat(await requests.ChangeDayoffRequest.find({id:req.body.requestid}))
        result=result.concat(await requests.ReplacementRequest.find({id:req.body.requestid}))
    //    console.log(duration);
    //    console.log(result);
        
     if (result.length!=0||duration<=0||error!=undefined) {
        res.send("please double check enterd data")
        console.log(error);
     } else {
        let exists=await requests.ReplacementRequest.findOne({targetdate:req.body.targetdate,course:req.body.courseid,replacementid:req.body.replacmentid,senderid:id,status:"accepted"})
        let hod =await department.findOne({department:sender.department})
        //    console.log(exists);
        //    console.log(hod);
        if (exists) {
            let reqs=new requests.annualleaverequest({
                id:req.body.requestid,
                senderid:id,
                destinationid:hod.hod,
                targetdate:req.body.targetdate,
                replacmentid:req.body.replacmentid,
                reason:req.body.reason
            })
            console.log("here");
            await reqs.save();
        } else {
            let reqs=new requests.annualleaverequest({
                id:req.body.requestid,
                senderid:id,
                destinationid:hod.hod,
                targetdate:req.body.targetdate,
                reason:req.body.reason
            })
            console.log(await reqs.save());
            
        }
        
         res.send("done");
     }
    } catch (error) {
        res.send("err happend while in progress");
    }

    
})


router.route('/accidentalleave')
.post(async(req,res)=>
{//expected input targetdate  requestid reason
    try {
        const schema = Joi.object({
            requestid: Joi.string().required(),
            targetdate:Joi.date().required(),
            reason:Joi.string()
    })
            let {value,error}=schema.validate(req.body);
        let id=payload.id;//will be from payload  
        let sender=await user.findOne({id:id});
    
        let hod =await department.findOne({department:sender.department})
    
        let result=await requests.annualleaverequest.find({id:req.body.requestid})
        result=result.concat(await requests.CompensationLeaveRequest.find({id:req.body.requestid}))
        result=result.concat(await requests.AccidentalLeaveRequest.find({id:req.body.requestid}))
        result=result.concat(await requests.SickLeavesRequest.find({id:req.body.requestid}))
        result=result.concat(await requests.MaternityLeaveRequest.find({id:req.body.requestid}))
        result=result.concat(await requests.ChangeDayoffRequest.find({id:req.body.requestid}))
        result=result.concat(await requests.ReplacementRequest.find({id:req.body.requestid}))
    
        if (result.length!=0||error!=undefined) {
            res.send("please double check enterd data")
            console.log(error)
        } else {
            let reqs=new requests.AccidentalLeaveRequest
        ({
              id:req.body.requestid,
              senderid:id,
              destinationid:hod.hod,
              targetdate:req.body.targetdate,
              reason:req.body.reason
        })
        await reqs.save();
        res.send("done")
        }
    } catch (error) {
        console.log(error)
        res.send("err happend while in progress")
    }
    
    
})

router.route('/sickleave')
.post(async(req,res)=>
{//expectedinput targetdate requestid  document  reason
    try {
        const schema = Joi.object({
            requestid: Joi.string().required(),
            targetdate:Joi.date().required(),
            document: Joi.string().required(),
            reason:Joi.string()
    })
            let {value,error}=schema.validate(req.body);
        var d1 = new Date();
        var d2 = new Date(req.body.targetdate)
        let duration=d2.getDate()-d1.getDate();
    
        let result=await requests.annualleaverequest.find({id:req.body.requestid})
        result=result.concat(await requests.CompensationLeaveRequest.find({id:req.body.requestid}))
        result=result.concat(await requests.AccidentalLeaveRequest.find({id:req.body.requestid}))
        result=result.concat(await requests.SickLeavesRequest.find({id:req.body.requestid}))
        result=result.concat(await requests.MaternityLeaveRequest.find({id:req.body.requestid}))
        result=result.concat(await requests.ChangeDayoffRequest.find({id:req.body.requestid}))
        result=result.concat(await requests.ReplacementRequest.find({id:req.body.requestid}))
        if (duration>3||duration<=0||result.length!=0||error!=undefined) {
            res.send("please double check enterd data")
            console.log(error);
        } else {
            let id=payload.id;//will be from payload  
            let sender=await user.findOne({id:id});
            let hod =await department.findOne({department:sender.department})
    
            let reqs=new requests.SickLeavesRequest
        ({
              id:req.body.requestid,
              senderid:id,
              destinationid:hod.hod,
              sickdate:req.body.targetdate,
              document:req.body.document,
              reason:req.body.reason
        })
        await reqs.save();
        res.send("done");
    
        }
    } catch (error) {
        res.send("err happend while in progress");
    }
    
        
})

router.route('/maternityleave')
.post(async(req,res)=>
{//expectedinput targetdate requestid  document reason
    try {
        const schema = Joi.object({
            requestid: Joi.string().required(),
            targetdate:Joi.date().required(),
            document: Joi.string().required(),
            reason:Joi.string()
    })
            let {value,error}=schema.validate(req.body);
        let id=payload.id;//will be from payload  
        let sender=await user.findOne({id:id});
        let hod =await department.findOne({department:sender.department});
    
        let result=await requests.annualleaverequest.find({id:req.body.requestid})
        result=result.concat(await requests.CompensationLeaveRequest.find({id:req.body.requestid}))
        result=result.concat(await requests.AccidentalLeaveRequest.find({id:req.body.requestid}))
        result=result.concat(await requests.SickLeavesRequest.find({id:req.body.requestid}))
        result=result.concat(await requests.MaternityLeaveRequest.find({id:req.body.requestid}))
        result=result.concat(await requests.ChangeDayoffRequest.find({id:req.body.requestid}))
        result=result.concat(await requests.ReplacementRequest.find({id:req.body.requestid}))
    
        if (sender.gender!="female"||result.length!=0||error!=undefined) {
            res.send("please double check enterd data")
            console.log(error)
        } else {
            let reqs=new requests.MaternityLeaveRequest
        ({
              id:req.body.requestid,
              senderid:id,
              destinationid:hod.hod,
              targetdate:req.body.targetdate,
              document:req.body.document,
              reason:req.body.reason
        })
        await reqs.save();
        res.send("done");
        }
    } catch (error) {
        res.send("err happend while in progress");
    }
    
})

router.route('/Compensationleave')
.post(async(req,res)=>
{//expectedinput targetdate requestid   reason
    try {
        const schema = Joi.object({
            requestid: Joi.string().required(),
            targetdate:Joi.date().required(),
            
            reason:Joi.string()
    })
        let {value,error}=schema.validate(req.body);
    let id=payload.id;//will be from payload  
    let sender=await user.findOne({id:id});
    let hod =await department.findOne({department:sender.department});

    let result=await requests.annualleaverequest.find({id:req.body.requestid})
    result=result.concat(await requests.CompensationLeaveRequest.find({id:req.body.requestid}))
    result=result.concat(await requests.AccidentalLeaveRequest.find({id:req.body.requestid}))
    result=result.concat(await requests.SickLeavesRequest.find({id:req.body.requestid}))
    result=result.concat(await requests.MaternityLeaveRequest.find({id:req.body.requestid}))
    result=result.concat(await requests.ChangeDayoffRequest.find({id:req.body.requestid}))
    result=result.concat(await requests.ReplacementRequest.find({id:req.body.requestid}))

    if (result.length!=0||error!=undefined) {
        res.send("please double check enterd data")
        console.log(error)
    } else {
        let reqs=new requests.CompensationLeaveRequest
    ({
          id:req.body.requestid,
          senderid:id,
          destinationid:hod.hod,
          targetdate:req.body.targetdate,
          reason:req.body.reason
    })
    await reqs.save();
    res.send("done");
    }

    } catch (error) {
        res.send("err happend while in progress");
    }
    
})

router.route('/replacmentrequest')
.post(async(req,res)=>
{//expected input targetdate  reciverid courseid  requestid
    try {
        const schema = Joi.object({
            requestid: Joi.string().required(),
            targetdate:Joi.date().required(),
            reciverid: Joi.string().required(),
            courseid:Joi.string().required(),
    })
            let {value,error}=schema.validate(req.body);
        let id=payload.id;//will be from payload  
        let sender=await user.findOne({id:id});
    
        var d1 = new Date();
        var d2 = new Date(req.body.targetdate)
        let duration=d2.getDate()-d1.getDate();
    
        let reciver =await courseschedule.findOne({userid:req.body.reciverid,courseid:req.body.courseid})
        var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                        var dayName = days[d2.getDay()];
                        //console.log(dayName);
        let slot=await courseschedule.findOne({courseid:req.body.courseid,day:dayName,userid:id})
    
        let result=await requests.annualleaverequest.find({id:req.body.requestid})
        result=result.concat(await requests.CompensationLeaveRequest.find({id:req.body.requestid}))
        result=result.concat(await requests.AccidentalLeaveRequest.find({id:req.body.requestid}))
        result=result.concat(await requests.SickLeavesRequest.find({id:req.body.requestid}))
        result=result.concat(await requests.MaternityLeaveRequest.find({id:req.body.requestid}))
        result=result.concat(await requests.ChangeDayoffRequest.find({id:req.body.requestid}))
        result=result.concat(await requests.ReplacementRequest.find({id:req.body.requestid}))
    
         //console.log(reciver);
        // console.log("dayName");
        // console.log(duration);
        // console.log("dayName");
        // console.log(slot);
        // console.log("dayName");
        // console.log(result);
        
        if (duration<=0||!reciver||!slot||result.length!=0||error!=undefined) {
            res.send("please double check enterd data")
            console.log(error)
        } else {
            
            //let hod =await department.findOne({department:sender.department})
            // console.log(slot);
            // console.log("dayName");
            // console.log(result);
            let reqs=new requests.ReplacementRequest({
                id:req.body.requestid,
                senderid:id,
                destinationid:req.body.reciverid,
                targetdate:req.body.targetdate,
                course:req.body.courseid,
               // replacementid:req.body.reciverid
            })
           await reqs.save();
    
            res.send("done");
        }
    } catch (error) {
        res.send("err happend while in progress");
    }
      
})

.get(async(req,res)=>{
    try {
        const schema = Joi.object({})
        let {value,error}=schema.validate(req.body);
        if (error!=undefined) {
            res.send("please double check enterd data")
        } else {
            let id=payload.id;//will be from payload  
            let result=await requests.ReplacementRequest.find({destinationid:id,status:"pending"})
            res.send(result);
        }
    } catch (error) {
        res.send("err happend while in progress");
    }
    
    
    
})
router.route('/ansewrrequest')
.post(async(req,res)=>
{
    try {
        result =await requests.ReplacementRequest.findOne({id:req.body.requestid,status:"pending"})
        if (!result) {
            res.send('no such request')
        } else {
            await requests.ReplacementRequest.findOneAndUpdate({id:req.body.requestid},{status:req.body.answer});
            let sender=await user.findOne({id:result.senderid})
            let not=sender.notifications;//"request :"+req.body.requestid+" is assepted "
            let r="request :"+req.body.requestid+" is accepted "
            not.push(r);
           // console.log(""+not);
            await user.findOneAndUpdate({id:sender.id},{notifications:not});
            res.send("done");
        }
    } catch (error) {
        
    }
   
})
router.route('/getnotifications')
.get(async(req,res)=>
{
    try {
        const schema = Joi.object({})
        let {value,error}=schema.validate(req.body);
        if (error!=undefined) {
            res.send("please double check enterd data")
        } else {
            let id=payload.id;;//from payload
            res.send(await user.findOne({id:id}).select({_id:0,notifications:1}));
        }
    
    } catch (error) {
        res.send("err happend while in progress");
    }
    

})

router.route('/getrequests')
.get(async(req,res)=>
{
    try {
        const schema = Joi.object({})
    let {value,error}=schema.validate(req.body);
    if (error!=undefined) {
        res.send("please double check enterd data")
    } else {
        let id=payload.id;;//from payload
        let result=await requests.annualleaverequest.find({status:"pending",senderid:id})
        result=result.concat(await requests.CompensationLeaveRequest.find({status:"pending",senderid:id}))
        result=result.concat(await requests.AccidentalLeaveRequest.find({status:"pending",senderid:id}))
        result=result.concat(await requests.SickLeavesRequest.find({status:"pending",senderid:id}))
        result=result.concat(await requests.MaternityLeaveRequest.find({status:"pending",senderid:id}))
        result=result.concat(await requests.ChangeDayoffRequest.find({status:"pending",senderid:id}))
        result=result.concat(await requests.ReplacementRequest.find({status:"pending",senderid:id}))

    res.send(result);
    }
    
    } catch (error) {
        res.send("err happend while in progress");
    }
    
})

router.route('/cancelrequest')
.delete(async(req,res)=>
{//expected input  requestid
    try {
        const schema = Joi.object({
            requestid: Joi.string().required()
    })
            let {value,error}=schema.validate(req.body);
        let id=payload.id;;//from payload
        let result=await requests.annualleaverequest.find({id:req.body.requestid,status:"pending",senderid:id})
        result=result.concat(await requests.CompensationLeaveRequest.find({id:req.body.requestid,status:"pending",senderid:id}))
        result=result.concat(await requests.AccidentalLeaveRequest.find({id:req.body.requestid,status:"pending",senderid:id}))
        result=result.concat(await requests.SickLeavesRequest.find({id:req.body.requestid,status:"pending",senderid:id}))
        result=result.concat(await requests.MaternityLeaveRequest.find({id:req.body.requestid,status:"pending",senderid:id}));
        result=result.concat(await requests.ChangeDayoffRequest.find({id:req.body.requestid,status:"pending",senderid:id}))
        result=result.concat(await requests.ReplacementRequest.find({id:req.body.requestid,status:"pending",senderid:id}));
    
        if (result.length==0||error!=undefined) {
            res.send("please double check enterd data");
            console.log(error)
        } else {
            let type=result[0].type;
            switch (type) {
                    case "ChangeDayoffRequest":
                         await requests.ChangeDayoffRequest.findOneAndUpdate({id:req.body.requestid},{status:"cancled"});
                    break;
    
                    case "SlotLinkingRequest":
                        await requests.SlotLinkingRequest.findOneAndUpdate({id:req.body.requestid},{status:"cancled"});
                    break; 
    
                    case "CompensationLeaveRequest":
                        await requests.CompensationLeaveRequest.findOneAndUpdate({id:req.body.requestid},{status:"cancled"});
                    break;
    
                    case "AccidentalLeaveRequest":
                        await requests.AccidentalLeaveRequest.findOneAndUpdate({id:req.body.requestid},{status:"cancled"});
                    break;
    
                    case "SickLeavesRequest":
                        await requests.SickLeavesRequest.findOneAndUpdate({id:req.body.requestid},{status:"cancled"});
                    break;
    
                    case "MaternityLeaveRequest":
                        await requests.MaternityLeaveRequest.findOneAndUpdate({id:req.body.requestid},{status:"cancled"});
                    break;
    
                    case "annualleaverequest":
                        await requests.annualleaverequest.findOneAndUpdate({id:req.body.requestid},{status:"cancled"});
                    break;  
    
                    case "ReplacementRequest":
                        await requests.ReplacementRequest.findOneAndUpdate({id:req.body.requestid},{status:"cancled"});
                    break;  
                    
                    
                default:
                    break;
            }
    
            res.send("done");
        }
    } catch (error) {
        res.send("err happend while in progress");
    }
    
})
module.exports=router; 