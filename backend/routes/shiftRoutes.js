const express = require("express");
const router = express.Router();
const shiftController = require("../controllers/shiftController");

router.get("/", shiftController.getAllShifts);
router.post("/", shiftController.createShift);

module.exports = router;