var mongoose=require('mongoose');


var Schema=mongoose.Schema;

//auto incrementer for ID




var userSchema=new Schema({
    id:{type:String,required:true,unique:true,index:true},
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String},
    userType:{type:String,required:true},
    salary:{type:Number},
    office:{type:String},
    dayoff:{type:String,default:'saturday'},
    faculty:{type:String},
    department:{type:String},

    hourspermonth:{type:Number,default:164.8},
    //////////////////////////////////////
    annualleavebalance:{type:Number,default:2.5},
    gender:{type:String,default:"male"},
    notifications:{type:Array,default:[]},
    
    missingdays:{type:Number,default:0},
    missinghours:{type:Number,default:0},
    extrahours:{type:Number,default:0},
    workedhours:{type:Number,default:0}


}
);
var user=mongoose.model('user',userSchema);

module.exports=user;