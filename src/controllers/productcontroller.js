const Product = require("../models/product");

const createProduct = async (req, res) => {
  try {
    const { canteen_name, image, food_name, price } = req.body;

    const userId = req.user._id;

    const newProduct = new Product({
      canteen_name,
      image,
      food_name,
      price,
      user_id: userId,
    });

    await newProduct.save();
    res
      .status(201)
      .send({ product: newProduct, message: "Product created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
};

// const listProduct = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const products = await Product.find({ user_id: userId });

//     res
//       .status(200)
//       .send({ products, message: "Products fetched successfully." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: error.message });
//   }
// };

const listProduct = async (req, res) => {
  try {
    const products = await Product.find({}, 'image food_name price');

    res.status(200).send({ products, message: "✅ All products fetched successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
};

// const exploreProduct = async (req, res) => {
//   try {
//     const { category_id } = req.params;
//     console.log("Received category ID:", category_id);

//     const products = await Product.find({ category_id });

//     if (products.length > 0) {
//       res
//         .status(200)
//         .send({ products, message: "Products fetched successfully." });
//     } else {
//       res.status(404).send({ message: "No products found for this category." });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: error.message });
//   }
// };

const searchProduct = async (req, res) => {
  try {
    const { searchTerm } = req.query;
    const products = await Product.find({
      food_name: { $regex: searchTerm, $options: "i" }, // changed from title to food_name
    });

    if (products.length > 0) {
      res
        .status(200)
        .send({ products, message: "Products fetched successfully." });
    } else {
      res
        .status(404)
        .send({ message: "No products found matching your search." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { product_id } = req.params;

    if (!product_id) {
      return res.status(400).send({ message: "Product ID is required." });
    }

    const deletedProduct = await Product.findByIdAndDelete(product_id);

    if (deletedProduct) {
      res.status(200).send({ message: "Product deleted successfully." });
    } else {
      res.status(404).send({ message: "Product not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error deleting product." });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const updatedData = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      product_id,
      updatedData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).send({ message: "Product not found." });
    }

    res.status(200).send({
      product: updatedProduct,
      message: "Product updated successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error updating product." });
  }
};

const getAllCanteens = async (req, res) => {
  try {
    const canteens = await Product.distinct("canteen_name");
    res.status(200).send({ canteens, message: "✅ All canteen names fetched." });
  } catch (error) {
    console.error("Get Canteens Error:", error);
    res.status(500).send({ error: error.message });
  }
};

const getProductsByCanteen = async (req, res) => {
  try {
    const { canteen_name } = req.params;

    if (!canteen_name) {
      return res.status(400).send({ message: "Canteen name is required." });
    }

    // Use projection to select only the fields you need (image, food_name, price)
    const products = await Product.find({ canteen_name }, 'image food_name price');

    if (products.length > 0) {
      res.status(200).send({ products, message: `✅ Products from ${canteen_name} fetched.` });
    } else {
      res.status(404).send({ message: "No products found for this canteen." });
    }
  } catch (error) {
    console.error("Get Products By Canteen Error:", error);
    res.status(500).send({ error: error.message });
  }
};

const getCanteenOwnerDetails = async (req, res) => {
  try {
    // Find users with the role 'CanteenOwner'
    const canteenOwners = await User.find({ role: 'CanteenOwner' }, 'email canteen_name');
    
    if (canteenOwners.length > 0) {
      res.status(200).send({
        canteenOwners,
        message: "✅ Canteen owner details fetched successfully."
      });
    } else {
      res.status(404).send({ message: "No canteen owners found." });
    }
  } catch (error) {
    console.error("Get Canteen Owner Details Error:", error);
    res.status(500).send({ error: error.message });
  }
};
module.exports = {
  createProduct,
  listProduct,
  searchProduct,
  deleteProduct,
  updateProduct,
  getAllCanteens,
  getProductsByCanteen,
  getCanteenOwnerDetails ,

};

// const Product = require("../models/product");

// const createProduct = async (req, res) => {
//   try {
//     const { canteen_name, image, food_name, price } = req.body;

//     const userId = req.user._id;

//     const newProduct = new Product({
//       canteen_name,
//       image,
//       food_name,
//       price,
//       user_id: userId,
//     });

//     await newProduct.save();
//     res
//       .status(201)
//       .send({ product: newProduct, message: "Product created successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: error.message });
//   }
// };

// // const listProduct = async (req, res) => {
// //   try {
// //     const userId = req.user._id;

// //     const products = await Product.find({ user_id: userId });

// //     res
// //       .status(200)
// //       .send({ products, message: "Products fetched successfully." });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).send({ error: error.message });
// //   }
// // };

// const listProduct = async (req, res) => {
//   try {
//     const products = await Product.find({}, 'image food_name price');

//     res.status(200).send({ products, message: "✅ All products fetched successfully." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: error.message });
//   }
// };

// // const exploreProduct = async (req, res) => {
// //   try {
// //     const { category_id } = req.params;
// //     console.log("Received category ID:", category_id);

// //     const products = await Product.find({ category_id });

// //     if (products.length > 0) {
// //       res
// //         .status(200)
// //         .send({ products, message: "Products fetched successfully." });
// //     } else {
// //       res.status(404).send({ message: "No products found for this category." });
// //     }
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).send({ error: error.message });
// //   }
// // };

// const searchProduct = async (req, res) => {
//   try {
//     const { searchTerm } = req.query;
//     const products = await Product.find({
//       title: { $regex: searchTerm, $options: "i" },
//     });

//     if (products.length > 0) {
//       res
//         .status(200)
//         .send({ products, message: "Products fetched successfully." });
//     } else {
//       res
//         .status(404)
//         .send({ message: "No products found matching your search." });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: error.message });
//   }
// };

// const deleteProduct = async (req, res) => {
//   try {
//     const { product_id } = req.params;

//     if (!product_id) {
//       return res.status(400).send({ message: "Product ID is required." });
//     }

//     const deletedProduct = await Product.findByIdAndDelete(product_id);

//     if (deletedProduct) {
//       res.status(200).send({ message: "Product deleted successfully." });
//     } else {
//       res.status(404).send({ message: "Product not found." });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: "Error deleting product." });
//   }
// };

// const updateProduct = async (req, res) => {
//   try {
//     const { product_id } = req.params;
//     const updatedData = req.body;

//     const updatedProduct = await Product.findByIdAndUpdate(
//       product_id,
//       updatedData,
//       { new: true }
//     );

//     if (!updatedProduct) {
//       return res.status(404).send({ message: "Product not found." });
//     }

//     res.status(200).send({
//       product: updatedProduct,
//       message: "Product updated successfully.",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: "Error updating product." });
//   }
// };

// const getAllCanteens = async (req, res) => {
//   try {
//     const canteens = await Product.distinct("canteen_name");
//     res.status(200).send({ canteens, message: "✅ All canteen names fetched." });
//   } catch (error) {
//     console.error("Get Canteens Error:", error);
//     res.status(500).send({ error: error.message });
//   }
// };


// const getProductsByCanteen = async (req, res) => {
//   try {
//     const { canteen_name } = req.params;

//     if (!canteen_name) {
//       return res.status(400).send({ message: "Canteen name is required." });
//     }

//     // Use projection to select only the fields you need (image, food_name, price)
//     const products = await Product.find({ canteen_name }, 'image food_name price');

//     if (products.length > 0) {
//       res.status(200).send({ products, message: `✅ Products from ${canteen_name} fetched.` });
//     } else {
//       res.status(404).send({ message: "No products found for this canteen." });
//     }
//   } catch (error) {
//     console.error("Get Products By Canteen Error:", error);
//     res.status(500).send({ error: error.message });
//   }
// };

// module.exports = {
//   createProduct,
//   listProduct,
//   searchProduct,
//   deleteProduct,
//   updateProduct,
//   getAllCanteens,
//   getProductsByCanteen,

// };