// models/ProductTranslation.js
const { DataTypes } = require("sequelize");
const sequelize = require("../middleware/connectDB");

const ProductTranslation = sequelize.define(
  "ProductTranslation",
  {
    translation_id: {
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
    language: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "product_translations",
    timestamps: false,
  }
);

module.exports = ProductTranslation;
