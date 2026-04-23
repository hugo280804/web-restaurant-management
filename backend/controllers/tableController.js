const db = require("../config/db");

// GET tất cả bàn
const getTables = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT t.*, f.floor_name 
      FROM \`table\` t
      LEFT JOIN floor f ON t.floor_ID = f.floor_ID
    `);

    const mapped = rows.map(t => {
      let status = "Trống";

      if (t.current_order_id) {
        status = "Đang phục vụ";
      } 
      else if (t.status === "Đã đặt") {
        status = "Đã đặt";
      }

      return {
        ...t,
        status // 👈 QUAN TRỌNG
      };
    });

    res.json(mapped);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ADD bàn
const createTable = async (req, res) => {
  const { table_name, seats_number, floor_ID } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO \`table\` (table_name, seats_number, floor_ID, pos_x, pos_y)
       VALUES (?, ?, ?, 100, 100)`,
      [table_name, seats_number, floor_ID]
    );

    // 👉 lấy lại record vừa insert
    const [newTable] = await db.query(
      `SELECT * FROM \`table\` WHERE table_ID = ?`,
      [result.insertId]
    );

    res.json(newTable[0]); // 👈 trả object luôn
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