const { DataTypes } = require("sequelize");
const sequelize = require("../middleware/connectDB");

const OrderItem = sequelize.define(
  "OrderItem",
  {
    order_item_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "orders", // Tên bảng Orders
        key: "order_id", // Khoá ngoại từ bảng Orders
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products", // Tên bảng Products
        key: "product_id", // Khoá ngoại từ bảng Products
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    size: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
  },
  {
    tableName: "order_items", // Tên bảng trong cơ sở dữ liệu
    timestamps: false, // Không tự động thêm createdAt, updatedAt
  }
);

module.exports = OrderItem;
