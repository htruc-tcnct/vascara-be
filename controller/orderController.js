const axios = require("axios");
const crypto = require("crypto");
const checkOutOrder = async (req, res) => {
  //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
  //parameters
  var accessKey = "F8BBA842ECF85";
  var secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
  var orderInfo = "pay with MoMo";
  var partnerCode = "MOMO";
  var redirectUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
  var ipnUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
  var requestType = "payWithMethod";
  var amount = "60000";
  var orderId = partnerCode + new Date().getTime();
  var requestId = orderId;
  var extraData = "";
  var orderGroupId = "";
  var autoCapture = true;
  var lang = "vi";

  //before sign HMAC SHA256 with format
  //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  var rawSignature =
    "accessKey=" +
    accessKey +
    "&amount=" +
    amount +
    "&extraData=" +
    extraData +
    "&ipnUrl=" +
    ipnUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    requestId +
    "&requestType=" +
    requestType;
  //puts raw signature
  console.log("--------------------RAW SIGNATURE----------------");
  console.log(rawSignature);
  //signature
  const crypto = require("crypto");
  var signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");
  console.log("--------------------SIGNATURE----------------");
  console.log(signature);

  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: orderGroupId,
    signature: signature,
  });
  //Create the HTTPS objects
  const options = {
    url: "https://test-payment.momo.vn/v2/gateway/api/create",
    port: 443,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody),
    },
    data: requestBody,
  };
  let result;
  try {
    result = await axios(options);
    return res.status(200).json(result.data);
  } catch (err) {
    return res.status(500).json({
      message: "Loi khi thanh toan momo",
      error: err.message,
    });
  }
  req.on("error", (e) => {
    console.log(`problem with request: ${e.message}`);
  });
  // write data to request body
  console.log("Sending....");
  req.write(requestBody);
  req.end();
};
const addNewOrder = async (req, res) => {
  try {
    const { Order, OrderItems } = req.db;
    const { cartItemList, addressId, isCheckOut } = req.body;
    const userId = req.user.userId;
    console.log("HAHAHAHHA: ", req.user);
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
      message: "Internal sever error",
      error: err.message,
    });
  }
};
module.exports = {
  checkOutOrder,
  addNewOrder,
};
