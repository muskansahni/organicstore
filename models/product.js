var mongoose=require("mongoose");

let productSchema= new mongoose.Schema({
    title:String,
    image:String,
    description:String,
    price:Number,
  
        



});

 module.exports= mongoose.model("Product",productSchema);