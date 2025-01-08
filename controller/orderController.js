const axios = require("axios");
const crypto = require("crypto");
const accessKey = "F8BBA842ECF85";
const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";

const checkOutOrder = async (req, res) => {
  try {
    const { cartItemList, addressId } = req.body;
    const userId = req.user.userId; // Lấy thông tin người dùng đã đăng nhập
    const totalPrice = cartItemList.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    const orderInfo = "Pay order with MoMo";
    const partnerCode = "MOMO";
    const redirectUrl = `${process.env.CLIENT_URL}/thank-you`;
    const ipnUrl = `${process.env.CLIENT_MOMO_URL}/order/callback`;
    const requestType = "payWithMethod";
    const orderId = partnerCode + new Date().getTime();
    const requestId = orderId;
    const autoCapture = true;
    const extraData = JSON.stringify({
      cartItemList,
      addressId,
      userId, // Gửi thông tin cần thiết để tạo đơn hàng
    });

    const rawSignature = `accessKey=${accessKey}&amount=${totalPrice}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = {
      partnerCode,
      requestId,
      amount: totalPrice,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      requestType,
      autoCapture,
      extraData, // Gửi thông tin bổ sung qua MoMo
      signature,
    };

    const options = {
      url: "https://test-payment.momo.vn/v2/gateway/api/create",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: requestBody,
    };

    const result = await axios(options);
    return res.status(200).json(result.data);
  } catch (err) {
    console.error("Error in MoMo checkout:", err.message);
    return res.status(500).json({
      message: "Error in MoMo checkout",
      error: err.message,
    });
  }
};

const addNewOrder = async (req, res) => {
  try {
    const { Order, OrderItems } = req.db;
    const { cartItemList, addressId, isCheckOut } = req.body;
    const userId = req.user.userId;

    const totalPrice = cartItemList.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    const order = await Order.create({
      user_id: userId,
      address_id: addressId,
      total_price: totalPrice,
      status: isCheckOut ? "paid" : "pending",
    });

    const orderItemsList = cartItemList.map((item) => ({
      order_id: order.order_id,
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price,
      size: item.size,
    }));

    await OrderItems.bulkCreate(orderItemsList);

    return res.status(201).json({
      message: "Order created successfully",
      orderId: order.order_id,
      totalPrice,
    });
  } catch (err) {
    console.error("Error adding new order: ", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};
const getAllOrderById = async (req, res) => {
  const { Order, OrderItems, Product, ProductTranslation } = req.db; // Assuming models are injected into req.db
  const { idUser } = req.params; // Extract user ID from request parameters

  try {
    const orders = await Order.findAll({
      where: {
        user_id: idUser,
      },
      include: [
        {
          model: OrderItems,
          include: [
            {
              model: Product,
              include: [
                {
                  model: ProductTranslation,
                  as: "translations",
                },
              ],
            },
          ],
        },
      ],
    });

    return res.status(200).json(orders); // Return orders as JSON
  } catch (err) {
    console.error("Error getting all orders by user ID: ", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

const callbackURL = async (req, res) => {
  try {
    const { Order, OrderItems, Cart } = req.db; // Lấy model từ database
    const { orderId, resultCode, message } = req.body;
    const dataToCreate = JSON.parse(req.body.extraData);
    const { cartItemList, addressId, userId } = dataToCreate;
    console.log("Extra data: ", JSON.parse(req.body.extraData));
    // const userId = req.body.extraData.userId;
    console.log("User ID: ", userId);
    if (resultCode === 0) {
      // Thanh toán thành công -> Tạo đơn hàng mới
      const totalPrice = cartItemList.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );

      const order = await Order.create({
        user_id: userId,
        address_id: addressId,
        total_price: totalPrice,
        status: "paid", // Đánh dấu đơn hàng đã thanh toán
        order_id_pay_with_MOMO: orderId, // Lưu mã giao dịch từ MoMo
      });
      console.log("Order: ", order);
      const orderItemsList = cartItemList.map((item) => ({
        order_id: order.order_id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
      }));
      // console.log("List: ", orderItemsList);
      await OrderItems.bulkCreate(orderItemsList);

      return res.redirect(
        `${process.env.CLIENT_URL}/thank-you?orderId=${order.order_id}`
      );
    } else {
      // Thanh toán thất bại
      console.error("Payment failed:", message);
      return res.redirect(`${process.env.CLIENT_URL}/`);
    }
  } catch (err) {
    console.error("Error in callbackURL:", err.message);
    return res.status(500).send("Internal server error");
  }
};

const transaction = async (req, res) => {
  try {
    const { orderId } = req.body;

    const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = {
      partnerCode: "MOMO",
      orderId,
      requestId: orderId,
      accessKey,
      signature,
      lang: "vi",
    };

    const options = {
      url: "https://test-payment.momo.vn/v2/gateway/api/query",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: requestBody,
    };

    const result = await axios(options);
    return res.status(200).json(result.data);
  } catch (err) {
    console.error("Error in transaction:", err.message);
    return res.status(500).json({
      message: "Error processing transaction",
      error: err.message,
    });
  }
};

module.exports = {
  checkOutOrder,
  addNewOrder,
  callbackURL,
  transaction,
  getAllOrderById,
};
