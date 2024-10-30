const getAllCart = async (req, res) => {
  try {
  } catch (error) {}
};
const addToCart = async (req, res) => {
  try {
    const { Cart, CartItem, Product } = req.db;
    const { product_id, quantity } = req.body;
    const userId = req.user.id;
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    // tim kiem gio hang nguoi dung, tao moi neu chua co
    let cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) {
      cart = await Cart.create({ user_id: userId });
    }
    //kiem tra xem san pham da co trong gio hang chua
    let cartItem = await CartItem.findOne({
      whre: {
        cart_id: cart.cart_id,
        product: product_id,
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
      });
    }

    res
      .status(201)
      .json({ message: "Product added to cart successfull", cartItem });
  } catch (error) {
    console.error("Error adding to cart: ", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};
module.exports = {
  getAllCart,
  addToCart,
};
