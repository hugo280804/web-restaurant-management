const express = require("express");
const {
  createPayment,
  momoIPN,
} = require("../controllers/momoController");

const router = express.Router();

router.post("/create", createPayment);
router.post("/ipn", momoIPN);

module.exports = router;