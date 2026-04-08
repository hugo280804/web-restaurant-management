const express = require("express");
const router = express.Router();
const { getTables, createTable, updateTable, deleteTable } = require("../controllers/tableController");

// GET all tables
router.get("/", getTables);

// CREATE a table
router.post("/", createTable);

// UPDATE a table
router.put("/:id", updateTable);

// DELETE a table
router.delete("/:id", deleteTable);

module.exports = router;