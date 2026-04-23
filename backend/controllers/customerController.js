const db = require("../config/db");

// ================= GET ALL =================
exports.getAllCustomers = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM customer ORDER BY customer_ID DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET BY ID =================
exports.getCustomerById = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM customer WHERE customer_ID=?",
      [req.params.id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= CREATE =================
exports.createCustomer = async (req, res) => {
  try {
    let { name, phone, email } = req.body;

    if (!name || name.trim() === "") {
      name = "Khách lẻ";
    }

    const [result] = await db.query(
      "INSERT INTO customer(name, phone, email) VALUES (?, ?, ?)",
      [name, phone, email]
    );

    res.json({
      message: "Thêm thành công",
      customer_ID: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= UPDATE =================
exports.updateCustomer = async (req, res) => {
  try {
    const { name, phone, email } = req.body;

    await db.query(
      "UPDATE customer SET name=?, phone=?, email=? WHERE customer_ID=?",
      [name, phone, email, req.params.id]
    );

    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= DELETE =================
exports.deleteCustomer = async (req, res) => {
  try {
    await db.query(
      "DELETE FROM customer WHERE customer_ID=?",
      [req.params.id]
    );

    res.json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getCustomerSpent = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        c.customer_ID,
        c.name,
        c.phone,
        COALESCE(SUM(o.total_amount),0) AS total_spent
      FROM customer c
      LEFT JOIN \`order\` o 
        ON c.customer_ID = o.customer_ID
        AND o.status = 'Đã thanh toán'
      GROUP BY c.customer_ID
      ORDER BY total_spent DESC
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};