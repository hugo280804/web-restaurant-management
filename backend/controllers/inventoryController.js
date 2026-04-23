const db = require("../config/db");

// ================== LẤY TỒN KHO ==================
exports.getInventory = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        i.inventory_ID,
        i.ingredient_ID,
        ing.ingredient_name,
        ing.unit,
        i.quantity,
        i.min_quantity_alert
      FROM inventory i
      JOIN ingredient ing ON i.ingredient_ID = ing.ingredient_ID
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================== NHẬP KHO ==================
exports.importStock = async (req, res) => {
  const { ingredient_ID, quantity, employee_ID } = req.body;

  try {
    // 1. cộng kho
    await db.query(
      `UPDATE inventory 
       SET quantity = quantity + ? 
       WHERE ingredient_ID = ?`,
      [quantity, ingredient_ID]
    );

    // 2. ghi lịch sử
    await db.query(
      `INSERT INTO transaction 
      (ingredient_ID, type, quantity, employee_ID, date)
      VALUES (?, 'Nhập', ?, ?, NOW())`,
      [ingredient_ID, quantity, employee_ID]
    );

    res.json({ message: "Import success" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================== XUẤT KHO ==================
exports.exportStock = async (req, res) => {
  const { ingredient_ID, quantity, employee_ID } = req.body;

  try {
    // check tồn kho
    const [rows] = await db.query(
      "SELECT quantity FROM inventory WHERE ingredient_ID=?",
      [ingredient_ID]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Không có kho" });
    }

    if (rows[0].quantity < quantity) {
      return res.status(400).json({ message: "Không đủ hàng trong kho" });
    }

    // trừ kho
    await db.query(
      `UPDATE inventory 
       SET quantity = quantity - ? 
       WHERE ingredient_ID = ?`,
      [quantity, ingredient_ID]
    );

    // log
    await db.query(
      `INSERT INTO transaction 
      (ingredient_ID, type, quantity, employee_ID, date)
      VALUES (?, 'Xuất', ?, ?, NOW())`,
      [ingredient_ID, quantity, employee_ID]
    );

    res.json({ message: "Export success" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================== LỊCH SỬ ==================
exports.getTransactions = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        t.transaction_ID,
        t.ingredient_ID,
        ing.ingredient_name,
        t.type,
        t.quantity,
        t.employee_ID,
        t.date
      FROM transaction t
      JOIN ingredient ing ON t.ingredient_ID = ing.ingredient_ID
      ORDER BY t.transaction_ID DESC
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};