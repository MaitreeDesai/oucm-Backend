const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const decode = jwt?.verify(token, "lll");
    console.log("decode",decode);
    const user = await User.findOne({ _id: decode._id});
    if (!user) {
      throw new Error("User not found");
    }
    console.log("In midddlwearw");
    req.user = user;
    next();
  } catch (e) {
    console.error(e);
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = auth;
