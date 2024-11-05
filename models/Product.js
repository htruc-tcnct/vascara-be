// models/Product.js
const { DataTypes } = require("sequelize");
const sequelize = require("../middleware/connectDB");
const Product = sequelize.define(
  "Product",
  {
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "categories",
        key: "category_id",
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    main_image_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    hover_image_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "products",
    timestamps: false,
  }
);

module.exports = Product;
