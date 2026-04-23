const db = require("../config/db");

/* ================= GET HOME ================= */
exports.getAllHomeContent = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM home_content");
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.getHomeContent = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM home_content LIMIT 1");
    return res.json(rows[0]);
  } catch (err) {
    return res.status(500).json(err);
  }
};

/* ================= ADD HOME ================= */
exports.createHomeContent = async (req, res) => {
  try {
    const { title, description } = req.body;

    let imagePath = "";

    if (req.file && req.file.filename) {
      imagePath = "/uploads/" + req.file.filename;
    }

    const sql = `
      INSERT INTO home_content (title, description, banner_url)
      VALUES (?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      title || "",
      description || "",
      imagePath
    ]);

    res.json({
      message: "Thêm thành công",
      id: result.insertId
    });

  } catch (err) {
    console.log("CREATE ERROR:", err);
    res.status(500).json({ message: "Lỗi tạo dữ liệu", error: err.message });
  }
};
/* ================= UPDATE HOME ================= */
exports.updateHomeContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const [rows] = await db.query(
      "SELECT * FROM home_content WHERE id=?",
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Không tìm thấy dữ liệu" });
    }

    const old = rows[0];

    let imagePath = old.banner_url;

    if (req.file && req.file.filename) {
      imagePath = "/uploads/" + req.file.filename;
    }

    await db.query(
      `UPDATE home_content 
       SET title=?, description=?, banner_url=? 
       WHERE id=?`,
      [
        title || old.title,
        description || old.description,
        imagePath,
        id
      ]
    );

    res.json({ message: "Cập nhật thành công" });

  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json({ message: "Lỗi update", error: err.message });
  }
};

/* ================= DELETE HOME ================= */
exports.deleteHomeContent = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM home_content WHERE id=?", [id]);

    res.json({ message: "Xóa thành công" });

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
exports.getHomeById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM home_content WHERE id=?",
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({
        message: "Không tìm thấy dữ liệu"
      });
    }

    const data = rows[0];

    res.json({
      ...data,
      banner_url: data.banner_url || null
    });

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};