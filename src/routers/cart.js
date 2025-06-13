const express = require("express");
const router = express.Router();

const { addToCart , getCart, updateCart, deleteCartItem, getAllCarts, deleteAllCarts} = require("../controllers/cartcontroller");
const auth = require("../middleware/auth");

router.post('/addToCart',auth, addToCart);
router.get('/getCart',auth, getCart);
router.put('/updateCart',auth,updateCart);
router.delete("/cart/:product_id", auth, deleteCartItem);

router.get("/all-carts", getAllCarts);
router.delete("/all-carts", deleteAllCarts);


module.exports = router;

// const express = require("express");
// const router = express.Router();

// const { addToCart , getCart, updateCart, deleteCartItem} = require("../controllers/cartcontroller");
// const auth = require("../middleware/auth");

// router.post('/addToCart',auth, addToCart);
// router.get('/getCart',auth, getCart);
// router.put('/updateCart',auth,updateCart);
// router.delete("/cart/:product_id", auth, deleteCartItem);

// module.exports = router;

// const express = require("express");
// const router = express.Router();

// const { addToCart , getCart, updateCart} = require("../controllers/cartcontroller");
// const auth = require("../middleware/auth");

// router.post('/addToCart',auth, addToCart);
// router.get('/getCart',auth, getCart);
// router.post('/updateCart',auth,updateCart);

// module.exports = router;