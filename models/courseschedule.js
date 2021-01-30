// Course schedule			
// cid	day	slot	user id	location

const mongoose=require('mongoose');
const schema=mongoose.Schema;

const coursescheduleSchema=new schema
(
    {
        courseid:{type:String,required:true},
        day:{type:String,required:true},
        slot:{type:Number,required:true},
        userid:{type:String},//,required:true},
        location:{type:String,required:true},
        replacment:{type:Array,default:[]}

    }
)


module.exports=mongoose.model('courseschedule',coursescheduleSchema);