const momoConfig = {
  partnerCode: "MOMO",
  accessKey: "YOUR_ACCESS_KEY",
  secretKey: "YOUR_SECRET_KEY",
  endpoint: "https://test-payment.momo.vn/v2/gateway/api/create",
  redirectUrl: "http://localhost:3000/payment-success",
  ipnUrl: "http://localhost:5000/api/momo/ipn",
};

module.exports = { momoConfig };