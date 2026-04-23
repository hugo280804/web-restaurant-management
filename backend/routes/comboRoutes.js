const express = require("express");
const router = express.Router();

const comboController = require("../controllers/comboController");

router.get("/", comboController.getAllCombos);
router.post("/", comboController.createCombo);
router.put("/:id", comboController.updateCombo);
router.delete("/:id", comboController.deleteCombo);

router.post("/add-menu", comboController.addMenuToCombo);
router.delete("/menu/:id", comboController.deleteMenuFromCombo);

module.exports = router;