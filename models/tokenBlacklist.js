var mongoose=require('mongoose');


var Schema=mongoose.Schema;

//auto incrementer for ID





var tokenBlacklists=new Schema({
    token:{type:String}

}
);

var tokenBlacklist=mongoose.model('tokenBlacklist',tokenBlacklists);

module.exports=tokenBlacklist;