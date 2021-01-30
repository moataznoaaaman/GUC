const mongoose=require('mongoose');
const schema=mongoose.Schema;

const scheduleSchema=new schema
(
    {
        userid:{type:String,required:true},
        day:{type:String,required:true},
        slot:{type:Number,required:true},
        couresid:{type:String,required:true},
        location:{type:String,required:true}

    }
)


module.exports=mongoose.model('schedule',scheduleSchema);