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
    province_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },

    district_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },

    ward_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },

    specific_address: {
      type: DataTypes.STRING(255),
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
