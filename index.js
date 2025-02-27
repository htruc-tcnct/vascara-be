const express = require("express");
const { dbMiddleware, syncDatabase } = require("./middleware/modelSetup");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const addressRoutes = require("./routes/addressRoutes");
const adminRoutes = require("./routes/adminRoutes");
const orderRoutes = require("./routes/orderRotes");
const app = express();
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
var morgan = require("morgan");
app.use(morgan("tiny"));
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://vascara-fe.vercel.app",
      "http://192.168.1.7:3000",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(dbMiddleware);

app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/users", userRoutes);
app.use("/carts", cartRoutes);
app.use("/address", addressRoutes);
app.use("/admin", adminRoutes);
app.use("/order", orderRoutes);
app.listen(process.env.PORT, () => {
  console.log(`Server listening on ${process.env.PORT}`);
});
