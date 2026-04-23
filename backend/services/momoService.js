const crypto = require("crypto");
const axios = require("axios");
const { momoConfig } = require("../config/momoConfig");

const createMoMoRequest = async (orderId, amount) => {
  const requestId = orderId + Date.now();
  const orderInfo = `Thanh toán đơn hàng ${orderId}`;

  const rawSignature =
    `accessKey=${momoConfig.accessKey}` +
    `&amount=${amount}` +
    `&extraData=` +
    `&ipnUrl=${momoConfig.ipnUrl}` +
    `&orderId=${orderId}` +
    `&orderInfo=${orderInfo}` +
    `&partnerCode=${momoConfig.partnerCode}` +
    `&redirectUrl=${momoConfig.redirectUrl}` +
    `&requestId=${requestId}` +
    `&requestType=captureWallet`;

  const signature = crypto
    .createHmac("sha256", momoConfig.secretKey)
    .update(rawSignature)
    .digest("hex");

  const body = {
    partnerCode: momoConfig.partnerCode,
    accessKey: momoConfig.accessKey,
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl: momoConfig.redirectUrl,
    ipnUrl: momoConfig.ipnUrl,
    extraData: "",
    requestType: "captureWallet",
    signature,
    lang: "vi",
  };

  const response = await axios.post(momoConfig.endpoint, body);
  return response.data;
};

module.exports = {
  createMoMoRequest,
};