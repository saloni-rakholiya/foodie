const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/shoppin", {
  useNewUrlParser: true,
});
const Product = require("./models/product");
const products = [
  new Product({
    imagePath:
      "https://www.dominos.co.in/files/items/Double_Cheese_Margherita.jpg",
    title: "DOUBLE CHEESE MARGHERITA",
    description:
      "The ever-popular Margherita - loaded with extra cheese... oodies of it!",
    price: 269,
    category: "Veg Pizza",
  }),
  new Product({
    imagePath: "https://www.dominos.co.in/files/items/Peppy_Paneer.jpg",
    title: "PEPPY PANEER",
    description:
      "Chunky paneer with crisp capsicum and spicy red pepper - quite a mouthful!",
    price: 209,
    category: "BestSeller",
  }),
  new Product({
    imagePath: "https://www.dominos.co.in/files/items/Paneer_Makhni.jpg",
    title: "PANEER MAKHANI",
    description: "Paneer and Capsicum on Makhani Sauce",
    price: 99,
  }),
];

(async () => {
  for (const product of products) {
    await new Product(product).save();
  }
})();
