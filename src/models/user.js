const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  enrollment_no: {
    type: String,
    required: function () {
      return !this.canteen_name;
    }
  },
  contact_no: {
    type: String,
    required: function () {
      return !this.canteen_name;
    }
  },
  canteen_name: {
    type: String,
    required: function () {
      return !this.enrollment_no && !this.contact_no;
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
  },
  role: {
    type: mongoose.Types.ObjectId,
    ref: "Role",
    default: "66abad2fffe0c8c69ff71c01"
  },
  isApproved: { type: Boolean, 
    default: false 
  },
  
  resetPasswordToken: {
    type: String,
    default: ""
  },
  resetPasswordExpires: {
    type: String
  }
});

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await mongoose.model("User").findOne({ email });

  if (!user) {
    throw new Error("User not registered with this email. Please register first.");
  }

  if (user.password !== password) {
    throw new Error("Password is incorrect.");
  }

  return user;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "lll");
  await user.save();
  return token;
};

userSchema.statics.updatePassword = async (user_id, newPassword) => {
  if (!user_id || !newPassword) {
    throw new Error("User ID and new password are required.");
  }

  const user = await mongoose.model("User").findById(user_id);

  if (!user) {
    throw new Error("User not found.");
  }

  user.password = newPassword;
  await user.save();

  return { message: "Password updated successfully." };
};

const User = mongoose.model("User", userSchema);
module.exports = User;



// const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");

// const userSchema = new mongoose.Schema({
//   enrollment_no: {
//     type: String,
//     required: function () {
//       return !this.canteen_name;
//     }
//   },
//   contact_no: {
//     type: String,
//     required: function () {
//       return !this.canteen_name;
//     }
//   },
//   canteen_name: {
//     type: String,
//     required: function () {
//       return !this.enrollment_no && !this.contact_no;
//     }
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     trim: true,
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 6,
//   },
//   role: {
//     type: mongoose.Types.ObjectId,
//     ref: "Role",
//     default: "66abad2fffe0c8c69ff71c01"
//   },
//   isApproved: { type: Boolean, 
//     default: false 
//   },
  
//   resetPasswordToken: {
//     type: String,
//     default: ""
//   },
//   resetPasswordExpires: {
//     type: String
//   }
// });

// userSchema.statics.findByCredentials = async (email, password) => {
//   const user = await mongoose.model("User").findOne({ email });

//   if (!user) {
//     throw new Error("User not registered with this email. Please register first.");
//   }

//   if (user.password !== password) {
//     throw new Error("Password is incorrect.");
//   }

//   return user;
// };

// userSchema.methods.generateAuthToken = async function () {
//   const user = this;
//   const token = jwt.sign({ _id: user._id.toString() }, "lll");
//   await user.save();
//   return token;
// };

// userSchema.statics.updatePassword = async (user_id, newPassword) => {
//   if (!user_id || !newPassword) {
//     throw new Error("User ID and new password are required.");
//   }

//   const user = await mongoose.model("User").findById(user_id);

//   if (!user) {
//     throw new Error("User not found.");
//   }

//   user.password = newPassword;
//   await user.save();

//   return { message: "Password updated successfully." };
// };

// const User = mongoose.model("User", userSchema);
// module.exports = User;


