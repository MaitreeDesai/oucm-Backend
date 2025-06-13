const express = require("express");
const router = express.Router();
const {
  createRazorpayOrder,
  capturePayment,
  razorpayWebhook,
  refundPayment
} = require("./razorpayController"); // Assuming the previous file is named razorpayController.js

// Route to create an order on Razorpay
router.post("/create-order", createRazorpayOrder);

// Route to capture payment after successful payment
router.post("/capture-payment", capturePayment);

// Route to handle Razorpay webhook for payment status updates
router.post("/webhook", razorpayWebhook);

// Route to process payment refund
router.post("/refund", refundPayment);

module.exports = router;
