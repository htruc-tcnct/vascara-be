// models/ProductImage.js
const { DataTypes } = require("sequelize");
const sequelize = require("../middleware/connectDB");

const ProductImage = sequelize.define(
  "ProductImage",
  {
    image_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "product_id",
      },
      onDelete: "CASCADE",
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "product_images",
    timestamps: false,
  }
);

module.exports = ProductImage;
