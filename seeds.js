var mongoose= require("mongoose");
var Product= require("./models/product");
var data=[
{
   title:"Apple",
   image:"https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
   price:9,
   description:"High in nutrition",

},
{
    title:"Orange",
    image:"https://images.unsplash.com/photo-1579969653892-c3cc5f24535a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
    price:7,
    description:"High in nutrition",

 },
 {
    title:"Kiwi",
    image:"https://images.unsplash.com/photo-1521997888043-aa9c827744f8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
    price:8,
    description:"High in nutrition" ,
 
 },
 {
    title:"Banana",
    image:"https://images.unsplash.com/photo-1579523360595-bee0f3b9fafb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
    price:5,
    description:"High in nutrition" ,

 },
 {
    title:"Strawberry",
    image:"https://images.unsplash.com/photo-1518635017498-87f514b751ba?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
    price:19,
    description:"High in nutrition" ,

 },
 {
    title:"Candy",
    image:"https://images.unsplash.com/photo-1499195333224-3ce974eecb47?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
    price:9,
    description:"low in nutrition" ,
 
 },
 {
    title:"Tomatoes",
    image:"https://images.unsplash.com/photo-1524593166156-312f362cada0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
    price:9,
    description:"High in nutrition" ,
    
 },

]; 
function seedDb(){
    Product.remove({},function(err){
        if(err){
            console.log(err);
        }
        else{
            data.forEach(function(product){
                Product.create(product,function(err,product){
                    if(err){
                        console.log(err);
                    }
                    else{
                        product.save();
                    }
                });
            });
        }
        })
    }
   
module.exports=seedDb;