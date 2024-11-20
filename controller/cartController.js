const { where } = require("sequelize");
const getCartByUserId = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { Cart, CartItem, Product, ProductTranslation } = req.db;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const cart = await Cart.findOne({
      where: { user_id: userId },
      include: [
        {
          model: CartItem,
          as: "items", // Sử dụng alias 'items' như đã định nghĩa trong mối quan hệ
          include: [
            {
              model: Product,
              attributes: ["price", "main_image_url", "hover_image_url"],
              include: [
                {
                  model: ProductTranslation,
                  as: "translations", // Đảm bảo alias trùng với định nghĩa trong mô hình
                  attributes: ["name", "language"], // Lấy name và language từ ProductTranslation
                },
              ],
            },
          ],
        },
      ],
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found." });
    }

    // Extract cart items with both English and Vietnamese translations
    const cartItems = cart.items.map((item) => {
      const translations = item.Product.translations.reduce(
        (acc, translation) => {
          acc[translation.language] = translation.name;
          return acc;
        },
        {}
      );

      return {
        cartItemId: item.cart_item_id,
        productId: item.product_id,
        quantity: item.quantity,
        size: item.size,
        price: item.Product.price,
        mainImageUrl: item.Product.main_image_url,
        hoverImageUrl: item.Product.hover_image_url,
        translations, // Gồm cả 'en' và 'vi' (nếu có) trong đối tượng translations
      };
    });

    return res.status(200).json({ cartItems });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the cart items." });
  }
};

const addToCart = async (req, res) => {
  try {
    const { Cart, CartItem, Product, Size } = req.db;
    const { product_id, quantity, size } = req.body;
    const userId = req.user.userId;

    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const productSize = await Size.findOne({
      where: {
        product_id: product_id,
        size: size,
      },
    });

    if (!productSize || productSize.stock < quantity) {
      return res
        .status(400)
        .json({ message: "Not enough stock available for this size." });
    }

    let cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) {
      cart = await Cart.create({ user_id: userId });
    }

    let cartItem = await CartItem.findOne({
      where: {
        cart_id: cart.cart_id,
        product_id,
        size,
      },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        cart_id: cart.cart_id,
        product_id,
        quantity,
        size,
      });
    }

    productSize.stock -= quantity;
    await productSize.save();

    res
      .status(201)
      .json({ message: "Product added to cart successfully", cartItem });
  } catch (error) {
    console.error("Error adding to cart: ", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};
const deleteItems = async (req, res) => {
  const { idCart } = req.query;
  const { CartItem } = req.db; // Giả định CartItem là mô hình Sequelize

  if (!idCart) {
    return res
      .status(400)
      .json({ error: "Error when deleting items: idCart is required" });
  }

  try {
    const result = await CartItem.destroy({ where: { cart_item_id: idCart } }); // Xóa dựa trên idCart

    if (result === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(201).json({ message: "Item deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error when deleting item", details: err.message });
  }
};
const updateItems = async (req, res) => {
  const { cartItemId, quantity } = req.query;
  const { CartItem } = req.db;
  if (!cartItemId || !quantity) {
    return res.status(400).json({ Erorr: "Not enough inf to update" });
  }
  try {
    const cartItem = await CartItem.findOne({
      where: { cart_item_id: cartItemId },
    });
    if (!cartItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    const newQuantity = cartItem.quantity + parseInt(quantity, 10);
    if (newQuantity > 0) {
      await CartItem.update(
        { quantity: newQuantity },
        { where: { cart_item_id: cartItemId } }
      );
      return res.status(200).json({ message: "Quantity updated successfull" });
    } else {
      await CartItem.destroy({ where: { cart_item_id: cartItemId } });

      return res.status(200).json({ message: "Item deleted successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error when updating item", detail: err });
  }
};
module.exports = {
  getCartByUserId,
  addToCart,
  deleteItems,
  updateItems,
};
