const Category = require("../models/Category");
const Product = require("../models/Product");
const ProductTranslation = require("../models/ProductTranslation");
const Size = require("../models/Size");
const ProductImage = require("../models/ProductImage");
const User = require("../models/User");
const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");

// Thiết lập các mối quan hệ giữa các model
Product.belongsTo(Category, { foreignKey: "category_id" });

Product.hasMany(ProductTranslation, {
  foreignKey: "product_id",
  as: "translations",
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
  as: "product",
});

Product.hasMany(Size, { foreignKey: "product_id", as: "sizes" });
Size.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// Thiết lập quan hệ cho Cart và CartItem
Cart.hasMany(CartItem, { foreignKey: "cart_id", as: "items" });
CartItem.belongsTo(Cart, { foreignKey: "cart_id" });
Product.hasMany(CartItem, { foreignKey: "product_id" });
CartItem.belongsTo(Product, { foreignKey: "product_id" });

// Middleware để gắn các model vào req.db
const dbMiddleware = (req, res, next) => {
  req.db = {
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

module.exports = { dbMiddleware };
