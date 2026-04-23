const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT * FROM employee WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Sai tài khoản" });
    }

    const user = rows[0];

    // ⚠️ nếu DB chưa hash thì dùng so sánh thường
    // const isMatch = password === user.password;

    // ✅ nếu đã hash thì dùng dòng dưới
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Sai mật khẩu" });
    }

    const token = jwt.sign(
      {
        id: user.employee_ID,
        role: user.role,
      },
      "SECRET_KEY",
      { expiresIn: "8h" }
    );

    res.json({
      token,
      user: {
        id: user.employee_ID,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json(err);
  }
};