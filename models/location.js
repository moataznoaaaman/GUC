var mongoose=require('mongoose');


var Schema=mongoose.Schema;

//auto incrementer for ID





var locationSchema=new Schema({
    room:{type:String,required:true,unique:true},
    type:{type:String,required:true},
    capacity:{type:Number,required:true}
}
);

var location=mongoose.model('location',locationSchema);

module.exports=location;