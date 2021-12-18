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
  new Product({
    imagePath:
      "https://www.dominos.co.in/files/items/mirinda.jpg",
    title: "MIRANDA",
    description:
      "Feel the refreshed from tangy oranges that explode in your taste buds!",
    price: 100,
    category: "Drinks",
  }),



  new Product({
    imagePath:
      "https://www.dominos.co.in/files/items/7up.jpg",
    title: "7UP",
    description:
      "Spice it up with 7up !",
    price: 100,
    category: "Drinks",
  }),

  new Product({
    imagePath:
      "https://thumbs.dreamstime.com/b/huettenberg-germany-june-three-aluminium-cans-lipton-ice-tea-isolated-over-white-background-lipton-ice-tea-cans-120804303.jpg",
    title: "LIPTON ICE TEA",
    description:
      "Beat the heat with some Lipton iced tea !",
    price: 100,
    category: "Drinks",
  }),


  new Product({
    imagePath:
      "https://www.dominos.co.in/files/items/pepsi_black.png",
    title: "PEPSI",
    description:
      "Kick the stress out with some pepsi !",
    price: 120,
    category: "Drinks",
  }),



  new Product({
    imagePath:
      "https://www.mcdonalds.com/is/image/content/dam/usa/nfl/nutrition/items/iconic/desktop/t-mcdonalds-Vanilla-McCafe-Shake-Medium.jpg",
    title: "VANILLA SHAKE",
    description:
      "Taste happiness served in a glass...from a wide variety of flavours !",
    price: 130,
    category: "Drinks",
  }),



  new Product({
    imagePath:
      "https://www.dominos.co.in/files/items/170046_BMC_image_for_Website_272X272.jpg",
    title: "BUTTERSCOTCH MOUSSE CAKE",
    description:
      "A Creamy & Chocolaty indulgence with layers of rich, fluffy Butterscotch Cream and delicious Dark Chocolate Cake !",
    price: 235,
    category: "Desserts",
  }),

  new Product({
    imagePath:
      "https://www.mcdonalds.com/is/image/content/dam/usa/nfl/nutrition/items/hero/desktop/t-mcdonalds-Hot-Fudge-Sundae.jpg",
    title: "HOT FUDGE SUNDAE",
    description:
      "Hot fudge sundae is made with creamy vanilla soft serve and smothered in chocolaty hot fudge topping.",
    price: 223,
    category: "Desserts",
  }),

  new Product({
    imagePath:
      "https://www.mcdonalds.com/is/image/content/dam/usa/nfl/nutrition/items/hero/desktop/t-mm-mcflurry-snack.jpg",
    title: "M&M FLURRY",
    description:
      "M&M Flurry is a sweet, creamy M&M’S® dessert of vanilla soft serve with M&M’S® chocolate candies swirled in.",
    price: 223,
    category: "Desserts",
  }),

  new Product({
    imagePath:
      "https://www.mcdonalds.com/is/image/content/dam/usa/nfl/nutrition/items/hero/desktop/t-mcdonalds-Hot-Caramel-Sundae.jpg?$Product_Desktop$",
    title: "HOT CARAMEL SUNDAE",
    description:
      "This Caramel Sundae combines creamy vanilla soft serve and warm, buttery caramel topping",
    price: 253,
    category: "Desserts",
  }),

  new Product({
    imagePath:
      "https://www.mcdonalds.com/is/image/content/dam/usa/nfl/nutrition/items/hero/desktop/t-mcdonalds-Chocolate-Chip-Cookie.jpg",
    title: "CHOCOLATE CHIP COOKIE",
    description:
      "Classic chocolate chip cookie, loaded with chocolate chips",
    price: 223,
    category: "Desserts",
  }),



  new Product({
    imagePath:
      "https://www.mcdonalds.com/is/image/content/dam/usa/nfl/nutrition/items/hero/desktop/t-mcdonalds-Apple-Slices.jpg",
    title: "APPLE SLICES",
    description:
      " Apple Slices are a wholesome, tasty side made from juicy and crispy apples !",
    price: 223,
    category: "Sides",
  }),


  new Product({
    imagePath:
      "https://www.mcdonalds.com/is/image/content/dam/usa/nfl/nutrition/items/hero/desktop/t-mcdonalds-Sausage-McMuffin.jpg",
    title: "MINI SAUSAGE MUFFIN",
    description:
      "This muffin features a warm, freshly toasted English muffin, topped with a savory hot sausage patty and a slice of melted cheese. ",
    price: 223,
    category: "Sides",
  }),


  new Product({
    imagePath:
      "https://www.mcdonalds.com/is/image/content/dam/usa/nfl/nutrition/items/regular/desktop/t-mcdonalds-HASH-BROWNS.jpg",
    title: "MINI HASH BROWNS",
    description:
      "These shredded potato hash brown patties are prepared so they’re fluffy on the inside and crispy and toasty on the outside",
    price: 223,
    category: "Sides",
  }),


  new Product({
    imagePath:
      "https://www.mcdonalds.com/is/image/content/dam/usa/nfl/nutrition/items/regular/desktop/t-mcdonalds-Sausage-Biscuit-Regular-Size-Biscuit.jpg",
    title: "MINI SAUSAGE BISCUIT",
    description:
      " Sausage Biscuit is the perfect sausage sandwich, made with sizzling hot sausage on a warm buttermilk biscuit that’s topped with real butter",
    price: 223,
    category: "Sides",
  }),


  new Product({imagePath:
      "https://www.mcdonalds.com/is/image/content/dam/usa/nfl/nutrition/items/hero/desktop/t-mcdonalds-Bacon-Egg-Cheese-McGriddles.jpg",
    title: "MINI EGG CHEESE SANDWICH",
    description:
      "Contains soft, warm ,fluffy and folded egg with a slice of melted cheese",
    price: 223,
    category: "Sides",
  }),
];

(async () => {
  for (const product of products) {
    await new Product(product).save();
  }
})();
