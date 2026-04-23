const express = require("express");
const router = express.Router();

const inventoryController = require("../controllers/inventoryController");

router.get("/", inventoryController.getInventory);
router.get("/transactions", inventoryController.getTransactions);

router.post("/import", inventoryController.importStock);
router.post("/export", inventoryController.exportStock);

module.exports = router;