const db = require('../config/db');

// Lấy tất cả danh mục
exports.getAllCategory = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM category');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Thêm danh mục
exports.createCategory = async (req, res) => {
  const { category_name, category_type } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO category (category_name, category_type) VALUES (?, ?)',
      [category_name, category_type]
    );
    res.json({ message: 'Category created', category_ID: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Sửa danh mục
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { category_name, category_type } = req.body;
  try {
    await db.query(
      'UPDATE category SET category_name = ?, category_type = ? WHERE category_ID = ?',
      [category_name, category_type, id]
    );
    res.json({ message: 'Category updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Xóa danh mục
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM category WHERE category_ID = ?', [id]);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};