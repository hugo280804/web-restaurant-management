const db = require("../config/db");

// GET ALL
exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM discount");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE
exports.create = async (req, res) => {
  try {
    const {
      name,
      type,
      menu_ID,
      code,
      discount_percent,
      discount_amount,
      start_date,
      end_date,
      usage_limit
    } = req.body;

    await db.query(
      `INSERT INTO discount 
      (name, type, menu_ID, code, discount_percent, discount_amount, start_date, end_date, usage_limit)
      VALUES (?,?,?,?,?,?,?,?,?)`,
      [name, type, menu_ID, code, discount_percent, discount_amount, start_date, end_date, usage_limit]
    );

    res.json({ message: "Created" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      name,
      type,
      menu_ID,
      code,
      discount_percent,
      discount_amount,
      start_date,
      end_date,
      usage_limit
    } = req.body;

    await db.query(
      `UPDATE discount SET
      name=?, type=?, menu_ID=?, code=?, discount_percent=?, discount_amount=?, start_date=?, end_date=?, usage_limit=?
      WHERE discount_ID=?`,
      [name, type, menu_ID, code, discount_percent, discount_amount, start_date, end_date, usage_limit, id]
    );

    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    await db.query("DELETE FROM discount WHERE discount_ID=?", [req.params.id]);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};