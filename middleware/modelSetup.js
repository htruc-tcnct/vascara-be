const sequelize = require("./connectDB");
const Category = require("../models/Category");
const Product = require("../models/Product");
const ProductTranslation = require("../models/ProductTranslation");
const Size = require("../models/Size");
const ProductImage = require("../models/ProductImage");
const User = require("../models/User");
const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");

Product.belongsTo(Category, { foreignKey: "category_id" });

Product.hasMany(ProductTranslation, {
  foreignKey: "product_id",
  as: "translations", // Alias phải trùng khớp khi sử dụng trong include
});
Product.hasMany(ProductImage, {
  foreignKey: "product_id",
  as: "product_images",
});
ProductImage.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product",
});
ProductTranslation.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product", // Alias ngược nếu cần
});

Product.hasMany(Size, { foreignKey: "product_id" });

Size.belongsTo(Product, { foreignKey: "product_id" });

// Thiết lập quan hệ
Cart.hasMany(CartItem, { foreignKey: "cart_id", as: "items" });
CartItem.belongsTo(Cart, { foreignKey: "cart_id" });
Product.hasMany(CartItem, { foreignKey: "product_id" });
CartItem.belongsTo(Product, { foreignKey: "product_id" });
// Đồng bộ hóa các models với cơ sở dữ liệu

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true }); // Đồng bộ hóa mà không làm mất dữ liệu hiện có
    console.log("Database & tables synced");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};

const dbMiddleware = (req, res, next) => {
  req.db = {
    sequelize,
    Category,
    Product,
    ProductTranslation,
    Size,
    ProductImage,
    User,
    Cart,
    CartItem,
  };
  next();
};

module.exports = { dbMiddleware, syncDatabase };
