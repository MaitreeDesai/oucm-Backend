// const Role = require("../models/role");
// const User = require("../models/user");
// const nodemailer = require("nodemailer");
// const crypto = require("crypto");

// // Register
// const register = async (req, res) => {
//   try {
//     const userCheck = await User.findOne({ email: req.body.email });
//     if (userCheck) {
//       throw new Error("Email ID already exists.");
//     }

//     let roleId;

//     if (req.body.canteen_name) {
//       const rolename = await Role.findOne({ role_name: "CanteenOwner" });
//       roleId = rolename ? rolename._id : "67e3e91713f029c975c111c7";

//       const user = new User({
//         role: roleId,
//         canteen_name: req.body.canteen_name,
//         email: req.body.email,
//         password: req.body.password,
//       });

//       const userDetails = await user.save();
//       return res.status(201).send({
//         userDetails,
//         message: "Canteen Owner send request successful.",
//       });
//     } else if (req.body.enrollment_no && req.body.contact_no) {
//       const rolename = await Role.findOne({ role_name: "Customer" });
//       roleId = rolename ? rolename._id : "66abad2fffe0c8c69ff71c01";

//       const user = new User({
//         role: roleId,
//         enrollment_no: req.body.enrollment_no,
//         contact_no: req.body.contact_no,
//         email: req.body.email,
//         password: req.body.password,
//       });

//       const userDetails = await user.save();
//       return res.status(201).send({
//         userDetails,
//         message: "Customer registration successful.",
//       });
//     } else {
//       throw new Error("Invalid registration details.");
//     }
//   } catch (e) {
//     res.status(400).send({ error: e.message });
//   }
// };

// // Approve / Reject User
// const approveUser = async (req, res) => {
//   try {
//     const { userId, status } = req.body;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).send({ error: "User not found." });
//     }

//     user.isApproved = status;
//     await user.save();

//     const message = status ? "User approved successfully." : "User rejected.";
//     res.status(200).send({ message });
//   } catch (e) {
//     res.status(500).send({ error: e.message });
//   }
// };

// // Login
// const login = async (req, res) => {
//   try {
//     const user = await User.findOne({
//       email: req.body.email,
//       password: req.body.password,
//     }).populate("role");

//     if (!user) throw new Error("Invalid email or password.");

//     // Only check approval for canteen owners
//     if (user.role?.role_name === "CanteenOwner" && !user.isApproved) {
//       return res
//         .status(403)
//         .send({ error: "Your account is not approved yet." });
//     }

//     const token = await user.generateAuthToken();

//     // If the user is a customer, don't include isApproved in the response
//     const { password, isApproved, ...safeUserData } = user._doc;

//     if (user.role?.role_name === "Customer") {
//       res.send({
//         user: { ...safeUserData, token },
//         message: "Login successful.",
//       });
//     } else {
//       res.send({
//         user: { ...user._doc, token },
//         message: "Login successful.",
//       });
//     }
//   } catch (e) {
//     res.status(400).send({ error: e.message });
//   }
// };  

// // List Users
// const userList = async (req, res) => {
//   try {
//     const userList = await User.find({}).populate("role");
//     res.send({ users: userList, message: "Users fetched successfully." });
//   } catch (e) {
//     res.status(400).send({ error: e.message });
//   }
// };

// // Delete User
// const deleteUser = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const user = await User.findByIdAndDelete(userId);

//     if (!user) {
//       return res.status(404).send({ error: "User not found" });
//     }

//     res.send({ message: "User deleted successfully." });
//   } catch (e) {
//     res
//       .status(500)
//       .send({ error: "Failed to delete user. Please try again later." });
//   }
// };

// // Change Password (plain text)
// const changePassword = async (req, res) => {
//   try {
//     const user_id = req.user._id;
//     const { password, oldpassword } = req.body;

//     if (!password) {
//       return res.status(400).send({ error: "password is required." });
//     }

//     if (!oldpassword) {
//       return res.status(400).send({ error: "oldpassword is required." });
//     }

//     const user = await User.findOne({ _id: user_id, password: oldpassword });

//     if (!user) {
//       return res.status(404).send({ error: "Current Password is wrong" });
//     }

//     user.password = password;
//     await user.save();

//     res.send({ message: "Password updated successfully." });
//   } catch (e) {
//     res.status(500).send({ error: e.message });
//   }
// };

// // Forgot Password
// const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).send({ error: "User not found." });
//     }

//     const token = crypto.randomBytes(20).toString("hex");
//     user.resetPasswordToken = token;
//     user.resetPasswordExpires = Date.now() + 3600000;
//     await user.save();

//     const transporter = nodemailer.createTransport({
//       service: "Gmail",
//       auth: {
//         user: "21bmiit019@gmail.com",
//         pass: "vsqi pnog dyze ihry",
//       },
//     });

//     const mailOptions = {
//       to: email,
//       from: "21bmiit019@gmail.com",
//       subject: "Password Reset",
//       text:
//         `You are receiving this email because a request was made to reset your account password.\n\n` +
//         `Please click on the following link to complete the process:\n\n` +
//         `http://localhost:3000/reset-password/${token}\n\n`,
//     };

//     transporter.sendMail(mailOptions, (error) => {
//       if (error) {
//         console.error("Error sending email:", error);
//         return res.status(500).send({ error: "Error sending email." });
//       }
//       res.status(200).send({ message: "Email sent successfully." });
//     });
//   } catch (e) {
//     res.status(500).send({ error: e.message });
//   }
// };

// // Reset Password
// const resetPassword = async (req, res) => {
//   try {
//     const { token, password } = req.body;

//     const user = await User.findOne({
//       resetPasswordToken: token,
//     });

//     if (!user) {
//       return res.status(400).send({
//         error: "Password reset token is invalid or has expired.",
//       });
//     }

//     user.password = password;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;
//     await user.save();

//     res.status(200).send({ message: "Password has been updated." });
//   } catch (e) {
//     res.status(500).send({ error: e.message });
//   }
// };

// // Get Profile
// const getProfile = async (req, res) => {
//   const user = req.user;
//   res.send({ user, message: "User fetched successfully." });
// };

// const updateProfile = async (req, res) => {
//   try {
//     // Get the user ID from the URL
//     const userId = req.params._id;
//     const { enrollment_no, contact_no, email } = req.body;

//     // Validate required fields
//     if (!enrollment_no || !contact_no || !email) {
//       return res.status(400).send({ error: "All fields are required." });
//     }

//     // Find user by ID
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).send({ error: "User not found." });
//     }

//     // Update the user's profile details
//     user.enrollment_no = enrollment_no;
//     user.contact_no = contact_no;
//     user.email = email;

//     // Save updated user data
//     await user.save();

//     res.send({
//       user: { _id: user._id, enrollment_no, contact_no, email },
//       message: "Profile updated successfully.",
//     });
//   } catch (e) {
//     res.status(500).send({ error: e.message });
//   }
// };

// module.exports = {
//   register,
//   approveUser,
//   login,
//   userList,
//   deleteUser,
//   changePassword,
//   forgotPassword,
//   resetPassword,
//   getProfile,
//   updateProfile,
// };
const Role = require("../models/role");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

// Register
const register = async (req, res) => {
  try {
    const userCheck = await User.findOne({ email: req.body.email });
    if (userCheck) {
      throw new Error("Email ID already exists.");
    }

    let roleId;

    if (req.body.canteen_name) {
      const rolename = await Role.findOne({ role_name: "CanteenOwner" });
      roleId = rolename ? rolename._id : "67e3e91713f029c975c111c7";

      const user = new User({
        role: roleId,
        canteen_name: req.body.canteen_name,
        email: req.body.email,
        password: req.body.password,
        isApproved: false, // Canteen owner needs approval
      });

      const userDetails = await user.save();
      return res.status(201).send({
        userDetails,
        message: "Canteen Owner send request successful.",
      });
    } else if (req.body.enrollment_no && req.body.contact_no) {
      const rolename = await Role.findOne({ role_name: "Customer" });
      roleId = rolename ? rolename._id : "66abad2fffe0c8c69ff71c01";

      const user = new User({
        role: roleId,
        enrollment_no: req.body.enrollment_no,
        contact_no: req.body.contact_no,
        email: req.body.email,
        password: req.body.password,
        isApproved: true, // ✅ Customers are approved by default
      });

      const userDetails = await user.save();
      return res.status(201).send({
        userDetails,
        message: "Customer registration successful.",
      });
    } else {
      throw new Error("Invalid registration details.");
    }
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

// Approve / Reject User
const approveUser = async (req, res) => {
  try {
    const { userId, status } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ error: "User not found." });
    }

    user.isApproved = status;
    await user.save();

    const message = status ? "User approved successfully." : "User rejected.";
    res.status(200).send({ message });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    }).populate("role");

    if (!user) throw new Error("Invalid email or password.");

    // Only check approval for canteen owners
    if (user.role?.role_name === "CanteenOwner" && !user.isApproved) {
      return res
        .status(403)
        .send({ error: "Your account is not approved yet." });
    }

    const token = await user.generateAuthToken();

    // If the user is a customer, don't include isApproved in the response
    const { password, isApproved, ...safeUserData } = user._doc;

    if (user.role?.role_name === "Customer") {
      res.send({
        user: { ...safeUserData, token },
        message: "Login successful.",
      });
    } else {
      res.send({
        user: { ...user._doc, token },
        message: "Login successful.",
      });
    }
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

// List Users
const userList = async (req, res) => {
  try {
    const userList = await User.find({}).populate("role");
    res.send({ users: userList, message: "Users fetched successfully." });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    res.send({ message: "User deleted successfully." });
  } catch (e) {
    res
      .status(500)
      .send({ error: "Failed to delete user. Please try again later." });
  }
};

// Change Password (plain text)
// const changePassword = async (req, res) => {
//   try {
//     const user_id = req.user._id;
//     const { password, oldpassword } = req.body;

//     if (!password) {
//       return res.status(400).send({ error: "password is required." });
//     }

//     if (!oldpassword) {
//       return res.status(400).send({ error: "oldpassword is required." });
//     }

//     const user = await User.findOne({ _id: user_id, password: oldpassword });

//     if (!user) {
//       return res.status(404).send({ error: "Current Password is wrong" });
//     }

//     user.password = password;
//     await user.save();

//     res.send({ message: "Password updated successfully." });
//   } catch (e) {
//     res.status(500).send({ error: e.message });
//   }
// };

const changePassword = async (req, res) => {
  try {
    const user_id = req.user._id;
    const { password, oldpassword } = req.body;

    // Validate inputs
    if (!password || !oldpassword) {
      return res.status(400).json({ error: "Both old and new passwords are required." });
    }

    // Find user
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if old password matches
    if (user.password !== oldpassword) {
      return res.status(401).json({ error: "Old password is incorrect." });
    }

    // Update to new password
    user.password = password;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: "User not found." });
    }

    // Generate a reset token
    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour validity
    await user.save();

    // Set up email transporter using environment variables for email credentials
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "21bmiit019@gmail.com",
        pass: "hleq udvm xuox tpjk",// The password for your email account (set in .env file)
      },
    });

    // Generate reset link (deep link for mobile app)
    const resetLink = `utucanteenapp://reset-password/${token}`;

    // Send reset email
    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset",
      html: `
        <p>You are receiving this email because a request was made to reset your password.</p>
        <p>
          <a href="${resetLink}" style="color: blue; text-decoration: underline;">
            Click here to reset your password using the mobile app
          </a>
        </p>
        <p>If you did not request this, please ignore this email.</p>
        <p>Link: <br> ${resetLink}</p>
      `,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).send({ error: "Error sending email." });
      }
      res.status(200).send({ message: "Reset link sent to email." });
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: e.message });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Find user by reset token and check if it is still valid
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Token should not be expired
    });

    if (!user) {
      return res.status(400).send({
        error: "Password reset token is invalid or has expired.",
      });
    }

    // Store password in plain text (Not recommended)
    user.password = password;  // Directly assign the plain text password
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).send({ message: "Password has been updated." });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: e.message });
  }
};

// Get Profile
const getProfile = async (req, res) => {
  const user = req.user;
  res.send({ user, message: "User fetched successfully." });
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.params._id;
    const { enrollment_no, contact_no, email } = req.body;

    if (!enrollment_no || !contact_no || !email) {
      return res.status(400).send({ error: "All fields are required." });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ error: "User not found." });
    }

    user.enrollment_no = enrollment_no;
    user.contact_no = contact_no;
    user.email = email;

    await user.save();

    res.send({
      user: { _id: user._id, enrollment_no, contact_no, email },
      message: "Profile updated successfully.",
    });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

module.exports = {
  register,
  approveUser,
  login,
  userList,
  deleteUser,
  changePassword,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
};
