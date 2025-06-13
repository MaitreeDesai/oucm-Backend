const express = require("express");
const router = express.Router();

const { register, approveUser, login, userList, deleteUser, changePassword, forgotPassword, resetPassword, getProfile, updateProfile } = require("../controllers/usercontroller");
const auth = require("../middleware/auth");

router.post("/register", register);

router.post('/approve-user', approveUser);

router.post("/login", login);

router.get("/userList",userList);

router.delete("/removeUser/:userId", deleteUser);

router.post("/changepassword",auth,changePassword);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.get('/profile',auth,getProfile);

router.put('/updateProfile/:_id', updateProfile);

module.exports = router;