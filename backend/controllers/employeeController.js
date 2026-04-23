const db = require("../config/db");
const bcrypt = require("bcrypt");
// GET ALL EMPLOYEES
exports.getEmployees = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM employee");
  res.json(rows);
};

// CREATE EMPLOYEE
exports.createEmployee = async (req, res) => {
  try {
    const { name, role, username, password, contact } = req.body;

    // ❌ không cho tạo user không có password
    if (!password || password.trim() === "") {
      return res.status(400).json({ message: "Password is required" });
    }

    // 🔥 hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO employee (name, role, username, password, contact)
       VALUES (?, ?, ?, ?, ?)`,
      [name, role, username, hashedPassword, contact]
    );

    res.json({ message: "Employee created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating employee" });
  }
};

// UPDATE EMPLOYEE
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, username, password, contact, status } = req.body;

    let sql = `
      UPDATE employee 
      SET name=?, role=?, username=?, contact=?, status=?
    `;

    let params = [name, role, username, contact, status];

    // 🔥 nếu có nhập password mới → hash luôn
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);

      sql += `, password=?`;
      params.push(hashedPassword);
    }

    sql += ` WHERE employee_ID=?`;
    params.push(id);

    await db.query(sql, params);

    res.json({ message: "Update employee success" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error update employee" });
  }
};
// DELETE EMPLOYEE
exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;

  await db.query(
    `DELETE FROM employee WHERE employee_ID=?`,
    [id]
  );

  res.json({ message: "Deleted" });
};