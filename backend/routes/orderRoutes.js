const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// ===== KITCHEN (ĐỂ LÊN TRÊN) =====
router.get("/details/all", orderController.getAllOrderItemsForKitchen);
router.put("/details/:id/status", orderController.updateItemStatus);

// ===== ORDER =====
router.get("/", orderController.getAllOrders);
router.post("/", orderController.createOrder);

router.get("/table/:tableID", orderController.getOrderByTable);

router.get("/:orderID/items", orderController.getOrderItems);
router.post("/:orderID/items", orderController.addItemToOrder);

router.put("/items/:id", orderController.updateOrderItem);
router.delete("/items/:id", orderController.deleteOrderItem);
// Cập nhật tất cả món trong 1 order
router.put("/:orderID/status/all", orderController.updateAllItemsStatus);

router.put("/:orderID/pay", orderController.payOrder);
router.get("/:id/print", orderController.printOrder);

module.exports = router;