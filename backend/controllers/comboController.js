const db = require("../config/db");

/* =========================
   GET ALL COMBOS (GROUPED)
========================= */
exports.getAllCombos = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        c.combo_ID,
        c.combo_name,
        c.price AS combo_price,
        cd.combo_detail_ID,
        cd.quantity,
        m.menu_ID,
        m.menu_name,
        m.price AS menu_price
      FROM combo c
      LEFT JOIN combo_detail cd 
        ON c.combo_ID = cd.combo_ID
      LEFT JOIN menu m 
        ON cd.menu_ID = m.menu_ID
      ORDER BY c.combo_ID
    `);

    const map = new Map();

    rows.forEach(r => {
      if (!map.has(r.combo_ID)) {
        map.set(r.combo_ID, {
          combo_ID: r.combo_ID,
          combo_name: r.combo_name,
          combo_price: r.combo_price,
          items: []
        });
      }

      if (r.menu_ID) {
        map.get(r.combo_ID).items.push({
          combo_detail_ID: r.combo_detail_ID,
          menu_ID: r.menu_ID,
          menu_name: r.menu_name,
          menu_price: r.menu_price,
          quantity: r.quantity
        });
      }
    });

    res.json(Array.from(map.values()));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   CREATE COMBO
========================= */
exports.createCombo = async (req, res) => {
  const { combo_name, price } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO combo (combo_name, price) VALUES (?, ?)`,
      [combo_name, price]
    );

    res.json({ combo_ID: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   UPDATE COMBO
========================= */
exports.updateCombo = async (req, res) => {
  const { id } = req.params;
  const { combo_name, price } = req.body;

  try {
    await db.query(
      `UPDATE combo SET combo_name=?, price=? WHERE combo_ID=?`,
      [combo_name, price, id]
    );

    res.json({ message: "updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   DELETE COMBO
========================= */
exports.deleteCombo = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(`DELETE FROM combo_detail WHERE combo_ID=?`, [id]);
    await db.query(`DELETE FROM combo WHERE combo_ID=?`, [id]);

    res.json({ message: "deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   ADD MENU TO COMBO
========================= */
exports.addMenuToCombo = async (req, res) => {
  const { combo_ID, menu_ID, quantity } = req.body;

  try {
    const [check] = await db.query(
      `SELECT * FROM combo_detail WHERE combo_ID=? AND menu_ID=?`,
      [combo_ID, menu_ID]
    );

    if (check.length > 0) {
      await db.query(
        `UPDATE combo_detail 
         SET quantity = quantity + ?
         WHERE combo_ID=? AND menu_ID=?`,
        [quantity, combo_ID, menu_ID]
      );
    } else {
      await db.query(
        `INSERT INTO combo_detail (combo_ID, menu_ID, quantity)
         VALUES (?, ?, ?)`,
        [combo_ID, menu_ID, quantity]
      );
    }

    res.json({ message: "ok" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   DELETE MENU FROM COMBO
========================= */
exports.deleteMenuFromCombo = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(
      `DELETE FROM combo_detail WHERE combo_detail_ID=?`,
      [id]
    );

    res.json({ message: "deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};