const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 3001;
const { User } = require("./models/user");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, "./public");
  },
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

var Product = require("./models/product");
var Cart = require("./models/cart");
var Order = require("./models/order");
const JWT_SECRET = "JWT-SECRET";

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

const getUser = async (req, res, next) => {
  const foodCookie = req.cookies["FoodAuth"];
  if (!foodCookie) {
    return res.json({ status: false });
  }
  try {
    const user = jwt.verify(foodCookie, JWT_SECRET);
    if (!user) {
      return res.json({ status: false });
    }
    const curUser = await User.findById(user.id);
    if (!curUser) {
      return res.json({ status: false });
    } else {
      req.user = curUser;
      next();
    }
  } catch (e) {
    return res.json({ status: false });
  }
};

app.get("/getprevorders", getUser, async (req, res) => {
  const products = await Order.find({ user: req.user._id }).sort({createdAt: "desc"}).exec();
  // console.log(products);
  return res.json({ status: true, products });
});

app.get("/getuserdets", getUser, async (req, res) => {
  return res.json({ status: true, user: req.user });
});

app.post("/checkout", getUser, async (req, res) => {
  var cart = new Cart(req.body.currcart);

  var order = await new Order({
    user: req.user._id,
    cart: cart,
    address: req.body.curaddress,
    name: req.user.name,
    paymentId: "PAID",
    date: getdatestr(),
    time: gettimestr(),
    preparing: true,
    ontheway: false,
    delivered: false,
  });

  await order.save(function (err, result) {
    if (err) {
      console.log(err);
      return res.redirect("/");
    } else console.log("done");
  });

  return res.json({ status: true });
});

app.get("/allOrders", getUser, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(401).json({ isAdmin: false });
  }
  const orders = await Order.find();
  return res.json({ isAdmin: true, orders });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user == null) {
    return res.json({ status: false, id: -1, message: "Not found" });
  }
  if (!user.validPassword(password)) {
    return res.json({ status: false, id: -1, message: "Wrong password" });
  }
  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    "JWT-SECRET",
    {
      expiresIn: "1 day",
    }
  );
  res.cookie("FoodAuth", token, { maxAge: 86400 * 1000, httpOnly: true });
  return res.json({ status: true, id: user._id, message: "Success" });
});

app.options("/register", cors());

app.post("/register", async (req, res) => {
  // console.log(req.body);
  const user = new User({
    email: req.body.email,
    name: req.body.name,
    city: req.body.city,
    state: req.body.state,
  });
  user.password = user.encryptPassword(req.body.password);
  // console.log(user);
  await user.save();
  return res.json({ status: true });
});

app.get("/checkauth", async (req, res) => {
  const foodCookie = req.cookies["FoodAuth"];
  if (!foodCookie) {
    return res.json({ status: false, isAdmin: false, id: -1 });
  }
  try {
    const user = jwt.verify(foodCookie, "JWT-SECRET");
    if (user) {
      // console.log(user.isAdmin);
      // console.log(user);
      return res.json({ status: true, isAdmin: user.isAdmin, id: user.id });
    } else {
      return res.json({ status: false, isAdmin: false, id: -1 });
    }
  } catch (e) {
    return res.json({ status: false, isAdmin: false, id: -1 });
  }
});

app.get("/getproducts", async (req, res) => {
  const products = await Product.find().sort({ createdAt: "asc" }).exec();
  return res.json({ status: true, products });
});

app.get("/getinfo/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  return res.json({ status: true, product });
});

app.get("/logout", async (_req, res) => {
  res.cookie("FoodAuth", "", { maxAge: -1 });
  return res.json({ status: true });
});

app.post("/changestatus", async (req, res) => {
  // console.log( req.body.id);
  try {
    await Order.findOneAndUpdate(
      { _id: req.body.id },
      {
        preparing: req.body.status == "prep",
        ontheway: req.body.status == "on",
        delivered: req.body.status == "del",
      }
    );
    return res.json({ status: true });
  } catch (_e) {
    return res.json({ status: false });
  }
});

const checkAdmin = async (req, res, next) => {
  const foodCookie = req.cookies["FoodAuth"];
  if (!foodCookie) {
    return res.json({ status: false });
  }
  try {
    const user = jwt.verify(foodCookie, JWT_SECRET);
    if (!user) {
      return res.json({ status: false });
    }
    const curUser = await User.findById(user.id);
    if (!curUser) {
      return res.json({ status: false });
    } else {
      if (!curUser.isAdmin) {
        return res.json({ status: false });
      }
      req.user = curUser;
      next();
    }
  } catch (e) {
    return res.json({ status: false });
  }
};

app.post(
  "/imageupload",
  [checkAdmin, upload.single("file")],
  async (req, res) => {
    const file = req.file;
    // console.log(file);
    const { title, description, price, category } = req.body;
    await Product.create({
      imagePath: `http://localhost:3001/${file.filename}`,
      title,
      description,
      price,
      category,
    });
    return res.json({ status: true });
  }
);

//functions
function getdatestr() {
  var today = new Date();
  var dd = today.getDate();

  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = "0" + dd;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }

  today = dd + "/" + mm + "/" + yyyy;
  return today;
}

function gettimestr() {
  var d = new Date(),
    h = (d.getHours() < 10 ? "0" : "") + d.getHours(),
    m = (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
  return h + ":" + m;
}
//

app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
