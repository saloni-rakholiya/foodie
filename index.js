
const express = require("express");
const mongoose=require("mongoose");
const app = express();
const PORT = 3000;
const session=require("express-session");
const bodyParser = require("body-parser");
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");

var Product = require('./models/product');
var Cart = require('./models/cart');
var Order = require('./models/order');

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret:"some long string,",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/shoppin",{useNewUrlParser:true});
// mongoose.set('useCreateIndex', true);

//seed
var products = [
  new Product({
    imagePath: 'https://www.dominos.co.in/files/items/Double_Cheese_Margherita.jpg',
    title: 'DOUBLE CHEESE MARGHERITA',
    description: 'The ever-popular Margherita - loaded with extra cheese... oodies of it!',
    price: 269,
    category: 'Veg Pizza'
  }),
  new Product({
    imagePath: 'https://www.dominos.co.in/files/items/Peppy_Paneer.jpg',
    title: 'PEPPY PANEER',
    description: 'Chunky paneer with crisp capsicum and spicy red pepper - quite a mouthful!',
    price: 209,
    category: 'BestSeller'
  }),
  new Product({
    imagePath: 'https://www.dominos.co.in/files/items/Paneer_Makhni.jpg',
    title: "PANEER MAKHANI",
    description: "Paneer and Capsicum on Makhani Sauce",
    price: 99
  })
];


// var done = 0;
// for (var i = 0; i < products.length; i++) {
//   products[i].save(function(err, result) {
//     if(err) return console.error(err);
//     console.log("Added entry successfully");
//   });
// }
//seed end


var userSchema=new mongoose.Schema({
    username: String,
    password: String,
    name: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
});

userSchema.plugin(passportLocalMongoose);

const User=mongoose.model("User",userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/", (req, res) => {
    res.redirect("/welcome");
});

app.get("/welcome", (req, res) => {
    res.render("welcome.ejs");
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.post('/login',(req,res)=>{
    const user=new User({
        username:req.body.username,
        password:req.body.password
    });

    req.login(user, (err)=>{
        if(err){
            console.log(err);
            res.redirect("/login");
        }
        else {
            passport.authenticate("local")(req,res,()=>{
                res.redirect("home");
            });
        }

    });
});


app.get("/logout",(req,res)=>{
    req.logout();
    res.redirect('welcome');
});

app.get("/register", (req, res) => {
    res.render("register.ejs");
});

app.get("/history", (req, res) => {
    res.render("history.ejs");
});

app.get("/about", (req, res) => {
    res.render("about.ejs");
});

app.get("/cart", (req, res) => {
    res.render("cart.ejs");
});

app.get("/contact", (req, res) => {
    res.render("contact.ejs");
});

app.post('/register',(req,res)=>{
    User.register({username: req.body.username, name:  "heheh", city: "longon" , state: "gujarat" }, req.body.password, (err,user)=>{
        if(err) {
            console.log(err);
            res.redirect("/register");
        }
        else {
            passport.authenticate("local")(req,res,()=>{
                res.redirect("home");
            });
        }
    });
});

app.get("/secret", (req,res)=>{
    if(req.isAuthenticated()){
        res.send("Secrets yay!");
    }
    else {
        res.redirect('/login');
    }
});

app.get('/profile', async (req, res, next) => {
    try {
    const orders = await Order.find({
      user: req.user
    });
    console.log(req.user);
    let cart;
      orders.forEach(function(order) {
        cart = new Cart(order.cart);
        order.items = cart.generateArray();
      });
      res.render('user/profile', {
        orders: orders,
        user: req.user
      });
    }
    catch(err) {
        res.write("Error!")
    }
      
      
  });

app.get("/home", async (req, res) => {
  var productChunks = {};
  var successMsg=1;

  const categories = await Product.distinct('category');
  for(const category of categories) {
    productChunks[category] = [];
    products = await Product.find({category});
    for(const product of products) {
      productChunks[category].push(product)
    }
  }
    res.render('home.ejs', {
      title: 'Food Ordering System',
      products: productChunks,
      successMsg: successMsg,
      noMessages: !successMsg
    });
  });



// app.get('/add-to-cart/:id', function(req, res, next) {
//   var productId = req.params.id;
//   var cart = new Cart(req.session.cart ? req.session.cart : {});

//   Product.findById(productId, function(err, product) {
//     if (err) {
//       return res.redirect('/');
//     }
//     cart.add(product, product.id);
//     req.session.cart = cart;
//     res.redirect('/');
//   });
// });  


app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
});
