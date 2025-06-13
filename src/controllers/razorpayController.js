const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/razor"); // Assuming you have an Order model to update order details

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: "your-razorpay-key-id", // Replace with your Razorpay Key ID
  key_secret: "your-razorpay-key-secret", // Replace with your Razorpay Key Secret
});

// Create Razorpay Order
const createRazorpayOrder = async (req, res) => {
  try {
    const { total_price, currency = "INR" } = req.body; // Get price and currency from the request body

    const options = {
      amount: total_price * 100, // Razorpay expects amount in paise, hence multiplying by 100
      currency,
      receipt: `order_${Date.now()}`, // Unique receipt ID
    };

    // Create an order on Razorpay
    const order = await razorpayInstance.orders.create(options);

    if (!order) {
      return res.status(500).send({
        success: false,
        message: "Error creating Razorpay order",
      });
    }

    // Send the Razorpay order ID to the frontend
    res.status(200).send({
      success: true,
      message: "Order created successfully",
      orderId: order.id, // Razorpay order ID
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

// Capture Razorpay Payment
const capturePayment = async (req, res) => {
  try {
    const { paymentId, orderId } = req.body; // Get paymentId and orderId from the request body

    const { amount } = await razorpayInstance.orders.fetch(orderId); // Fetch the order amount

    // Verify the payment (Optional, but important for security)
    const razorpayPayment = await razorpayInstance.payments.fetch(paymentId);

    if (razorpayPayment.status !== "captured") {
      // If the payment status is not captured, do not process further
      return res.status(400).json({
        success: false,
        message: "Payment not captured",
      });
    }

    // Proceed to capture the payment if everything is correct
    await razorpayInstance.payments.capture(paymentId, amount); // Capture the payment

    // You can now update your order in the database to reflect the payment success
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).send({ success: false, message: "Order not found" });
    }

    // Update order status to 'Paid' or any other suitable status
    order.status = "Paid";
    await order.save();

    // Send success response
    res.status(200).json({
      success: true,
      message: "Payment captured successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Razorpay Webhook for Payment Verification
const razorpayWebhook = async (req, res) => {
  try {
    const secret = "your-webhook-secret"; // Replace with your webhook secret

    const receivedSignature = req.headers["x-razorpay-signature"];
    const payload = JSON.stringify(req.body);

    // Verify the webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    if (receivedSignature !== expectedSignature) {
      return res.status(400).send({ success: false, message: "Invalid signature" });
    }

    // Process the payment information (For example, updating the order)
    const { payment_id, order_id, event } = req.body;

    if (event === "payment.captured") {
      const payment = await razorpayInstance.payments.fetch(payment_id);

      // You can now handle the payment, like updating your order status
      const order = await Order.findById(order_id);
      if (order) {
        order.status = "Paid"; // Update the order status to "Paid"
        await order.save();
      }
    }

    res.status(200).send({ success: true, message: "Webhook received successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

// Refund Razorpay Payment
const refundPayment = async (req, res) => {
  try {
    const { paymentId } = req.body; // Get paymentId from the request body

    const refund = await razorpayInstance.payments.refund(paymentId);

    if (!refund) {
      return res.status(500).send({
        success: false,
        message: "Error processing refund",
      });
    }

    res.status(200).send({
      success: true,
      message: "Refund processed successfully",
      refund,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = {
  createRazorpayOrder,
  capturePayment,
  razorpayWebhook,
  refundPayment,
};
