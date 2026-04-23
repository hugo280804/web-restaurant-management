const db = require("../config/db");

/* =========================
   GET ALL (FIX FULL)
========================= */
exports.getAll = async (req, res) => {
  try {
    const sql = `
      SELECT 
        es.employee_shift_ID,
        es.employee_ID,
        es.shift_ID,
        DATE(es.shift_date) AS shift_date,

        e.name AS employee_name,
        e.role AS role,

        s.shift_name,
        s.start_time,
        s.end_time

      FROM employee_shift es
      JOIN employee e ON e.employee_ID = es.employee_ID
      JOIN shift s ON s.shift_ID = es.shift_ID

      ORDER BY es.shift_date ASC, s.start_time ASC
    `;

    const [results] = await db.query(sql);

    res.json(results);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "DB error",
      detail: err.message
    });
  }
};

/* =========================
   CREATE ASSIGNMENT (FIX FULL)
========================= */
exports.create = async (req, res) => {
  try {
    let { employee_ID, shift_ID, shift_date } = req.body;

    if (!employee_ID || !shift_ID || !shift_date) {
      return res.status(400).json({ message: "Thiếu dữ liệu" });
    }

    // fix timezone + format YYYY-MM-DD
    shift_date = new Date(shift_date).toISOString().slice(0, 10);

    // 🔥 CHECK TRÙNG CA
    const checkSql = `
      SELECT * FROM employee_shift
      WHERE employee_ID = ? 
      AND shift_ID = ? 
      AND shift_date = ?
    `;

    const [check] = await db.query(checkSql, [
      employee_ID,
      shift_ID,
      shift_date
    ]);

    if (check.length > 0) {
      return res.status(400).json({
        message: "Nhân viên đã được phân ca này rồi"
      });
    }

    // INSERT
    const sql = `
      INSERT INTO employee_shift 
      (employee_ID, shift_ID, shift_date)
      VALUES (?, ?, ?)
    `;

    await db.query(sql, [
      employee_ID,
      shift_ID,
      shift_date
    ]);

    res.json({ message: "Assign OK" });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "DB error",
      detail: err.message
    });
  }
};

/* =========================
   DELETE (OPTION)
========================= */
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      "DELETE FROM employee_shift WHERE employee_shift_ID = ?",
      [id]
    );

    res.json({ message: "Deleted OK" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "DB error",
      detail: err.message
    });
  }
};