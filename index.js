const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 3000;
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

var Product = require("./models/product");
var Cart = require("./models/cart");
var Order = require("./models/order");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "some long string,",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/shoppin", {
  useNewUrlParser: true,
});
// mongoose.set('useCreateIndex', true);

//seed
var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  cart: { type: Object, required: true },
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());
// passport.serializeUser((req, user, done) => {
//   console.log("ser");
//   console.log(req.cart);
//   if (req.cart == undefined) {
//     console.log("m");
//     done(null, user.id);
//   } else {
//     done(null, { id: user.id, cart: req.cart });
//   }
// });
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.session.cart == undefined) {
      req.session.cart = new Cart({});
    }
    next();
  } else {
    res.redirect("/login");
  }
};

const authRouter = express.Router();
authRouter.use(isLoggedIn);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.redirect("/welcome");
});

app.get("/welcome", (req, res) => {
  res.render("welcome.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, (err) => {
    if (err) {
      console.log(err);
      res.redirect("/login");
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/auth/home");
      });
    }
  });
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("welcome");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/history", (req, res) => {
  res.render("history.ejs");
});

authRouter.get("/about", (req, res) => {
  res.render("about.ejs");
});

authRouter.get("/cart", (req, res) => {
  res.render("cart.ejs");
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

app.post("/register", (req, res) => {
  User.register(
    {
      username: req.body.username,
      name: "heheh",
      city: "longon",
      state: "gujarat",
      cart: new Cart({}),
    },
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/auth/home");
        });
      }
    }
  );
});

app.get("/secret", (req, res) => {
  if (req.isAuthenticated()) {
    res.send("Secrets yay!");
  } else {
    res.redirect("/login");
  }
});

authRouter.get("/profile", async (req, res, next) => {
  try {
    const orders = await Order.find({
      user: req.user,
    });
    console.log(req.user);
    let cart;
    orders.forEach(function (order) {
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    res.render("user/profile", {
      orders: orders,
      user: req.user,
    });
  } catch (err) {
    res.write("Error!");
  }
});

authRouter.get("/home", async (req, res) => {
  var productChunks = {};
  var successMsg = 1;

  const categories = await Product.distinct("category");
  for (const category of categories) {
    productChunks[category] = [];
    products = await Product.find({ category });
    for (const product of products) {
      productChunks[category].push(product);
    }
  }
  res.render("home.ejs", {
    title: "Food Ordering System",
    products: productChunks,
    successMsg: successMsg,
    noMessages: !successMsg,
  });
});

authRouter.post("/add-to-cart", async (req, res) => {
  const id = req.body.foodId;
  console.log(id);
  if (id == undefined) {
    return res.json({ status: false });
  }
  const product = await Product.findById(id);
  // console.log(product);
  const cart = req.session.cart;
  var storedItem = cart.items[id];
  if (!storedItem) {
    storedItem = cart.items[id] = { item: product, qty: 0, price: 0 };
  }
  storedItem.qty++;
  storedItem.price = storedItem.item.price * storedItem.qty;
  cart.totalQty++;
  cart.totalPrice += storedItem.item.price;
  console.log(req.session);
  return res.json({ status: true });
});

app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});