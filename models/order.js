var mongoose=require('mongoose');
var orderSchema= new mongoose.Schema({
    user:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"User"
    },
    name:String,
    cart:{type:Object,required:true},
    address:{type:String,required:true},
    total:Number,
  



});
module.exports=mongoose.model("Order",orderSchema);