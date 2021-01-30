const { array } = require('joi');
const { Timestamp } = require('mongodb');
var mongoose=require('mongoose');


var Schema=mongoose.Schema;


var attendanceSchema=new Schema({
    id:{type:String,required:true},
    date:{type:String},
    dayname:{type:String},
    signs:{type:Array}
})


var attendance=mongoose.model('attendance',attendanceSchema);

module.exports=attendance;