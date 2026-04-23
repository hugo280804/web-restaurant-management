const db = require("../config/db");

// GET ALL
exports.getReservations = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT r.*, c.name, t.table_name
      FROM reservations r
      LEFT JOIN customer c ON r.customer_ID = c.customer_ID
      LEFT JOIN \`table\` t ON r.table_ID = t.table_ID
      ORDER BY r.reservation_time DESC
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
};

// CREATE
exports.createReservation = async (req, res) => {
  try {
    const { name, phone, people, reservation_time } = req.body;

    // 1. tìm customer
    let [cus] = await db.query(
      "SELECT * FROM customer WHERE phone = ?",
      [phone]
    );

    let customer_ID;

    if (cus.length > 0) {
      customer_ID = cus[0].customer_ID;
    } else {
      const [newCus] = await db.query(
        "INSERT INTO customer (name, phone) VALUES (?, ?)",
        [name, phone]
      );
      customer_ID = newCus.insertId;
    }

    // 2. tìm bàn phù hợp
    const [tables] = await db.query(
      "SELECT * FROM `table` WHERE seats_number >= ? AND status = 'Trống' LIMIT 1",
      [people]
    );

    if (tables.length === 0) {
      return res.json({ message: "Hết bàn phù hợp" });
    }

    const table_ID = tables[0].table_ID;

    // 3. tạo reservation
    await db.query(
      `INSERT INTO reservations 
      (customer_ID, phone, people, reservation_time, table_ID, status)
      VALUES (?, ?, ?, ?, ?, 'Đã đặt')`,
      [customer_ID, phone, people, reservation_time, table_ID]
    );

    res.json({ message: "Đặt bàn thành công" });

  } catch (err) {
    res.status(500).json(err);
  }
};