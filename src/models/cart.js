const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  canteen_name: {
    type: String,
    required: true,
  },
  food_name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
   // required: true,
  },
  product_qty: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
