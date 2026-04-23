const express = require("express");
const router = express.Router();

const reportController = require("../controllers/reportController");

// dashboard tổng
router.get("/dashboard", reportController.getDashboard);

// filter theo ngày/tháng/năm
router.get("/dashboard-range", reportController.getDashboardByRange);

// customer taste
router.get("/customer-taste", reportController.getCustomerTaste);
router.get("/order-status", reportController.getOrderStatus);
router.get("/quick", reportController.getQuickReport);
router.get("/payment-method", reportController.getPaymentMethod);
router.get("/top-customers", reportController.getTopCustomers);
module.exports = router;