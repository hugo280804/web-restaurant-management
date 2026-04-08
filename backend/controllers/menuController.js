const db = require('../config/db');
const path = require('path');

// Lấy tất cả menu, join với category
exports.getAllMenu = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT m.*, c.category_name 
       FROM menu m
       LEFT JOIN category c ON m.category_ID = c.category_ID`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Thêm món ăn có upload ảnh
exports.createMenu = async (req, res) => {
  const { menu_name, category_ID, price, status } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null; // Lấy file nếu có

  try {
    const [result] = await db.query(
      'INSERT INTO menu (menu_name, category_ID, price, status, image_url) VALUES (?, ?, ?, ?, ?)',
      [menu_name, category_ID, price, status, image_url]
    );
    res.json({ message: 'Menu created', menu_ID: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Sửa món ăn có upload ảnh
exports.updateMenu = async (req, res) => {
  const { id } = req.params;
  const { menu_name, category_ID, price, status } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    await db.query(
      'UPDATE menu SET menu_name = ?, category_ID = ?, price = ?, status = ?, image_url = COALESCE(?, image_url) WHERE menu_ID = ?',
      [menu_name, category_ID, price, status, image_url, id]
    );
    res.json({ message: 'Menu updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Xóa món ăn
exports.deleteMenu = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM menu WHERE menu_ID = ?', [id]);
    res.json({ message: 'Menu deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};