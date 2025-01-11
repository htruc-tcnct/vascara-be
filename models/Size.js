// models/Size.js
const { DataTypes } = require("sequelize");
const sequelize = require("../middleware/connectDB");

const Size = sequelize.define(
  "Size",
  {
    size_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "products",
        key: "product_id",
      },
    },
    size: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "sizes",
    timestamps: false,
  }
);

module.exports = Size;
