const { Sequelize } = require("sequelize");
require("dotenv").config(); // Load biến môi trường từ file .env

// Khởi tạo kết nối Sequelize với thông tin từ biến môi trường
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false, // Tắt log để giữ cho console sạch hơn
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(
      "Connection to the database has been established successfully."
    );
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

connectDB();

module.exports = sequelize;
