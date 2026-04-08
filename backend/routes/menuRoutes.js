const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const multer = require('multer');
const path = require('path');

// Cấu hình lưu file ảnh
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // folder lưu ảnh
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // giữ đuôi file
  }
});
const upload = multer({ storage });

// Các route
router.get('/', menuController.getAllMenu);
router.post('/', upload.single('image'), menuController.createMenu); // note 'image'
router.put('/:id', upload.single('image'), menuController.updateMenu); // update có thể đổi ảnh
router.delete('/:id', menuController.deleteMenu);

module.exports = router;