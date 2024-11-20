const { DataTypes } = require("sequelize");
const sequelize = require("../middleware/connectDB");

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
        isEmail: true,
      },
    },
    phonenumber: {
      type: DataTypes.STRING(10),
      allowNull: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(100),
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      defaultValue: "user",
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
    birthday: {
      type: DataTypes.DATEONLY,
    },

    address: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        province: null,
        district: null,
        ward: null,
        detail: null,
      },
      validate: {
        isObject(value) {
          if (typeof value !== "object" || value === null) {
            throw new Error("Address must be an object.");
          }
        },
      },
    },
    gender: {
      type: DataTypes.ENUM("male", "female", "other"),
      allowNull: true,
      defaultValue: "other",
    },
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = User;
