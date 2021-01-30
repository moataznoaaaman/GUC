// Courses					
// CID	Course name	Faculty	Course Cordinator	Instructor	Department	Coverage	Number of slots

const mongoose=require('mongoose');
const schema=mongoose.Schema;

const coursesSchema=new schema
(
    {
        courseid:{type:String,required:true},
        coursename:{type:String,required:true},
        faculty:{type:String,required:true},
        cordinatorid:{type:String},//{type:String,required:true}
        instructorid:{type:Array,default:[]},//{type:String,required:true}
        department:{type:String,required:true},
        coverage:{type:Number,required:true},
        numberofslots:{type:Number,required:true},
        coveredslots:{type:Number,required:true}
        
        

    }
)


module.exports=mongoose.model('course',coursesSchema);