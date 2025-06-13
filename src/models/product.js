const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  canteen_name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  food_name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema({
//   canteen_name: {
//     type: String,
//     required: true,
//   },
//   image: {
//     type: String,
//     required: true,
//   },
//   food_name: {
//     type: String,
//     required: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//   },
//   user_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
// });

// const Product = mongoose.model("Product", productSchema);

// module.exports = Product;