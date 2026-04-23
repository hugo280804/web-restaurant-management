const db = require("../config/db");

// lấy ca làm
exports.getAllShifts = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM shift");
    res.json(rows);
  } catch (error) {
    console.error("SHIFT ERROR:", error); // 👈 QUAN TRỌNG
    res.status(500).json({
      message: "Server error",
      error: error.message, // 👈 thêm dòng này để debug
    });
  }
};
// thêm ca
exports.createShift = (req, res) => {
  const { shift_name, start_time, end_time } = req.body;

  const sql = "INSERT INTO shift (shift_name, start_time, end_time) VALUES (?, ?, ?)";
  db.query(sql, [shift_name, start_time, end_time], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "OK", id: result.insertId });
  });
};