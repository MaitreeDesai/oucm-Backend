const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { createProduct, listProduct, searchProduct, deleteProduct, updateProduct, getAllCanteens, getProductsByCanteen} = require("../controllers/productcontroller");

router.post('/product', auth, createProduct);
router.get('/listProduct', listProduct);
router.get("/Canteens", getAllCanteens); 

router.delete('/deleteProduct/:product_id', deleteProduct); 
router.put('/updateProduct/:product_id', updateProduct);

router.get('/search', searchProduct); 

router.get('/products/canteen/:canteen_name', getProductsByCanteen);

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/auth");

// const { createProduct, listProduct, searchProduct, deleteProduct, updateProduct, getAllCanteens, getProductsByCanteen} = require("../controllers/productcontroller");

// router.post('/product', auth, createProduct);
// router.get('/listProduct', listProduct);
// router.get("/Canteens", getAllCanteens); 

// router.delete('/deleteProduct/:product_id', deleteProduct); 
// router.put('/updateProduct/:product_id', updateProduct);

// router.get('/search', searchProduct); 

// router.get('/products/canteen/:canteen_name', getProductsByCanteen);

// module.exports = router;