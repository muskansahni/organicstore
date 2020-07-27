var express=require("express");
var app= express();
var bodyParser=require("body-parser");
var mongoose= require("mongoose");
var Product= require("./models/product");
var Cart=require("./models/cart");
var Order=require("./models/order");
var User= require("./models/user");
const seedDb = require("./seeds");
var passport= require("passport");
var cookieParser = require('cookie-parser');
var localStrategy=require("passport-local");
var session=require("express-session");
const user = require("./models/user");
const MongoStore = require('connect-mongo')(session);
const swal = require('sweetalert2');
var $ = require( "jquery" );
mongoose.connect("mongodb+srv://Muskansahni18:Muskansahni18@cluster0.plgj1.mongodb.net/store?retryWrites=true&w=majority", { dbName: "store" })
  .then( () => {
    console.log('Connection to the Atlas Cluster is successful!')
  })
  .catch( (err) => console.error(err));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
seedDb();
app.use(cookieParser('foo'));
app.use(session({
    secret:'foo',
    resave:false,
    saveUninitialized:false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
   
  

}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.session=req.session;
    res.locals.cart=req.session.cart?req.session.cart :{};
   

    next();
})
app.get("/",function(req,res){
    res.render("landing");
})
app.get("/products",function(req,res){
    if(req.query.search){
        const regex= new RegExp(escapeRegex(req.query.search),'gi');
        Product.find({title:regex},function(err,foundproduct){
            if(err){
                console.log(err);
            }
            else{
                res.render("product",{product:foundproduct});
            }
        })
    }
    else{
        Product.find({},function(err,product){
            if(err){
                console.log(err);
            }
            else{
                res.render("product",{product:product});
            }
        })
    }
    
    
});
//cart routes

app.get("/cart/:id",isloggedin,function(req,res){
    var productid=req.params.id;
    var cart= new Cart(req.session.cart ?req.session.cart : {});
    Product.findById(productid,function(err,product){
        if(err){
            console.log(err);
        }
        else{
            cart.add(product,product.id);
            req.session.cart=cart;
           
            res.redirect("/products");

        }
    })
});
app.get("/cart",isloggedin,function(req,res){
    if(!req.session.cart){
       return res.render("cart",{product:null});
    }
    else{
        var cart=new Cart(req.session.cart);
        res.render("cart",{product:cart.generatearr(),quantity:cart.totalqty,total:cart.totalprice});
    }
    });
    app.get("/reduce/:id",function(req,res){
        var cart=new Cart(req.session.cart?req.session.cart:{});
        cart.reduceitem(req.params.id);
        req.session.cart=cart;
        res.redirect("/cart");
    });
    app.get("/remove/:id",function(req,res){
        var cart=new Cart(req.session.cart?req.session.cart:{});
        cart.removeall(req.params.id);
        req.session.cart=cart;
        res.redirect("/cart");
    });
    
    app.get("/order",isloggedin,function(req,res){
        var cart= new Cart(req.session.cart ?req.session.cart : {});
    res.render("order",{cart:cart});
    });
    app.post("/order",isloggedin,function(req,res){
       var cart= new Cart(req.session.cart);
        var order= new Order({
           user:req.user,
           name:req.body.name,
           address:req.body.address,
           cart:cart,
           total:cart.totalprice,
          
});

order.save(function(err,order){
    if(err){
        res.redirect("back");
    }
    else{
        req.session.cart=null;
        res.redirect("/cart");
        }
  
});
        
    });
    app.get("/profile",isloggedin,function(req,res){
        Order.find({user:req.user},function(err,order){
            if(err){
                res.redirect("back");
            }
            else{
             var cart;
             order.forEach(function(order){
                 cart= new Cart(order.cart);
                  order.items=cart.generatearr();
                
                 

             });
             res.render("show",{order:order});
             
            
            }
        })
        
    });
// auth routes
app.get("/signup",function(req,res){
res.render("register");
});
app.post("/signup",function(req,res){
var newuser= new User({username:req.body.username});
User.register(newuser,req.body.password,function(err,user){
    if(err){
        return res.redirect("/");
    }
   
        passport.authenticate("local")(req,res,function(){
            res.redirect("/products");
        });
   
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
   req.logout();
   res.redirect('/products');
    
   
});
function isloggedin(req,res,next){
    if(req.isAuthenticated()){
       return next();
    }
    res.redirect("/login");
    
}
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
app.listen(3000,function(){
    console.log(" store server started");
})