// const express = require("express");
// const router = express.Router();
// const { addOrder, getOrder, sendTokenEmail, removeOrder, getOrderHistory } = require("../controllers/ordercontroller");
// const auth = require("../middleware/auth");

// router.post("/order", addOrder);
// router.get("/getOrder", auth, getOrder);
// router.post("/sendToken/:orderId", auth, sendTokenEmail);
// router.delete("/removeOrder", auth, removeOrder);

// router.get("/orderHistory/:userId", getOrderHistory);


// module.exports = router;


const express = require("express");
const router = express.Router();
const orderController = require("../controllers/ordercontroller");
const { addOrder, getOrder, sendTokenEmail, removeOrder, getOrderHistory, getOrdersForCanteen} = require("../controllers/ordercontroller");
const auth = require("../middleware/auth");


router.post("/order", addOrder);

router.get("/getOrder", auth, getOrder);

//router.post("/sendToken/:orderId", auth, sendTokenEmail);

router.delete("/removeOrder", auth, removeOrder);

router.get("/orderHistory/:userId", getOrderHistory);

router.get("/getOrdersForCanteen", auth, getOrdersForCanteen);
  
router.post("/sendTokenForMultipleProducts", orderController.sendTokenEmail);

module.exports = router;
