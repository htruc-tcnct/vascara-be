// models/CartItem.js
const { DataTypes } = require("sequelize");
const sequelize = require("../middleware/connectDB"); // Kết nối đến cơ sở dữ liệu
const Cart = require("./Cart");
const Product = require("./Product");

const CartItem = sequelize.define(
  "CartItem",
  {
    cart_item_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cart_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Cart,
        key: "cart_id",
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: "product_id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
  },
  {
    tableName: "cart_items",
    timestamps: false,
  }
);

module.exports = CartItem;
