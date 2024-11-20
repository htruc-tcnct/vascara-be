const { DataTypes } = require("sequelize");
const sequelize = require("../middleware/connectDB"); // Kết nối đến cơ sở dữ liệu

const Address = sequelize.define(
  "Address",
  {
    address_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    province: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    district: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ward: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    specific_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "address",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Address;
