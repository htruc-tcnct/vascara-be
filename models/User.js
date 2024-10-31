const { DataTypes } = require("sequelize");
const sequelize = require("../middleware/connectDB"); // Đảm bảo đường dẫn đúng đến file database.js

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // Kiểm tra định dạng email
      },
    },
    name: {
      type: DataTypes.STRING(100),
    },
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      defaultValue: "user", // Giá trị mặc định là "user"
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "users", // Tên bảng trong CSDL
    timestamps: true, // Tự động thêm `createdAt` và `updatedAt`
    createdAt: "created_at", // Sử dụng trường `created_at` thay cho `createdAt`
    updatedAt: "updated_at", // Sử dụng trường `updated_at` thay cho `updatedAt`
  }
);

module.exports = User;
