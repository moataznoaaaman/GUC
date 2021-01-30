var mongoose=require('mongoose');


var Schema=mongoose.Schema;

//auto incrementer for ID





var departmentSchema=new Schema({
    faculty:{type:String},
    department:{type:String},
    hod:{type:String}

}
);

var department=mongoose.model('department',departmentSchema);

module.exports=department;