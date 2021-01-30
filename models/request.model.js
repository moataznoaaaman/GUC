/**
 * All models will be stored in the collection of requests.
 * A parent schema (BaseSchema) is the common base of a baseRequest model
 * 
 * BaseSchema:
 *     Date: Request date
 *     id: Request id
 *     status: Request status
 *     senderid: The id of the academic staff member, in which the request belongs to.
 *     destinationid: The id of the staff member who is responsible of accepting/rejecting the request.//hod
 * 
 * ChangeDayoffSchema extends BaseSchema:
 *     dayoff: Targetted day of the request.
 *     reason: Optional field, for specifying the reason.
 * 
 * SlotLinkingRequest extends BaseSchema:
 *     slot: Targetted slot of the request.
 *     course: The course the slot belongs to.
 * 
 * ReplacementRequest extends BaseSchema:
 *     targetdate: Targetted day of the repalcement.
 *     course: Replacement course.
 *     department: Repelacement department.
 *     replacementid: The academic staff member, whom will replace.
 *     replacementstatus: Replacement acception/rejection.
 * 
 * CompensationLeaveRequest extends BaseSchema:
 *     reason: Request justification, mandatory.
 *     department: Department of the academic member, who made the request.
 *     compensationdate: Has to be his/her dayoff
 *     targetdate: Absence date.
 * 
 * AccidentalLeavesRequest extends BaseSchema:
 *     targetdate: The date in which the request justifies.
 * 
 * SickLeaveRequest extends BaseSchema:
 *     sickDate: The date in which the sickness occured.
 *     document: Documents associated with the sickness.
 * 
 * MaternityLeaveRequest extends BaseSchema:
 *     document: Documents proving pregnancy (wtf ?!)
 * 
 * Author: Ote Leo
 */


const { string } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schemas

/**
 * The base Schema of a Request, that's gonna be stored in Request Collection
 */
const BaseSchema = new Schema({
    date: {type: Date, default: Date.now},//creation date
    id: {type: String, required: true,unique:true},
    status: {type: String, default: 'pending'},
    senderid: {type: String, required: true},
    comment:{type:String},
    destinationid: {type: String,required:true},//hod //ci//cc

}, {
    timestamps: true,
    discriminatorKey: 'type',
    collection: 'Request'
});


const annualleaveschema=new Schema 
({
    reason: {type: String},
    targetdate: {type: Date, required: true},
    replacmentid:{type: String}
})


const ChangeDayoffSchema = new Schema({//new day off cant be friday  it can be anything else including existing day 
    
    dayoff: {type: String, required: true},
    reason: {type: String}
});


/**
 * Any academic member can send a 'slot linking' request (automatically sent to course coordinator).
 * A 'slot linking' request is a request done by the academic member to indicate their desire to teach a slot.
 */
const SlotLinkingSchema = new Schema({
    
    slot: {type: Number, required: true},
    course: {type: String, required: true},
    day:{type:String},
    location:{type:String}
});



const ReplacementSchema = new Schema({// replacment targetdate=>upcoming
    
    targetdate: {type: Date, required: true},
    course: {type: String, required: true},//his own course and ta course
    //replacementid: {type: String},//must be in same course(target ta)

});


/**
 * In case a staff member is absent on a working day, he can request a compensation leave in order
 * to avoid salary deduction. In order for the request to be valid, the staff member should attend
 * his dayoff during the same month which he was absent in.
 * 
 * Compensation leaves must have a reason. 
 */
const CompensationLeaveSchema = new Schema({
    reason: {type: String, required: true},
    targetdate: {type: Date, required: true}//must be his day off
});


/**
 * Each staff member has up to six days for accidental leaves
 * Accidental Leaves can be submitted after the targeted day
 * Accidental Leaves are consumed from the annual leave balance ???
 */
const AccidentalLeaveSchema = new Schema({
    reason: {type: String},
    targetdate: {type: Date, required: true, Date, default: Date.now}//
});


/**
 * Sick leaves are not consumed from the annual leaves balance. This leave can be submitted 
 * by maximum three days after the sick day.
 * Sick leaves have no day limits.
 * Proper documents should be sumitted with the leave request to prove the medical condition.
 */
const SickLeavesSchema = new Schema({
   
    sickdate: {type: Date, required: true},
    document: {type: String, required: true}
});


/**
 * Maternity leaves are not consumed from the annual leaves balance.
 * Maternity leaves should only be submitted by female staff members.
 * Proper documents should be submitted with the leave request to prove the maternity condition.
 */
const MaternityLeaveSchema = new Schema({
    targetdate: {type: Date, required: true},
    document: {type: String, required: true}
});


// Models
// Define base model, then define other models objects based on this model
const BaseRequest = mongoose.model('BaseRequest', BaseSchema);

const ChangeDayoffRequest = BaseRequest.discriminator('ChangeDayoffRequest', ChangeDayoffSchema);
const SlotLinkingRequest = BaseRequest.discriminator('SlotLinkingRequest', SlotLinkingSchema);
const ReplacementRequest = BaseRequest.discriminator('ReplacementRequest', ReplacementSchema);
const CompensationLeaveRequest = BaseRequest.discriminator('CompensationLeaveRequest', CompensationLeaveSchema);
const AccidentalLeaveRequest = BaseRequest.discriminator('AccidentalLeaveRequest', AccidentalLeaveSchema);
const SickLeavesRequest = BaseRequest.discriminator('SickLeavesRequest', SickLeavesSchema);
const MaternityLeaveRequest = BaseRequest.discriminator('MaternityLeaveRequest', MaternityLeaveSchema);
/////////////////////annualleaveschema
const annualleaverequest=BaseRequest.discriminator('annualleaverequest', annualleaveschema);
module.exports.annualleaverequest=annualleaverequest;
////////////////////
module.exports.ChangeDayoffRequest = ChangeDayoffRequest;
module.exports.SlotLinkingRequest = SlotLinkingRequest;
module.exports.ReplacementRequest = ReplacementRequest;
module.exports.CompensationLeaveRequest = CompensationLeaveRequest
module.exports.AccidentalLeaveRequest = AccidentalLeaveRequest;
module.exports.SickLeavesRequest = SickLeavesRequest;
module.exports.MaternityLeaveRequest = MaternityLeaveRequest;
