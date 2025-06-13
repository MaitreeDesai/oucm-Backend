const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const Order = require("../models/order");
const Cart = require("../models/cart");
const User = require("../models/user");
const Product = require("../models/product");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "21bmiit019@gmail.com",
    pass: "hleq udvm xuox tpjk",
  },
});

// const addOrder = async (req, res) => {
//   try {
//     const user = await User.findById(req.body.user_id);
//     if (!user) {
//       throw new Error("User not found.");
//     }

//     const validStatuses = ["Pending", "Preparing", "Cancelled"];
//     const status = validStatuses.includes(req.body.status)
//       ? req.body.status
//       : "Pending";

//     const order = new Order({
//       user_id: req.body.user_id,
//       product_id: req.body.product_id,
//       canteen_name: req.body.canteen_name,
//       total_item: req.body.total_item,
//       total_price: req.body.total_price,
//       status: status,
//       phone: req.body.phone,
//       paymentMethod: req.body.paymentMethod,
//     });

//     const orderDetails = await order.save();

//     res.status(201).send({
//       success: true,
//       message: "Order information saved successfully.",
//       orderDetails,
//     });
//   } catch (error) {
//     res.status(400).send({ success: false, error: error.message });
//   }
// };

// const getOrder = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate("user_id", "email")
//       .populate("product_id", "food_name");

//     if (!orders.length) {
//       return res.status(404).send({ message: "No orders found." });
//     }

//     res.send({
//       orders,
//       message: "Orders fetched successfully.",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: error.message });
//   }
// };

const addOrder = async (req, res) => {
  try {
    const user = await User.findById(req.body.user_id);
    if (!user) {
      throw new Error("User not found.");
    }

   const validStatuses = ["Pending", "Preparing", "Cancelled"];
const status = validStatuses.includes(req.body.status)
  ? req.body.status
  : "Pending";

      const paymentMethod = "Cash";

    const order = new Order({
      user_id: req.body.user_id,
      product_id: req.body.product_id,
      canteen_name: req.body.canteen_name,
      total_item: req.body.total_item,
      total_price: req.body.total_price,
      status: status,
      phone: req.body.phone,
      paymentMethod: paymentMethod,
      enrollment_no: user.enrollment_no,
    });

    const orderDetails = await order.save();

    res.status(201).send({
      success: true,
      message: "Order information saved successfully.",
      orderDetails,
    });
  } catch (error) {
    res.status(400).send({ success: false, error: error.message });
  }
};

// const getOrder = async (req, res) => {
//   try {
//     const orders = await Order.find()
//     .populate("user_id", "email enrollment_no") // include enrollment_no here
//       .populate("product_id", "food_name");

//     if (!orders.length) {
//       return res.status(404).send({ message: "No orders found." });
//     }

//     res.send({
//       orders,
//       message: "Orders fetched successfully.",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: error.message });
//   }
// };
// const getOrder = async (req, res) => {
//   try {
//     // Get the logged-in user's ID from the request
//     const userId = req.user._id;

//     // Query for orders where the user_id matches the logged-in user's ID
//     const orders = await Order.find({ "user_id": userId })
//       .populate("user_id", "email enrollment_no")  // include email and enrollment_no
//       .populate("product_id", "food_name");  // include food_name from product_id

//     // If no orders found, return a 404 message
//     if (!orders.length) {
//       return res.status(404).send({ message: "No orders found for this user." });
//     }

//     // Send the found orders along with a success message
//     res.send({
//       orders,
//       message: "Orders fetched successfully.",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: error.message });
//   }
// };

const getOrder = async (req, res) => {
  try {
    // Check if req.user._id is available (authentication check)
    if (!req.user || !req.user._id) {
      return res.status(400).send({ message: "User not authenticated" });
    }

    // Get the logged-in user's ID from the request
    const userId = req.user._id;
    console.log("Authenticated User ID:", userId); // Log the user ID for debugging

    // Query for orders where the user_id matches the logged-in user's ID
    const orders = await Order.find({ "user_id": userId })
      .populate("user_id", "email enrollment_no")  // include email and enrollment_no
      .populate("product_id", "food_name");  // include food_name from product_id

    console.log("Orders fetched:", orders);  // Log the fetched orders for debugging

    // If no orders found, return a 404 message
    if (!orders || orders.length === 0) {
      return res.status(404).send({ message: "No orders found for this user." });
    }

    // Send the found orders along with a success message
    res.send({
      orders,
      message: "Orders fetched successfully.",
    });
  } catch (error) {
    console.error("Error fetching orders:", error);  // Log the error for debugging
    res.status(500).send({ error: error.message });
  }
};

const sendTokenEmail = async (req, res) => {
  try {
    const { product_id } = req.body; // Get product IDs from the request body

    if (!product_id || product_id.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No product IDs provided" });
    }

    // Fetch order details for all provided product IDs
    const orders = await Order.find({ product_id: { $in: product_id } })
      .populate("user_id", "email")
      .populate("product_id", "food_name");

    if (orders.length === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: "No orders found for the provided product IDs",
        });
    }

    // Iterate over each order to send email with numeric token and food name
    for (const order of orders) {
      // Generate a numeric token (e.g., 6-digit random number)
      const token = Math.floor(100000 + Math.random() * 900000);

      const mailOptions = {
        from: "21bmiit019@gmail.com",
        to: order.user_id.email,
        subject: "Order Pickup Token",
        text: `Hi, your order for ${order.product_id.food_name} is ready. Your pickup token is: ${token}`,
      };

      // Send the email with the generated token and food name
      await transporter.sendMail(mailOptions);
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Tokens sent to email for all provided products",
      });
  } catch (error) {
    console.error("Error sending email:", error); // Log detailed error
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeOrder = async (req, res) => {
  try {
    const { orderId } = req.query;
    const order = await Order.findById(orderId);

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    res
      .status(200)
      .json({ success: true, message: "Order removed from the view only" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOrderHistory = async (req, res) => {
  try {
    const userId = req.params.userId; // User ID from the route param
    const orders = await Order.find({ user_id: userId })
      .populate("user_id", "email") // Populate the user's email
      .populate("product_id", "food_name"); // Populate the product's name

    if (!orders.length) {
      return res.status(404).send({
        success: false,
        message: "No orders found for this user.",
      });
    }

    res.status(200).send({
      success: true,
      message: "Order history fetched successfully.",
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

// Controller
const getOrdersForCanteen = async (req, res) => {
  try {
    const canteenName = req.user.canteen_name; // Coming from auth middleware

    if (!canteenName) {
      return res.status(400).send({ message: "Canteen not found." });
    }

    const orders = await Order.find({ canteen_name: canteenName })
      .populate("user_id", "emaqil")
      .populate("product_id", "food_name");

    if (!orders.length) {
      return res
        .status(404)
        .send({ message: "No orders found for this canteen." });
    }

    res.send({
      orders,
      message: "Orders fetched successfully for the canteen.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  addOrder,
  getOrder,
  sendTokenEmail,
  removeOrder,
  getOrderHistory,
  getOrdersForCanteen,
};


// const nodemailer = require("nodemailer");
// const mongoose = require("mongoose");
// const Order = require("../models/order");
// const Cart = require("../models/cart");
// const User = require("../models/user");
// const Product = require("../models/product");

// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   auth: {
//     user: "21bmiit019@gmail.com",
//     pass: "abwf nifb bmuk tyrj",
//   },
// });

// const addOrder = async (req, res) => {
//   try {
//     const user = await User.findById(req.body.user_id);
//     if (!user) {
//       throw new Error("User not found.");
//     }

//     const validStatuses = ["Pending", "Preparing", "Cancelled"];
//     const status = validStatuses.includes(req.body.status)
//       ? req.body.status
//       : "Pending";

//     const order = new Order({
//       user_id: req.body.user_id,
//       product_id: req.body.product_id,
//       canteen_name: req.body.canteen_name,
//       total_item: req.body.total_item,
//       total_price: req.body.total_price,
//       status: status,
//       phone: req.body.phone,
//       paymentMethod: req.body.paymentMethod,
//     });

//     const orderDetails = await order.save();

//     res.status(201).send({
//       success: true,
//       message: "Order information saved successfully.",
//       orderDetails,
//     });
//   } catch (error) {
//     res.status(400).send({ success: false, error: error.message });
//   }
// };

// const getOrder = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate("user_id", "email")
//       .populate("product_id", "food_name");

//     if (!orders.length) {
//       return res.status(404).send({ message: "No orders found." });
//     }

//     res.send({
//       orders,
//       message: "Orders fetched successfully.",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: error.message });
//   }
// };

// const sendTokenEmail = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const order = await Order.findById(orderId)
//       .populate("user_id", "email")
//       .populate("product_id", "food_name");

//     if (!order)
//       return res
//         .status(404)
//         .json({ success: false, message: "Order not found" });

//     const mailOptions = {
//       from: "21bmiit019@gmail.com",
//       to: order.user_id.email,
//       subject: "Order Pickup Token",
//       text: `Hi, I am here to purchase my order. Food: ${order.product_id.food_name}`,
//     };

//     await transporter.sendMail(mailOptions);
//     res.status(200).json({ success: true, message: "Token sent to email" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const removeOrder = async (req, res) => {
//   try {
//     const { orderId } = req.query;
//     const order = await Order.findById(orderId);

//     if (!order)
//       return res
//         .status(404)
//         .json({ success: false, message: "Order not found" });

//     res
//       .status(200)
//       .json({ success: true, message: "Order removed from the view only" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const getOrderHistory = async (req, res) => {
//   try {
//     const userId = req.params.userId; // User ID from the route param
//     const orders = await Order.find({ user_id: userId })
//       .populate("user_id", "email") // Populate the user's email
//       .populate("product_id", "food_name"); // Populate the product's name

//     if (!orders.length) {
//       return res.status(404).send({
//         success: false,
//         message: "No orders found for this user.",
//       });
//     }

//     res.status(200).send({
//       success: true,
//       message: "Order history fetched successfully.",
//       orders,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ success: false, message: error.message });
//   }
// };


// module.exports = { 
//   addOrder, 
//   getOrder, 
//   sendTokenEmail, 
//   removeOrder,
//   getOrderHistory
//  };
