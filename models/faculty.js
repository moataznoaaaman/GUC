var mongoose=require('mongoose');


var Schema=mongoose.Schema;

//auto incrementer for ID




var facultySchema=new Schema({
    name:{type:String,required:true},
}
);

var faculty=mongoose.model('faculty',facultySchema);

module.exports=faculty;