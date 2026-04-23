const { createMoMoRequest } = require("../services/momoService");
const db = require("../config/db"); // mysql

// 👉 Tạo payment
const createPayment = async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    const result = await createMoMoRequest(orderId, amount);

    res.json({
      payUrl: result.payUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "MoMo error" });
  }
};

// 👉 IPN callback (MoMo gọi về)
const momoIPN = async (req, res) => {
  const data = req.body;

  try {
    if (data.resultCode === 0) {
      await db.query(
        "UPDATE orders SET status='Đã thanh toán' WHERE order_ID=?",
        [data.orderId]
      );
    }

    res.json({ message: "OK" });
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};

module.exports = {
  createPayment,
  momoIPN,
};