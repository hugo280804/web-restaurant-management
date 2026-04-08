// controllers/ingredientCategoryController.js
const db = require("../config/db");

// Lấy danh mục
exports.getAllCategories = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM ingredient_category");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Thêm danh mục
exports.createCategory = async (req, res) => {
  const { category_name, description } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO ingredient_category (category_name, description) VALUES (?, ?)",
      [category_name, description || null]
    );

    res.json({ message: "Category created", category_ID: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Sửa danh mục
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { category_name, description } = req.body;

  try {
    await db.query(
      "UPDATE ingredient_category SET category_name = ?, description = ? WHERE category_ID = ?",
      [category_name, description || null, id]
    );

    res.json({ message: "Category updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Xóa danh mục
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM ingredient_category WHERE category_ID = ?", [id]);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};