const Category = require("../models/Category");
const Product = require("../models/Product");
const ProductTranslation = require("../models/ProductTranslation");
const Size = require("../models/Size");
const ProductImage = require("../models/ProductImage");
const User = require("../models/User");
const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Address = require("../models/Address"); // Import Address model

// Product and Category relationships
Product.belongsTo(Category, { foreignKey: "category_id", as: "category" });
Category.hasMany(Product, {
  foreignKey: "category_id",
  as: "products",
});

// Product translations and images relationships
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

// Product and Size relationships
Product.hasMany(Size, { foreignKey: "product_id", as: "sizes" });
Size.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// Cart and CartItem relationships
Cart.hasMany(CartItem, { foreignKey: "cart_id", as: "items" });
CartItem.belongsTo(Cart, { foreignKey: "cart_id" });
Product.hasMany(CartItem, { foreignKey: "product_id" });
CartItem.belongsTo(Product, { foreignKey: "product_id" });

// User and Address relationships
User.hasMany(Address, { foreignKey: "user_id", as: "addresses" });
Address.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Middleware to attach models to req.db
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
    Address, // Include Address model
  };
  next();
};

module.exports = { dbMiddleware };
