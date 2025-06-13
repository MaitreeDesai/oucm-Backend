const express = require("express");
const cors = require("cors");
require("./db/mongoose");

const userRouter = require("./routers/user");
const roleRouter = require("./routers/role");
const productRouter = require("./routers/product");
const cartRouter = require("./routers/cart")
const exploreProductRouter = require("./routers/product");
const orderRouter = require("./routers/order");
const path = require("path");
const app = express();

const allowedOrigins = ['http://192.168.31.193', 'http://localhost:3000'];

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       console.log("Blocked by CORS:", origin);
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true
// };

// app.use(cors(corsOptions));
const corsOptions = {
  origin: true, // Allow all origins for now (for development)
  credentials: true
};

app.use(cors(corsOptions));

const port = process.env.PORT || 8000;
app.use(express.urlencoded({ extended: true }));
app.use("/Images", express.static(path.join(__dirname,"../Images")));

app.use(express.json());
app.use(userRouter);
app.use(roleRouter);
app.use(productRouter);
app.use(cartRouter);
app.use(orderRouter);

app.use(exploreProductRouter);

app.get("/test", (req, res) => {
  res.send("Backend is working fine!");
});

app.listen(port, '0.0.0.0', () => {
  console.log("Server is running on port", port);
});

// app.listen(port, () => {
//   console.log("Server is running on port", +port);
// });
