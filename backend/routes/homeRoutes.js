const express = require("express");
const router = express.Router();

const homeController = require("../controllers/homeController");

const multer = require("multer");
const path = require("path");

/* ================= UPLOAD ================= */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

/* ================= ROUTES ================= */

// GET homepage (1 bài)
router.get("/", homeController.getHomeContent);

// GET list CMS
router.get("/list", homeController.getAllHomeContent);

// ADD
router.post("/", upload.single("banner"), homeController.createHomeContent);

router.put("/:id", upload.single("banner"), homeController.updateHomeContent);
// DELETE
router.delete("/:id", homeController.deleteHomeContent);
router.get("/:id", homeController.getHomeById);
module.exports = router;