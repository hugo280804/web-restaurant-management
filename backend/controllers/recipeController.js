const db = require('../config/db');

// Lấy tất cả công thức kèm cost
exports.getAllRecipes = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT *
      FROM recipe_with_cost
      ORDER BY menu_ID, recipe_ID
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Thêm công thức
exports.createRecipe = async (req, res) => {
  const { menu_ID, ingredient_ID, quantity_required, unit } = req.body; // thêm unit
  try {
    const [result] = await db.query(
      `INSERT INTO recipe (menu_ID, ingredient_ID, quantity_required, unit)
       VALUES (?, ?, ?, ?)`,
      [menu_ID, ingredient_ID, quantity_required, unit] // thêm unit
    );
    res.json({ message: 'Recipe created', recipe_ID: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Sửa công thức
exports.updateRecipe = async (req, res) => {
  const { id } = req.params;
  const { menu_ID, ingredient_ID, quantity_required, unit } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE recipe 
       SET menu_ID = ?, ingredient_ID = ?, quantity_required = ?, unit = ?, updated_at = CURRENT_TIMESTAMP
       WHERE recipe_ID = ?`,
      [menu_ID, ingredient_ID, quantity_required, unit, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json({ message: 'Recipe updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Xóa công thức
exports.deleteRecipe = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM recipe WHERE recipe_ID = ?', [id]);
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.deleteByMenu = async (req, res) => {
  const { menu_ID } = req.params;

  try {
    const [result] = await db.query(
      'DELETE FROM recipe WHERE menu_ID = ?',
      [menu_ID]
    );

    res.json({
      message: 'Deleted all recipes of menu',
      affectedRows: result.affectedRows
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};