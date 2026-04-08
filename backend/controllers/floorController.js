const db = require("../config/db");

// GET tất cả tầng
const getFloors = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM floor");
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ADD tầng mới
const createFloor = async (req, res) => {
  const { floor_name } = req.body;
  try {
    await db.query("INSERT INTO floor (floor_name) VALUES (?)", [floor_name]);
    res.json({ message: "Thêm tầng thành công" });
  } catch (err) {
    res.status(500).json(err);
  }
};

// UPDATE tên tầng
const updateFloor = async (req, res) => {
  const { floor_name } = req.body;
  try {
    await db.query("UPDATE floor SET floor_name=? WHERE floor_ID=?", [
      floor_name,
      req.params.id,
    ]);
    res.json({ message: "Cập nhật tầng thành công" });
  } catch (err) {
    res.status(500).json(err);
  }
};

// DELETE tầng
const deleteFloor = async (req, res) => {
  try {
    // Kiểm tra có bàn nào trên tầng không
    const [tables] = await db.query(
      "SELECT * FROM `table` WHERE floor_ID=?",
      [req.params.id]
    );
    if (tables.length > 0)
      return res.status(400).json({ message: "Còn bàn trên tầng này!" });

    await db.query("DELETE FROM floor WHERE floor_ID=?", [req.params.id]);
    res.json({ message: "Xóa tầng thành công" });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { getFloors, createFloor, updateFloor, deleteFloor };