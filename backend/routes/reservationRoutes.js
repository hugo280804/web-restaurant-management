const express = require("express");
const router = express.Router();
const controller = require("../controllers/reservationController");

router.get("/", controller.getReservations);
router.post("/", controller.createReservation);

module.exports = router;