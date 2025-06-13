const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
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
    total_item: {
      type: Number,
      required: true,
    },
    total_price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Preparing", "Cancelled", "Ready"], 
      default: "Pending",
    },
    phone: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
    },
    paymentMethod: {
      type: String,
      enum: ["Cash"],
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;


// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema(
//   {
//     user_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     product_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Product",
//       required: true,
//     },
//     canteen_name: {
//       type: String,
//       required: true,
//     },
//     total_item: {
//       type: Number,
//       required: true,
//     },
//     total_price: {
//       type: Number,
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ["Pending", "Preparing", "Cancelled"],
//       default: "Pending",
//     },
//     phone: {
//       type: String,
//       required: true,
//       match: /^[0-9]{10}$/,
//     },
//     paymentMethod: {
//       type: String,
//       enum: ["Online", "Cash"],
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// const Order = mongoose.model("Order", orderSchema);

// module.exports = Order;
