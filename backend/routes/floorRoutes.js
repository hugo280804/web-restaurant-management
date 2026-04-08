const express = require("express");
const router = express.Router();
const { getFloors, createFloor, updateFloor, deleteFloor } = require("../controllers/floorController");

// GET all floors
router.get("/", getFloors);

// CREATE a floor
router.post("/", createFloor);

// UPDATE a floor
router.put("/:id", updateFloor);

// DELETE a floor
router.delete("/:id", deleteFloor);

module.exports = router;