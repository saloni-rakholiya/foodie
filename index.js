const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 3001;
const { User } = require("./models/user");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");

var Product = require("./models/product");
var Cart = require("./models/cart");
var Order = require("./models/order");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: function (origin, callback) {
      callback(null, origin);
    },
    credentials: true,
    // allowedHeaders: ['Authorization']
  })
);
app.use(cookieParser());

mongoose.connect("mongodb://localhost:27017/shoppin", {
  useNewUrlParser: true,
});
// mongoose.set("useCreateIndex", true);

// app.get("/", (req, res) => {
//   res.redirect("/welcome");
// });

// app.get("/welcome", (req, res) => {
//   res.render("welcome.ejs");
// });

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user == null) {
    return res.json({ status: false, message: "Not found" });
  }
  if (!user.validPassword(password)) {
    return res.json({ status: false, message: "Wrong password" });
  }
  const token = jwt.sign({ id: user._id }, "JWT-SECRET");
  res.cookie("FoodAuth", token, { maxAge: 86400, httpOnly: true });
  return res.json({ status: true, message: "Success" });
});

// app.get("/logout", (req, res) => {
//   req.logout();
//   res.redirect("welcome");
// });

// app.get("/register", (req, res) => {
//   res.render("register.ejs");
// });

// app.get("/history", (req, res) => {
//   res.render("history.ejs");
// });

// authRouter.get("/about", (req, res) => {
//   res.render("about.ejs");
// });

// authRouter.get("/cart", (req, res) => {
//   res.render("cart.ejs");
// });

// app.get("/contact", (req, res) => {
//   res.render("contact.ejs");
// });

app.options("/register", cors());

app.post("/register", async (req, res) => {
  console.log(req.body);
  const user = new User({
    email: req.body.email,
    name: req.body.name,
    city: req.body.city,
    state: req.body.state,
  });
  user.password = user.encryptPassword(req.body.password);
  console.log(user);
  await user.save();
  return res.json({ status: true });
});

app.options("/checkauth");

app.get("/checkauth", async (req, res) => {
  const foodCookie = req.cookies["FoodAuth"];
  if (!foodCookie) {
    return res.json({ status: false });
  }
  if (jwt.verify(foodCookie, "JWT-SECRET")) {
    return res.json({ status: true });
  }
  return res.json({ status: false });
});

// app.get("/secret", (req, res) => {
//   if (req.isAuthenticated()) {
//     res.send("Secrets yay!");
//   } else {
//     res.redirect("/login");
//   }
// });

// authRouter.get("/profile", async (req, res, next) => {
//   try {
//     const orders = await Order.find({
//       user: req.user,
//     });
//     console.log(req.user);
//     let cart;
//     orders.forEach(function (order) {
//       cart = new Cart(order.cart);
//       order.items = cart.generateArray();
//     });
//     res.render("user/profile", {
//       orders: orders,
//       user: req.user,
//     });
//   } catch (err) {
//     res.write("Error!");
//   }
// });

// authRouter.get("/home", async (req, res) => {
//   var productChunks = {};
//   var successMsg = 1;

//   const categories = await Product.distinct("category");
//   for (const category of categories) {
//     productChunks[category] = [];
//     products = await Product.find({ category });
//     for (const product of products) {
//       productChunks[category].push(product);
//     }
//   }
//   res.render("home.ejs", {
//     title: "Food Ordering System",
//     products: productChunks,
//     successMsg: successMsg,
//     noMessages: !successMsg,
//     cart: req.session.cart,
//   });
// });

// authRouter.post("/add-to-cart", async (req, res) => {
//   const id = req.body.foodId;
//   console.log(id);
//   if (id == undefined) {
//     return res.json({ status: false });
//   }
//   const product = await Product.findById(id);
//   const cart = req.session.cart;
//   var storedItem = cart.items[id];
//   if (!storedItem) {
//     storedItem = cart.items[id] = { item: product, qty: 0, price: 0 };
//   }
//   storedItem.qty++;
//   storedItem.price = storedItem.item.price * storedItem.qty;
//   cart.totalQty++;
//   cart.totalPrice += storedItem.item.price;
//   return res.json({ status: true });
// });

app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
