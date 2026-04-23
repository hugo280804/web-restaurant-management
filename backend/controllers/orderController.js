const db = require("../config/db");
const { updateIngredient } = require("../helpers/inventoryHelper"); 
const { randomUUID } = require("crypto");
const updateTotal = async (orderID) => {
  const sql = `
    UPDATE \`order\`
    SET total_amount = (
      SELECT IFNULL(SUM(quantity * price),0)
      FROM order_details
      WHERE order_ID = ?
    )
    WHERE order_ID = ?
  `;
  await db.query(sql, [orderID, orderID]);
};

// ===== CREATE ORDER =====
exports.createOrder = async (req, res) => {
  try {
    const { table_ID, employee_ID, phone } = req.body;

    let customerID = null;

    // ========================
    // 1. XỬ LÝ CUSTOMER + PHONE
    // ========================
    if (phone && phone.trim() !== "") {
      const [cus] = await db.query(
        "SELECT customer_ID FROM customer WHERE phone=?",
        [phone]
      );

      if (cus.length > 0) {
        customerID = cus[0].customer_ID;

        // 🔥 luôn update phone mới nhất
        await db.query(
          "UPDATE customer SET phone=? WHERE customer_ID=?",
          [phone, customerID]
        );
      } else {
        const [newCus] = await db.query(
          "INSERT INTO customer (name, phone) VALUES (?,?)",
          ["Khách lẻ", phone]
        );
        customerID = newCus.insertId;
      }
    }

    // ========================
    // 2. CHECK ORDER CŨ
    // ========================
    const [rows] = await db.query(
      "SELECT * FROM `order` WHERE table_ID=? AND status!='Đã thanh toán'",
      [table_ID]
    );

    if (rows.length > 0) {
      const orderID = rows[0].order_ID;

      // 🔥 UPDATE CUSTOMER CHO ORDER CŨ
      if (customerID) {
        await db.query(
          "UPDATE `order` SET customer_ID=? WHERE order_ID=?",
          [customerID, orderID]
        );
      }

      // 🔥 FIX QUAN TRỌNG: luôn sync lại phone vào customer
      if (phone && customerID) {
        await db.query(
          "UPDATE customer SET phone=? WHERE customer_ID=?",
          [phone, customerID]
        );
      }

      return res.json({ order_ID: orderID });
    }

    // ========================
    // 3. TẠO ORDER MỚI
    // ========================
    const [result] = await db.query(
      `INSERT INTO \`order\`
      (table_ID, employee_ID, customer_ID, status, total_amount)
      VALUES (?,?,?, 'Chờ xác nhận',0)`,
      [table_ID, employee_ID, customerID]
    );

    // ========================
    // 4. UPDATE TABLE
    // ========================
    await db.query(
      `UPDATE \`table\`
      SET current_order_id = ?,
          status = 'Đang phục vụ'
      WHERE table_ID = ?`,
      [result.insertId, table_ID]
    );

    res.json({ order_ID: result.insertId });

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

// ===== GET ORDER BY TABLE =====
exports.getOrderByTable = async (req, res) => {
  try {
    const tableID = req.params.tableID;

    const [orders] = await db.query(
      "SELECT * FROM `order` WHERE table_ID=? AND status!='Đã thanh toán'",
      [tableID]
    );

    if (!orders.length) return res.json(null);

    const order = orders[0];

    const [items] = await db.query(`
      SELECT 
      od.order_detail_ID,
      od.order_ID,
      od.menu_ID,
      od.quantity,
      od.price,
      od.note_from_waiter,
      od.note_from_kitchen,
      od.status,
      m.menu_name
    FROM order_details od
    JOIN menu m ON od.menu_ID = m.menu_ID
    WHERE od.order_ID = ?
    `, [order.order_ID]);

    // 👉 lấy SĐT
    const [cus] = await db.query(
      "SELECT phone FROM customer WHERE customer_ID=?",
      [order.customer_ID]
    );

    // 🔥 FIX: trả đúng tên field cho frontend
    order.phone = cus[0]?.phone || "";
    order.payment_method = order.payment_method || "";
    order.discount_amount = order.discount_amount || 0;

    order.order_details = items;

    res.json(order);

  } catch (err) {
    res.status(500).json(err);
  }
};

// ===== GET ALL ORDERS =====
exports.getAllOrders = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        o.order_ID,
        o.table_ID,
        t.table_name,
        o.employee_ID,
        e.name AS employee_name,

        -- 🔥 lấy 1 NV bếp (MIN)
        MIN(ke.name) AS kitchen_employee_name,

        o.status,
        o.total_amount,
        o.discount_amount,
        o.payment_method,
        o.created_at

      FROM \`order\` o
      LEFT JOIN \`table\` t ON o.table_ID = t.table_ID
      LEFT JOIN employee e ON o.employee_ID = e.employee_ID

      LEFT JOIN order_details od ON o.order_ID = od.order_ID
      LEFT JOIN employee ke ON od.employee_kitchen_ID = ke.employee_ID

      GROUP BY o.order_ID
      ORDER BY o.created_at DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("GET ORDERS ERROR:", err);
    res.status(500).json(err);
  }
};
// ===== GET ORDER ITEMS =====
exports.getOrderItems = async (req, res) => {
  try {
    const orderID = req.params.orderID;

    const [rows] = await db.query(`
      SELECT 
        od.*,
        m.menu_name,
        ek.name AS kitchen_name
      FROM order_details od
      JOIN menu m ON od.menu_ID = m.menu_ID
      LEFT JOIN employee ek 
        ON od.employee_kitchen_ID = ek.employee_ID
      WHERE od.order_ID = ?
    `, [orderID]);

    res.json(rows);
  } catch (err) {
    console.error("GET ITEMS ERROR:", err);
    res.status(500).json(err);
  }
};
// ===== ADD ITEM TO ORDER =====
exports.addItemToOrder = async (req, res) => {
  try {
    const orderID = req.params.orderID;
    const { menu_ID, quantity, note, price } = req.body;

    // ===== 1. kiểm tra món đã tồn tại chưa =====
    const [rows] = await db.query(
      "SELECT * FROM order_details WHERE order_ID=? AND menu_ID=?",
      [orderID, menu_ID]
    );

    // ===== 2. nếu đã tồn tại → CỘNG DỒN SỐ LƯỢNG =====
    if (rows.length > 0) {
      await db.query(
        `UPDATE order_details 
          SET quantity = ?,
    pendingQty = ?
        WHERE order_ID=? AND menu_ID=?`,
        [quantity, quantity, orderID, menu_ID]
      );
      await updateTotal(orderID);

      return res.json({
        message: "Cộng thêm số lượng thành công"
      });
    }

    // ===== 3. nếu chưa có → thêm món mới =====
    await db.query(
      `INSERT INTO order_details 
      (order_ID, menu_ID, quantity, note_from_waiter, price, status, pendingQty, cookingQty, doneQty) 
      VALUES (?,?,?,?,?, 'Chờ nấu', ?,0,0)`,
      [orderID, menu_ID, quantity, note || "", price, quantity]
    );

    await updateTotal(orderID);

    res.json({
      message: "Thêm món thành công"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Lỗi thêm món",
      error: err.message
    });
  }
};
// ===== UPDATE ORDER ITEM =====
exports.updateOrderItem = async (req, res) => {
  try {
    const itemID = req.params.id;
    const { quantity } = req.body;

    const qty = Number(quantity);

    // lấy số cũ
    const [rows] = await db.query(
      "SELECT quantity, pendingQty FROM order_details WHERE order_detail_ID=?",
      [itemID]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Không tìm thấy món" });
    }

    const oldQty = rows[0].quantity;
    const diff = qty - oldQty;

    await db.query(
      `
      UPDATE order_details 
      SET quantity = ?,
          pendingQty = pendingQty + ?
      WHERE order_detail_ID = ?
      `,
      [qty, diff, itemID]
    );

    res.json({ message: "Cập nhật thành công", quantity: qty });

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};
// ===== DELETE ORDER ITEM =====
exports.deleteOrderItem = async (req, res) => {
  try {
    const itemID = req.params.id;

    const [rows] = await db.query(
      "SELECT order_ID FROM order_details WHERE order_detail_ID=?",
      [itemID]
    );
    const orderID = rows[0]?.order_ID;

    await db.query("DELETE FROM order_details WHERE order_detail_ID=?", [itemID]);
    if (orderID) await updateTotal(orderID);

    res.json({ message: "Xóa món thành công" });
  } catch (err) {
    res.status(500).json(err);
  }
};

// ===== PAY ORDER =====
exports.payOrder = async (req, res) => {
  try {
    const { orderID } = req.params;
    let { payment_method, discount_amount, phone } = req.body;

    console.log("PAYLOAD:", req.body);

    if (payment_method !== "Tiền mặt" && payment_method !== "Chuyển khoản") {
      payment_method = "Tiền mặt";
    }

    // 1. Lấy table_ID từ order
    const [orderRows] = await db.query(
      "SELECT table_ID FROM `order` WHERE order_ID=?",
      [orderID]
    );

    const tableID = orderRows[0]?.table_ID;

    // 2. Update order
    await db.query(
      `UPDATE \`order\`
       SET payment_method = ?, discount_amount = ?, status='Đã thanh toán'
       WHERE order_ID = ?`,
      [payment_method, discount_amount || 0, orderID]
    );
          await db.query(
        `UPDATE \`table\`
        SET current_order_id = NULL,
            status = 'Trống'
        WHERE table_ID = ?`,
        [tableID]
      );

    // 3. update phone
   
    // 🔥 4. RESET BÀN (QUAN TRỌNG NHẤT)
    if (tableID) {
      await db.query(
        `UPDATE \`table\`
         SET status='Trống',
             current_order_id=NULL
         WHERE table_ID=?`,
        [tableID]
      );
    }

    res.json({ message: "Thanh toán thành công" });

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};
// controllers/orderController.js
exports.getAllOrderItemsForKitchen = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
    od.order_detail_ID,
    od.order_ID,
    od.menu_ID,
    od.quantity,
    od.note_from_waiter,
    od.note_from_kitchen,
    od.status AS item_status,
    od.pendingQty,
    od.cookingQty,
    od.doneQty,
    o.table_ID,
    COALESCE(t.table_name, 'Chưa xác định') AS table_name,
    o.status AS order_status,
    o.created_at,
    o.employee_ID,
    COALESCE(e.name, 'Chưa xác định') AS employee_name,
    m.menu_name,
    m.price
FROM order_details od
JOIN \`order\` o ON od.order_ID = o.order_ID
JOIN menu m ON od.menu_ID = m.menu_ID
LEFT JOIN employee e ON o.employee_ID = e.employee_ID
LEFT JOIN \`table\` t ON o.table_ID = t.table_ID
ORDER BY o.created_at ASC, od.order_detail_ID ASC
    `);

    // Fix NULL → số hợp lệ
    // Fix NULL → số hợp lệ
rows.forEach(r => {
  r.pendingQty = r.pendingQty ?? r.quantity ?? 0;
  r.cookingQty = r.cookingQty ?? 0;
  r.doneQty = r.doneQty ?? 0;
});

// ===== 🔥 THÊM ĐOẠN NÀY NGAY ĐÂY =====
for (let item of rows) {
  let pending = item.pendingQty ?? item.quantity ?? 0;

  let canCook = true;
  let missing = [];

  if (pending > 0) {
    const [recipe] = await db.query(
      `SELECT r.ingredient_ID, r.quantity_required, r.unit,
              i.quantity as current_qty, i.unit as ing_unit,
              i.ingredient_name
       FROM recipe r
       JOIN ingredient i ON i.ingredient_ID = r.ingredient_ID
       WHERE r.menu_ID=?`,
      [item.menu_ID]
    );

    for (let r of recipe) {
      let required = Number(r.quantity_required) * pending;
      let current = Number(r.current_qty);

      const ru = r.unit || "g";
      const iu = r.ing_unit || "g";

      if (ru === "g" && iu === "kg") required /= 1000;
      else if (ru === "kg" && iu === "g") required *= 1000;
      else if (ru === "ml" && iu === "l") required /= 1000;
      else if (ru === "l" && iu === "ml") required *= 1000;

     if (current < required) {
          canCook = false;

        missing.push({
          name: r.ingredient_name,
          thiếu: +(required - current).toFixed(2),
          còn: +current.toFixed(2),
          cần: +required.toFixed(2),
          đơn_vị: iu
        });
      }
    }
  }

  item.canCook = canCook;
  item.missingIngredients = missing;
}

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi lấy dữ liệu orders', error: err.message });
  }
};
// ===== UPDATE ALL ITEMS IN AN ORDER =====
// controllers/orderController.js

// ===== UPDATE ALL ITEMS IN AN ORDER (WITH INVENTORY) =====
exports.updateAllItemsStatus = async (req, res) => {
  const conn = await db.getConnection();

  try {
    const orderID = req.params.orderID;
    const { action } = req.body;

    await conn.beginTransaction();

    const [items] = await conn.query(
      "SELECT * FROM order_details WHERE order_ID=?",
      [orderID]
    );

    if (!items.length) {
      await conn.rollback();
      return res.status(404).json({ message: "Không có món nào" });
    }

    // =============================
    // ✅ STEP 1: CHECK NGUYÊN LIỆU TRƯỚC
    // =============================
    if (action === "pending") {
      for (let item of items) {
        let pending = item.pendingQty ?? item.quantity ?? 0;
        if (pending <= 0) continue;

        const [recipe] = await conn.query(
          `SELECT r.ingredient_ID, r.quantity_required, r.unit,
                  i.quantity as current_qty, i.unit as ing_unit
           FROM recipe r
           JOIN ingredient i ON i.ingredient_ID = r.ingredient_ID
           WHERE r.menu_ID=?`,
          [item.menu_ID]
        );

        for (let r of recipe) {
          let required = Number(r.quantity_required) * pending;
          let current = Number(r.current_qty);

          const ru = r.unit || "g";
          const iu = r.ing_unit || "g";

          // convert về base
          if (ru === "g" && iu === "kg") required /= 1000;
          else if (ru === "kg" && iu === "g") required *= 1000;
          else if (ru === "ml" && iu === "l") required /= 1000;
          else if (ru === "l" && iu === "ml") required *= 1000;

          if (current < required) {
            await conn.rollback();
            return res.status(400).json({
              message: `Món ${item.menu_ID} thiếu NL ${r.ingredient_ID} (còn ${current}, cần ${required})`
            });
          }
        }
      }
    }

    // =============================
    // ✅ STEP 2: XỬ LÝ
    // =============================
    for (let item of items) {
      let pending = item.pendingQty ?? item.quantity ?? 0;
      let cooking = item.cookingQty ?? 0;
      let done = item.doneQty ?? 0;

      if (pending === 0 && cooking === 0 && done === 0) {
        pending = item.quantity;
      }

      if (action === "pending") {
        const move = pending;

        if (move > 0) {
          const [recipe] = await conn.query(
            `SELECT r.ingredient_ID, r.quantity_required, r.unit,
                    i.unit as ing_unit
             FROM recipe r
             JOIN ingredient i ON i.ingredient_ID = r.ingredient_ID
             WHERE r.menu_ID=?`,
            [item.menu_ID]
          );

          for (let r of recipe) {
            let required = Number(r.quantity_required) * move;

            const ru = r.unit || "g";
            const iu = r.ing_unit || "g";

            if (ru === "g" && iu === "kg") required /= 1000;
            else if (ru === "kg" && iu === "g") required *= 1000;
            else if (ru === "ml" && iu === "l") required /= 1000;
            else if (ru === "l" && iu === "ml") required *= 1000;

            await conn.query(
              "UPDATE ingredient SET quantity = quantity - ? WHERE ingredient_ID=?",
              [required, r.ingredient_ID]
            );
          }
        }

        pending = 0;
        cooking += move;

      } else if (action === "cooking") {
        done = pending + cooking + done;
        pending = 0;
        cooking = 0;
      }

      // status
      let status = "Chờ nấu";
      if (done >= item.quantity) status = "Hoàn thành";
      else if (cooking > 0) status = "Đang chế biến";

      await conn.query(
        "UPDATE order_details SET pendingQty=?, cookingQty=?, doneQty=?, status=? WHERE order_detail_ID=?",
        [pending, cooking, done, status, item.order_detail_ID]
      );
    }

    // =============================
    // ✅ COMMIT
    // =============================
    await conn.commit();

    res.json({ message: "OK - chế biến tất cả thành công" });

  } catch (err) {
    await conn.rollback();
    console.error("LỖI:", err);

    res.status(400).json({
      message: err.message || "Lỗi xử lý"
    });

  } finally {
    conn.release();
  }
};
// ===== UPDATE SINGLE ITEM STATUS WITH INVENTORY =====
exports.updateItemStatus = async (req, res) => {
  try {
    const itemID = req.params.id;
    const { quantity, action } = req.body;

    // Lấy thông tin món
    const [rows] = await db.query(
      "SELECT * FROM order_details WHERE order_detail_ID=?",
      [itemID]
    );
    if (!rows.length) return res.status(404).json({ message: "Không tìm thấy món" });

    const item = rows[0];
    let pending = item.pendingQty ?? item.quantity;
    let cooking = item.cookingQty ?? 0;
    let done = item.doneQty ?? 0;

    const qty = Math.max(0, parseInt(quantity) || 0); // ✅ dòng mới

    if (action === "pending") {
      // Chuyển từ pending → cooking và trừ nguyên liệu
      const move = Math.min(qty, pending);
      if (move > 0) {
        await moveToCooking(itemID, move); // Trừ nguyên liệu và cập nhật pendingQty/cookingQty
      }
      pending -= move;
      cooking += move;

    } else if (action === "cooking") {
      // Chuyển từ cooking → done
      const move = Math.min(qty, cooking);
      cooking -= move;
      done += move;
    }

    // Cập nhật trạng thái tổng thể
    let status = "Chờ nấu";
    if (done >= item.quantity) status = "Hoàn thành";
    else if (cooking > 0) status = "Đang chế biến";

    // Cập nhật order_details (số lượng + trạng thái)
    await db.query(
      `UPDATE order_details 
       SET pendingQty=?, cookingQty=?, doneQty=?, status=? 
       WHERE order_detail_ID=?`,
      [pending, cooking, done, status, itemID]
    );

    res.json({ pendingQty: pending, cookingQty: cooking, doneQty: done, item_status: status });

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};
const moveToCooking = async (orderDetailID, moveQty = 1) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [orderDetails] = await conn.query(
      "SELECT menu_ID FROM order_details WHERE order_detail_ID=?",
      [orderDetailID]
    );
    if (!orderDetails.length) throw new Error("Không tìm thấy món");

    const menu_ID = orderDetails[0].menu_ID;

    const [recipe] = await conn.query(
      `SELECT r.ingredient_ID, r.quantity_required, r.unit as recipe_unit,
              i.quantity as current_qty, i.unit as ing_unit
       FROM recipe r
       JOIN ingredient i ON i.ingredient_ID = r.ingredient_ID
       WHERE r.menu_ID=?`,
      [menu_ID]
    );

    // ===== CHECK TRƯỚC =====
    for (let r of recipe) {
      let requiredQty = Number(r.quantity_required) * moveQty;
      let currentQty = Number(r.current_qty);

      const ru = r.recipe_unit || "";
      const iu = r.ing_unit || "";

      if (ru === "g" && iu === "kg") requiredQty /= 1000;
      else if (ru === "kg" && iu === "g") requiredQty *= 1000;
      else if (ru === "ml" && iu === "l") requiredQty /= 1000;
      else if (ru === "l" && iu === "ml") requiredQty *= 1000;

      if (currentQty < requiredQty) {
        throw new Error(
          `Thiếu NL ${r.ingredient_ID} (còn ${currentQty}, cần ${requiredQty})`
        );
      }
    }

    // ===== TRỪ NGUYÊN LIỆU =====
    for (let r of recipe) {
      let requiredQty = Number(r.quantity_required) * moveQty;

      const ru = r.recipe_unit || "";
      const iu = r.ing_unit || "";

      if (ru === "g" && iu === "kg") requiredQty /= 1000;
      else if (ru === "kg" && iu === "g") requiredQty *= 1000;
      else if (ru === "ml" && iu === "l") requiredQty /= 1000;
      else if (ru === "l" && iu === "ml") requiredQty *= 1000;

      await conn.query(
        "UPDATE ingredient SET quantity = quantity - ? WHERE ingredient_ID=?",
        [requiredQty, r.ingredient_ID]
      );
    }

    await conn.commit();
  } catch (err) {
    await conn.rollback(); // 🔥 QUAN TRỌNG
    throw err;
  } finally {
    conn.release();
  }
};
// ===== UPDATE ITEM NOTE =====
// UPDATE NOTE CHO MỘT MÓN
exports.updateItemNote = async (req, res) => {
  try {
    const itemID = req.params.id;
    const { note, role } = req.body;

    if (!itemID) {
      return res.status(400).json({ message: "Thiếu ID" });
    }

    if (role === "waiter") {
      await db.query(
        "UPDATE order_details SET note_from_waiter=? WHERE order_detail_ID=?",
        [note, itemID]
      );
    } 
    else if (role === "kitchen") {
      await db.query(
        "UPDATE order_details SET note_from_kitchen=? WHERE order_detail_ID=?",
        [note, itemID]
      );
    } 
    else {
      return res.status(400).json({ message: "Role không hợp lệ" });
    }

    res.json({ message: "OK" });

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};


exports.printOrder = async (req, res) => {
  try {
    const orderID = req.params.id;

    // Lấy order + menu + số lượng + nguyên liệu
    const [rows] = await db.query(`
      SELECT 
        o.order_ID,
        t.table_name,
        e.name AS employee_name,
        o.created_at,
        m.menu_name,
        od.quantity AS menu_quantity,
        i.ingredient_name,
        r.quantity_required,
        r.unit,
        (r.quantity_required * od.quantity) AS total_required
      FROM \`order\` o
      JOIN order_details od ON o.order_ID = od.order_ID
      JOIN menu m ON od.menu_ID = m.menu_ID
      JOIN recipe r ON m.menu_ID = r.menu_ID
      JOIN ingredient i ON r.ingredient_ID = i.ingredient_ID
      LEFT JOIN \`table\` t ON o.table_ID = t.table_ID   
      LEFT JOIN employee e ON o.employee_ID = e.employee_ID 
      WHERE o.order_ID = ?
    `, [orderID]);

    // Nhóm theo món
    const grouped = rows.reduce((acc, item) => {
      if (!acc[item.menu_name]) acc[item.menu_name] = { quantity: item.menu_quantity, ingredients: [] };
      acc[item.menu_name].ingredients.push(`${item.ingredient_name}: ${item.total_required}${item.unit}`);
      return acc;
    }, {});

    // Chuyển sang format bếp
    const output = Object.keys(grouped).map(menu => {
      return {
        menu: `${menu} x${grouped[menu].quantity}`,
        ingredients: grouped[menu].ingredients
      }
    });

    res.json({
      order_ID: orderID,
      table: rows[0]?.table_name || null,
      employee: rows[0]?.employee_name || null,
      created_at: rows[0]?.created_at || null,
      items: output
    });

  } catch (err) {
    console.error("PRINT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
exports.getBill = async (req, res) => {
  try {
    const orderID = req.params.id;

    // 1. Lấy thông tin order
    const [orderRows] = await db.query(`
      SELECT o.*, t.table_name, e.name AS employee_name
      FROM \`order\` o
      LEFT JOIN \`table\` t ON o.table_ID = t.table_ID
      LEFT JOIN employee e ON o.employee_ID = e.employee_ID
      WHERE o.order_ID = ?
    `, [orderID]);

    if (!orderRows.length) {
      return res.status(404).json({ message: "Không tìm thấy order" });
    }

    const order = orderRows[0];

    // 2. Lấy món
    const [items] = await db.query(`
      SELECT m.menu_name, od.quantity, od.price
      FROM order_details od
      JOIN menu m ON od.menu_ID = m.menu_ID
      WHERE od.order_ID = ?
    `, [orderID]);

    const total = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

    res.json({
      order_ID: orderID,
      table: order.table_name,
      employee: order.employee_name,
      created_at: order.created_at,
      items,
      total,
      discount: order.discount_amount || 0,
      final_total: total - (order.discount_amount || 0),
      payment_method: order.payment_method
    });

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};
exports.getTables = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM `table`");

    const mapped = rows.map(t => {
      let uiStatus = t.status;

      // nếu không có order → ép về Trống
      if (!t.current_order_id) {
        uiStatus = "Trống";
      }

      return {
        ...t,
        uiStatus
      };
    });

    res.json(mapped);
  } catch (err) {
    res.status(500).json(err);
  }
};


exports.mergeTables = async (req, res) => {
  const conn = await db.getConnection();

  try {
    const { tableIDs } = req.body;

    if (!tableIDs || tableIDs.length < 2) {
      return res.status(400).json({ message: "Cần ít nhất 2 bàn" });
    }

    const groupID = randomUUID();

    await conn.beginTransaction();

    // 1. Gộp tất cả order chưa thanh toán
    await conn.query(
      `
      UPDATE \`order\`
      SET group_order_id = ?
      WHERE table_ID IN (?) 
        AND status != 'Đã thanh toán'
      `,
      [groupID, tableIDs]
    );

    // 2. Update trạng thái bàn
    await conn.query(
      `
      UPDATE \`table\`
      SET status = 'Đang gộp'
      WHERE table_ID IN (?)
      `,
      [tableIDs]
    );

    await conn.commit();

    res.json({
      message: "Gộp bàn thành công",
      groupID
    });

  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: "Lỗi gộp bàn" });
  } finally {
    conn.release();
  }
};
exports.splitTable = async (req, res) => {
  const conn = await db.getConnection();

  try {
    const { groupID } = req.body;

    if (!groupID) {
      return res.status(400).json({ message: "Thiếu groupID" });
    }

    await conn.beginTransaction();

    // 1. lấy danh sách bàn trong group
    const [orders] = await conn.query(
      `
      SELECT DISTINCT table_ID
      FROM \`order\`
      WHERE group_order_id = ?
      `,
      [groupID]
    );

    // 2. xóa group
    await conn.query(
      `
      UPDATE \`order\`
      SET group_order_id = NULL
      WHERE group_order_id = ?
      `,
      [groupID]
    );

    // 3. cập nhật lại bàn
    if (orders.length > 0) {
      const tableIDs = orders.map(o => o.table_ID);

      await conn.query(
        `
        UPDATE \`table\`
        SET status = 'Có khách'
        WHERE table_ID IN (?)
        `,
        [tableIDs]
      );
    }

    await conn.commit();

    res.json({
      message: "Tách bàn thành công"
    });

  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: "Lỗi tách bàn" });
  } finally {
    conn.release();
  }
};
exports.getTables = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM `table`");

    const mapped = await Promise.all(
      rows.map(async (t) => {
        const [orders] = await db.query(
          `
          SELECT group_order_id
          FROM \`order\`
          WHERE table_ID = ? AND status != 'Đã thanh toán'
          LIMIT 1
          `,
          [t.table_ID]
        );

        return {
          ...t,
          uiStatus: orders[0]?.group_order_id
            ? "Đang gộp"
            : t.status || "Trống",
          group_order_id: orders[0]?.group_order_id || null
        };
      })
    );

    res.json(mapped);

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};