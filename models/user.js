var mongoose= require("mongoose");
var localpassportmongoose=require("passport-local-mongoose");
var userSchema= new mongoose.Schema({
    
    username:String,
    password:String,
});
userSchema.plugin(localpassportmongoose);
module.exports=mongoose.model("User",userSchema);
