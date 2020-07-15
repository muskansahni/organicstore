var express=require("express");
var app= express();
var bodyParser=require("body-parser");
var mongoose= require("mongoose");
var Product= require("./models/product");
var Cart=require("./models/cart");
var User= require("./models/user");
const seedDb = require("./seeds");
var passport= require("passport");
var localStrategy=require("passport-local");
var session=require("express-session");
const MongoStore = require('connect-mongo')(session);
mongoose.connect("mongodb+srv://Muskansahni18:Muskansahni18@cluster0.plgj1.mongodb.net/store?retryWrites=true&w=majority", { dbName: "store" })
  .then( () => {
    console.log('Connection to the Atlas Cluster is successful!')
  })
  .catch( (err) => console.error(err));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
seedDb();
app.use(session({
    secret:"better day",
    resave:false,
    saveUninitialized:false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie:{maxAge:180*60*1000}

}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.session=req.session;
    next();
})
app.get("/",function(req,res){
    res.render("landing");
})
app.get("/products",function(req,res){
    Product.find({},function(err,product){
        if(err){
            console.log(err);
        }
        else{
            res.render("product",{product:product});
        }
    })
    
});
//cart routes

app.get("/cart/:id",function(req,res){
    var productid=req.params.id;
    var cart= new Cart(req.session.cart ?req.session.cart : {});
    Product.findById(productid,function(err,product){
        if(err){
            console.log(err);
        }
        else{
            cart.add(product,product.id);
            req.session.cart=cart;
            console.log(cart);
            res.redirect("/products");

        }
    })
});
app.get("/cart",function(req,res){
    if(!req.session.cart){
       return res.render("cart",{product:null});
    }
    else{
        var cart=new Cart(req.session.cart);
        res.render("cart",{product:cart.generatearr(),quantity:cart.totalqty,total:cart.totalprice});
    }
    });
// auth routes
app.get("/signup",function(req,res){
res.render("register");
});
app.post("/signup",function(req,res){
var newuser= new User({username:req.body.username});
User.register(newuser,req.body.password,function(err,user){
    if(err){
        res.redirect("back");
    }
    else{
        passport.authenticate("locals")(req,res,function(){
            res.redirect("/products");
        });
    }
});
});
app.get("/login",function(req,res){
    res.render("login");
});
app.post("/login",passport.authenticate("local",{
    successRedirect:"/products",
    failureRedirect:"/login"
}),
function(req,res){

});
app.get("/logout",function(req,res){
    req.logOut();
    res.redirect("/products");
});
app.listen(3000,function(){
    console.log(" store server started");
})