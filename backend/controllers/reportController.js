const db = require("../config/db");

// ================= DASHBOARD =================
exports.getDashboard = async (req, res) => {
  try {
      const [revenueToday] = await db.query(`
    SELECT IFNULL(SUM(total_amount),0) AS revenue
    FROM \`order\`
    WHERE created_at >= CURDATE()
    AND created_at < CURDATE() + INTERVAL 1 DAY
    AND status = 'Đã thanh toán'
`);
    const [totalOrders] = await db.query(`
      SELECT COUNT(*) AS total FROM \`order\`
    `);

    const [tables] = await db.query(`
      SELECT COUNT(*) AS total
      FROM \`table\`
      WHERE status = 'Đang phục vụ'
    `);

    const [topFood] = await db.query(`
      SELECT m.menu_name, SUM(od.quantity) AS total_sold
      FROM order_details od
      JOIN menu m ON od.menu_ID = m.menu_ID
      JOIN \`order\` o ON o.order_ID = od.order_ID
      WHERE o.status = 'Đã thanh toán'
      GROUP BY m.menu_ID
      ORDER BY total_sold DESC
      LIMIT 5
    `);

    const [chart] = await db.query(`
      SELECT DATE(created_at) AS date, SUM(total_amount) AS revenue
      FROM \`order\`
      WHERE status = 'Đã thanh toán'
      GROUP BY DATE(created_at)
      ORDER BY date
    `);

    const [lowStock] = await db.query(`
      SELECT i.ingredient_name, inv.quantity
      FROM inventory inv
      JOIN ingredient i ON inv.ingredient_ID = i.ingredient_ID
      WHERE inv.quantity <= inv.min_quantity_alert
    `);

    res.json({
      revenueToday: revenueToday[0].revenue,
      totalOrders: totalOrders[0].total,
      activeTables: tables[0].total,
      topFood,
      chart,
      lowStock
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// ================= RANGE DASHBOARD =================
function fixDate(dateStr) {
  if (!dateStr) return null;

  // nếu dạng MM/DD/YYYY → convert
  if (dateStr.includes("/")) {
    const [m, d, y] = dateStr.split("/");
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  return dateStr; // đã đúng YYYY-MM-DD
}

// ================= RANGE DASHBOARD =================
exports.getDashboardByRange = async (req, res) => {
  try {
    let { from, to } = req.query;

    // ✅ FIX FORMAT
    from = fixDate(from);
    to = fixDate(to);

    console.log("FROM:", from);
    console.log("TO:", to);

    // ❌ nếu thiếu ngày
    if (!from || !to) {
      return res.status(400).json({ error: "Thiếu from/to" });
    }

    // ===== QUERY CHUẨN =====
    const [revenue] = await db.query(`
      SELECT IFNULL(SUM(total_amount),0) AS revenue
      FROM \`order\`
      WHERE status = 'Đã thanh toán'
      AND created_at >= ?
      AND created_at < DATE_ADD(?, INTERVAL 1 DAY)
    `, [from, to]);

    const [orders] = await db.query(`
      SELECT COUNT(*) AS total
      FROM \`order\`
      WHERE created_at >= ?
      AND created_at < DATE_ADD(?, INTERVAL 1 DAY)
    `, [from, to]);

    const [chart] = await db.query(`
      SELECT DATE(created_at) AS date,
             SUM(total_amount) AS revenue
      FROM \`order\`
      WHERE status = 'Đã thanh toán'
      AND created_at >= ?
      AND created_at < DATE_ADD(?, INTERVAL 1 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date
    `, [from, to]);

    res.json({
      revenue: revenue[0].revenue,
      totalOrders: orders[0].total,
      chart
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
// ================= CUSTOMER TASTE (FIXED) =================
exports.getCustomerTaste = async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT 
        m.menu_name,
        SUM(od.quantity) AS total_sold
      FROM order_details od
      JOIN menu m ON od.menu_ID = m.menu_ID
      GROUP BY od.menu_ID
      ORDER BY total_sold DESC
      LIMIT 10
    `);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
exports.getOrderStatus = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT status, COUNT(*) AS total
      FROM \`order\`
      GROUP BY status
    `);

    res.json(rows);
  } catch (err) {
    console.error("ORDER STATUS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
exports.getQuickReport = async (req, res) => {
  const { type } = req.query;

  let condition = "";

  if (type === "today") {
  condition = `
    created_at >= CURDATE()
    AND created_at < CURDATE() + INTERVAL 1 DAY
  `;
}

  if (type === "week") {
    condition = "YEARWEEK(created_at) = YEARWEEK(NOW())";
  }

  if (type === "month") {
    condition = "MONTH(created_at) = MONTH(NOW())";
  }

  if (type === "year") {
    condition = "YEAR(created_at) = YEAR(NOW())";
  }

  const [revenue] = await db.query(`
    SELECT IFNULL(SUM(total_amount),0) as revenue
    FROM \`order\`
    WHERE status='Đã thanh toán' AND ${condition}
  `);

  const [orders] = await db.query(`
    SELECT COUNT(*) as totalOrders
    FROM \`order\`
    WHERE ${condition}
  `);

  const [chart] = await db.query(`
    SELECT DATE(created_at) as date, SUM(total_amount) as revenue
    FROM \`order\`
    WHERE status='Đã thanh toán' AND ${condition}
    GROUP BY DATE(created_at)
  `);

  res.json({
    revenue: revenue[0].revenue,
    totalOrders: orders[0].totalOrders,
    chart
  });
};
exports.getPaymentMethod = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT payment_method, COUNT(*) as total
      FROM \`order\`
      GROUP BY payment_method
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getTopCustomers = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        customer_ID,
        SUM(total_amount) as total_spent,
        COUNT(*) as total_orders
      FROM \`order\`
      WHERE customer_ID IS NOT NULL
      GROUP BY customer_ID
      ORDER BY total_spent DESC
      LIMIT 5
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};