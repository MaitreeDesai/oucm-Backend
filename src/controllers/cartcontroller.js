const Cart = require("../models/cart");
const Product = require("../models/product");

const addToCart = async (req, res) => {
  try {
    const user_id = req.user?._id;
    const { product_id, product_qty, price, canteen_name, food_name, image} =
      req.body;

    const productExists = await Product.findById(product_id);
    if (!productExists) {
      return res.status(404).send({ message: "Product not found." });
    }

    const existingItem = await Cart.findOne({ user_id, product_id });
    if (existingItem) {
      existingItem.product_qty += product_qty;
      await existingItem.save();
      return res.status(200).send({
        message: "Product quantity updated successfully.",
        cartItem: existingItem,
      });
    }

    const newCartItem = new Cart({
      user_id,
      product_id,
      product_qty,
      price,
      canteen_name,
      image,
      food_name,
    });
    await newCartItem.save();

    return res.status(201).send({
      message: "Product added to cart successfully.",
      cartItem: newCartItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Something went wrong." });
  }
};

const getCart = async (req, res) => {
  try {
    const user_id = req.user?._id;
    const cartItems = await Cart.find({ user_id }).populate("product_id");

    if (cartItems?.length === 0) {
      return res.status(404).send({ message: "No items in the cart." });
    }

    res.send({ cart: cartItems, message: "Cart fetched successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const user_id = req.user?._id;
    const { product_id, product_qty } = req.body;

    const existingItem = await Cart.findOne({ user_id, product_id });
    if (!existingItem) {
      return res.status(404).send({ message: "Cart item not found." });
    }

    if (product_qty < 1) {
      await existingItem.remove();
      return res.status(200).send({ message: "Product removed from cart." });
    }

    existingItem.product_qty = product_qty;
    await existingItem.save();

    return res.status(200).send({
      message: "Product quantity updated successfully.",
      cartItem: existingItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
};

// const updateCart = async (req, res) => {
//   try {
//     const user_id = req.user?._id?.toString(); // ensure it's string
//     const { product_id, product_qty } = req.body;

//     if (!product_id) {
//       return res.status(400).send({ message: "Product ID is required." });
//     }

//     const existingItem = await Cart.findOne({
//       user_id,
//       product_id: product_id.toString()
//     });

//     if (!existingItem) {
//       return res.status(404).send({ message: "Cart item not found." });
//     }

//     if (product_qty < 1) {
//       await existingItem.remove();
//       return res.status(200).send({ message: "Product removed from cart." });
//     }

//     existingItem.product_qty = product_qty;
//     await existingItem.save();

//     return res.status(200).send({
//       message: "Product quantity updated successfully.",
//       cartItem: existingItem,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: error.message });
//   }
// };

const deleteCartItem = async (req, res) => {
  try {
    const user_id = req.user?._id;
    const { product_id } = req.params;

    const cartItem = await Cart.findOne({ user_id, product_id });
    if (!cartItem) {
      return res.status(404).send({ message: "Cart item not found." });
    }

    await cartItem.remove();

    res.status(200).send({ message: "Cart item deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
};

const getAllCarts = async (req, res) => {
  try {
    const allCarts = await Cart.find()
      .populate("product_id")   // optional: shows product details
      .populate("user_id");     // optional: shows user details

    if (allCarts.length === 0) {
      return res.status(404).send({ message: "No cart items found." });
    }

    res.send({ carts: allCarts, message: "All carts fetched successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
};

const deleteAllCarts = async (req, res) => {
  try {
    // Deleting all cart items from the database
    const result = await Cart.deleteMany({});
    
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "No cart items found to delete." });
    }

    res.status(200).send({ message: "All cart items deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCart,
  deleteCartItem,
  getAllCarts,
  deleteAllCarts,
};

// const Cart = require("../models/cart");
// const Product = require("../models/product");

// const addToCart = async (req, res) => {
//   try {
//     const user_id = req.user?._id;
//     const { product_id, product_qty, price, canteen_name, food_name, image} =
//       req.body;

//     const productExists = await Product.findById(product_id);
//     if (!productExists) {
//       return res.status(404).send({ message: "Product not found." });
//     }

//     const existingItem = await Cart.findOne({ user_id, product_id });
//     if (existingItem) {
//       existingItem.product_qty += product_qty;
//       await existingItem.save();
//       return res.status(200).send({
//         message: "Product quantity updated successfully.",
//         cartItem: existingItem,
//       });
//     }

//     const newCartItem = new Cart({
//       user_id,
//       product_id,
//       product_qty,
//       price,
//       canteen_name,
//       image,
//       food_name,
//     });
//     await newCartItem.save();

//     return res.status(201).send({
//       message: "Product added to cart successfully.",
//       cartItem: newCartItem,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: "Something went wrong." });
//   }
// };

// const getCart = async (req, res) => {
//   try {
//     const user_id = req.user?._id;
//     const cartItems = await Cart.find({ user_id }).populate("product_id");

//     if (cartItems?.length === 0) {
//       return res.status(404).send({ message: "No items in the cart." });
//     }

//     res.send({ cart: cartItems, message: "Cart fetched successfully." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: error.message });
//   }
// };

// const updateCart = async (req, res) => {
//   try {
//     const user_id = req.user?._id;
//     const { product_id, product_qty } = req.body;

//     const existingItem = await Cart.findOne({ user_id, product_id });
//     if (!existingItem) {
//       return res.status(404).send({ success: false, message: "Cart item not found." });
//     }

//     if (product_qty < 1) {
//       await existingItem.remove();
//       return res.status(200).send({ success: true, message: "Product removed from cart." });
//     }

//     existingItem.product_qty = product_qty;
//     await existingItem.save();

//     return res.status(200).send({
//       success: true,
//       message: "Product quantity updated successfully.",
//       cartItem: existingItem,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ success: false, error: error.message });
//   }
// };

// const deleteCartItem = async (req, res) => {
//   try {
//     const user_id = req.user?._id;
//     const { product_id } = req.params;

//     const cartItem = await Cart.findOne({ user_id, product_id });
//     if (!cartItem) {
//       return res.status(404).send({ message: "Cart item not found." });
//     }

//     await cartItem.remove();

//     res.status(200).send({ message: "Cart item deleted successfully." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: error.message });
//   }
// };

// module.exports = {
//   addToCart,
//   getCart,
//   updateCart,
//   deleteCartItem,
// };

// const Cart = require("../models/cart");
// const Product = require("../models/product");

// const addToCart = async (req, res) => {
//   console.log('addToCart req.body:', req.body);
//   try {
//     const user_id = req.user?._id;
//     const { product_id, product_qty, price, canteen_name, food_name, image} =
//       req.body;

//     const productExists = await Product.findById(product_id);
//     if (!productExists) {
//       return res.status(404).send({ message: "Product not found." });
//     }

//     const existingItem = await Cart.findOne({ user_id, product_id });
//     if (existingItem) {
//       existingItem.product_qty += product_qty;
//       await existingItem.save();
//       return res.status(200).send({
//         message: "Product quantity updated successfully.",
//         cartItem: existingItem,
//       });
//     }

//     const newCartItem = new Cart({
//       user_id,
//       product_id,
//       product_qty,
//       price,
//       canteen_name,
//       image,
//       food_name,
//     });
//     await newCartItem.save();

//     return res.status(201).send({
//       message: "Product added to cart successfully.",
//       cartItem: newCartItem,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: "Something went wrong." });
//   }
// };

// const getCart = async (req, res) => {
//   try {
//     const user_id = req.user?._id;
//     const cartItems = await Cart.find({ user_id }).populate("product_id");

//     if (cartItems?.length === 0) {
//       return res.status(404).send({ message: "No items in the cart." });
//     }

//     res.send({ cart: cartItems, message: "Cart fetched successfully." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: error.message });
//   }
// };

// const updateCart = async (req, res) => {
//   try {
//     const user_id = req.user?._id;
//     const { product_id, product_qty } = req.body;

//     const existingItem = await Cart.findOne({ user_id, product_id });
//     if (!existingItem) {
//       return res.status(404).send({ message: "Cart item not found." });
//     }

//     if (product_qty < 1) {
//       await existingItem.remove();
//       return res.status(200).send({ message: "Product removed from cart." });
//     }

//     existingItem.product_qty = product_qty;
//     await existingItem.save();

//     return res.status(200).send({
//       message: "Product quantity updated successfully.",
//       cartItem: existingItem,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: error.message });
//   }
// };

// module.exports = {
//   addToCart,
//   getCart,
//   updateCart,
// };

// const Cart = require("../models/cart");
// const Product = require("../models/product");

// const addToCart = async (req, res) => {
//   try {
//     const user_id = req.user?._id;
//     const { product_id, product_qty, price, canteen_name, food_name } =
//       req.body;

//     const productExists = await Product.findById(product_id);
//     if (!productExists) {
//       return res.status(404).send({ message: "Product not found." });
//     }

//     const existingItem = await Cart.findOne({ user_id, product_id });
//     if (existingItem) {
//       existingItem.product_qty += product_qty;
//       await existingItem.save();
//       return res.status(200).send({
//         message: "Product quantity updated successfully.",
//         cartItem: existingItem,
//       });
//     }

//     const newCartItem = new Cart({
//       user_id,
//       product_id,
//       product_qty,
//       price,
//       canteen_name,
//       food_name,
//     });
//     await newCartItem.save();

//     return res.status(201).send({
//       message: "Product added to cart successfully.",
//       cartItem: newCartItem,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: "Something went wrong." });
//   }
// };

// const getCart = async (req, res) => {
//   try {
//     const user_id = req.user?._id;
//     const cartItems = await Cart.find({ user_id }).populate("product_id");

//     if (cartItems?.length === 0) {
//       return res.status(404).send({ message: "No items in the cart." });
//     }

//     res.send({ cart: cartItems, message: "Cart fetched successfully." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: error.message });
//   }
// };

// const updateCart = async (req, res) => {
//   try {
//     const user_id = req.user?._id;
//     const { product_id, product_qty } = req.body;

//     const existingItem = await Cart.findOne({ user_id, product_id });
//     if (!existingItem) {
//       return res.status(404).send({ message: "Cart item not found." });
//     }

//     if (product_qty < 1) {
//       await existingItem.remove();
//       return res.status(200).send({ message: "Product removed from cart." });
//     }

//     existingItem.product_qty = product_qty;
//     await existingItem.save();

//     return res.status(200).send({
//       message: "Product quantity updated successfully.",
//       cartItem: existingItem,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: error.message });
//   }
// };

// module.exports = {
//   addToCart,
//   getCart,
//   updateCart,
// };
