const express = require("express");
const { dbMiddleware, syncDatabase } = require("./middleware/modelSetup");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const app = express();
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
// var morgan = require("morgan");
// app.use(morgan("tiny  "));
app.use(cors());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://192.168.1.39:3000"],
  })
);

app.use(express.json());
app.use(dbMiddleware);
syncDatabase();

app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/users", userRoutes);
app.use("/carts", cartRoutes);
app.listen(process.env.PORT, () => {
  console.log(`Server listening on ${process.env.PORT}`);
});
