const getCartByUserId = async (req, res) => {
  try {
    const { userId } = req.query;
    const { Cart, CartItem, Product } = req.db;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    // Find the user's cart with the correct alias for CartItem
    const cart = await Cart.findOne({
      where: { user_id: userId },
      include: [
        {
          model: CartItem,
          as: "items", // Use the alias 'items' as defined in your association
          include: [
            {
              model: Product,
              attributes: ["price", "main_image_url", "hover_image_url"],
            },
          ],
        },
      ],
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found." });
    }

    // Extract cart items using the 'items' alias
    const cartItems = cart.items.map((item) => ({
      cartItemId: item.cart_item_id,
      productId: item.product_id,
      quantity: item.quantity,
      size: item.size,
      price: item.Product.price,
      mainImageUrl: item.Product.main_image_url,
      hoverImageUrl: item.Product.hover_image_url,
    }));

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
    const userId = req.user.id;

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

module.exports = {
  getCartByUserId,
  addToCart,
};
