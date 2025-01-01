const { DataTypes } = require("sequelize");
const sequelize = require("../middleware/connectDB");

const Order = sequelize.define(
  "Order",
  {
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users", // Tên bảng Users
        key: "user_id", // Khoá ngoại từ bảng Users
      },
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "paid", "cancelled"),
      defaultValue: "pending",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    address_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "address", // Tên bảng Addresses
        key: "address_id", // Khoá ngoại từ bảng Addresses
      },
    },
  },
  {
    tableName: "orders", // Tên bảng trong cơ sở dữ liệu
    timestamps: false, // Không tự động thêm createdAt, updatedAt
  }
);

module.exports = Order;
