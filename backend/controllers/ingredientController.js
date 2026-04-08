// controllers/ingredientController.js
const db = require('../config/db');

// ===== LẤY DANH SÁCH =====
exports.getAllIngredients = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        i.ingredient_ID,
        i.ingredient_name,
        i.unit,
        i.quantity,
        i.price, -- 👈 THÊM DÒNG NÀY
        DATE(i.import_date) AS import_date,
        DATE(i.expiry_date) AS expiry_date,
        i.category_ID,
        c.category_name
      FROM ingredient i
      LEFT JOIN ingredient_category c 
      ON i.category_ID = c.category_ID
      ORDER BY i.ingredient_ID DESC
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===== THÊM =====
exports.createIngredient = async (req, res) => {
  const { 
    ingredient_name, 
    unit, 
    import_date, 
    expiry_date, 
    entered_by, 
    quantity,
    category_ID,
    price // 👈 thêm
  } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO ingredient 
      (ingredient_name, unit, quantity, price, import_date, expiry_date, entered_by, category_ID) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ingredient_name,
        unit,
        quantity || 0,
        price || 0, // 👈 thêm
        import_date || null,
        expiry_date || null,
        entered_by || null,
        category_ID || null
      ]
    );

    res.json({ message: "Ingredient created", ingredient_ID: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ===== SỬA =====
exports.updateIngredient = async (req, res) => {
  const { id } = req.params;
  const { 
    ingredient_name, 
    unit, 
    quantity,
    price, // 👈 thêm
    import_date, 
    expiry_date, 
    entered_by, 
    category_ID
  } = req.body;

  try {
    await db.query(
      `UPDATE ingredient 
       SET ingredient_name = ?, unit = ?, quantity = ?, price = ?, 
           import_date = ?, expiry_date = ?, entered_by = ?, category_ID = ?
       WHERE ingredient_ID = ?`,
      [
        ingredient_name,
        unit,
        quantity || 0,
        price || 0, // 👈 thêm
        import_date || null,
        expiry_date || null,
        entered_by || null,
        category_ID || null,
        id
      ]
    );

    res.json({ message: "Ingredient updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ===== XÓA =====
exports.deleteIngredient = async (req, res) => {
  try {
    await db.query('DELETE FROM ingredient WHERE ingredient_ID=?', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};