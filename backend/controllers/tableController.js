const db = require("../config/db");

// GET tất cả bàn
const getTables = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT t.*, f.floor_name 
       FROM \`table\` t
       LEFT JOIN floor f ON t.floor_ID = f.floor_ID`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ADD bàn
const createTable = async (req, res) => {
  const { table_name, seats_number, floor_ID } = req.body;
  try {
    await db.query(
      `INSERT INTO \`table\` (table_name, seats_number, floor_ID, pos_x, pos_y)
       VALUES (?, ?, ?, 100, 100)`,
      [table_name, seats_number, floor_ID]
    );
    res.json({ message: "Thêm bàn thành công" });
  } catch (err) {
    res.status(500).json(err);
  }
};

// UPDATE bàn
const updateTable = async (req, res) => {
  const { table_name, seats_number, floor_ID, pos_x, pos_y } = req.body;
  try {
    await db.query(
      `UPDATE \`table\`
       SET table_name=?, seats_number=?, floor_ID=?, pos_x=?, pos_y=?
       WHERE table_ID=?`,
      [table_name, seats_number, floor_ID, pos_x, pos_y, req.params.id]
    );
    res.json({ message: "Cập nhật bàn thành công" });
  } catch (err) {
    res.status(500).json(err);
  }
};

// DELETE bàn
const deleteTable = async (req, res) => {
  try {
    await db.query("DELETE FROM `table` WHERE table_ID=?", [req.params.id]);
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { getTables, createTable, updateTable, deleteTable };