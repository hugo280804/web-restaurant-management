const db = require("../config/db");
const { updateIngredient } = require("../helpers/inventoryHelper"); 
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
    const { table_ID, employee_ID } = req.body;

    const [rows] = await db.query(
      "SELECT * FROM `order` WHERE table_ID=? AND status!='Đã thanh toán'",
      [table_ID]
    );

    if (rows.length > 0) return res.json(rows[0]);

    const [result] = await db.query(
      "INSERT INTO `order` (table_ID, employee_ID, status, total_amount) VALUES (?,?, 'Chờ xác nhận',0)",
      [table_ID, employee_ID]
    );

    res.json({ order_ID: result.insertId });
  } catch (err) {
    res.status(500).json(err);
  }
};

// ===== GET ORDER BY TABLE =====
exports.getOrderByTable = async (req, res) => {
  try {
    const tableID = req.params.tableID;
    const [rows] = await db.query(
      "SELECT * FROM `order` WHERE table_ID=? AND status!='Đã thanh toán'",
      [tableID]
    );
    res.json(rows[0] || null);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ===== GET ALL ORDERS =====
exports.getAllOrders = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM `order`");
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ===== GET ORDER ITEMS =====
exports.getOrderItems = async (req, res) => {
  try {
    const orderID = req.params.orderID;
    const [rows] = await db.query(`
      SELECT od.*, m.menu_name
      FROM order_details od
      JOIN menu m ON od.menu_ID = m.menu_ID
      WHERE od.order_ID = ?
    `, [orderID]);
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ===== ADD ITEM TO ORDER =====
exports.addItemToOrder = async (req, res) => {
  try {
    const orderID = req.params.orderID;
    const { menu_ID, quantity, note, price } = req.body;

    // Kiểm tra món đã tồn tại trong order chưa
    const [rows] = await db.query(
      "SELECT * FROM order_details WHERE order_ID=? AND menu_ID=?",
      [orderID, menu_ID]
    );

    if (rows.length > 0) {
      // Cập nhật số lượng
      await db.query(
        "UPDATE order_details SET quantity = quantity + ? WHERE order_ID=? AND menu_ID=?",
        [quantity, orderID, menu_ID]
      );
      await updateTotal(orderID);
      return res.json({ message: "Cập nhật số lượng thành công" });
    }

    // Thêm món mới
    await db.query(
      `INSERT INTO order_details 
      (order_ID, menu_ID, quantity, note_from_waiter, price, status, pendingQty, cookingQty, doneQty) 
      VALUES (?,?,?,?,?, 'Chờ nấu', ?,0,0)`,
      [orderID, menu_ID, quantity, note || "", price, quantity]
    );

    await updateTotal(orderID);
    res.json({ message: "Thêm món thành công" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi thêm món", error: err.message });
  }
};
// ===== UPDATE ORDER ITEM =====
exports.updateOrderItem = async (req, res) => {
  try {
    const itemID = req.params.id;
    const { quantity, note } = req.body;

    await db.query(
      "UPDATE order_details SET quantity=?, note=? WHERE order_detail_ID=?",
      [quantity, note, itemID]
    );

    const [rows] = await db.query(
      "SELECT order_ID FROM order_details WHERE order_detail_ID=?",
      [itemID]
    );
    if (rows.length > 0) await updateTotal(rows[0].order_ID);

    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
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
    const orderID = req.params.orderID;
    const { payment_method } = req.body;

    await db.query(
      "UPDATE `order` SET status='Đã thanh toán', payment_method=? WHERE order_ID=?",
      [payment_method, orderID]
    );

    res.json({ message: "Thanh toán thành công" });
  } catch (err) {
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
    rows.forEach(r => {
      r.pendingQty = r.pendingQty ?? r.quantity ?? 0;
      r.cookingQty = r.cookingQty ?? 0;
      r.doneQty = r.doneQty ?? 0;
    });

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

    const qty = Math.max(1, parseInt(quantity) || 1);

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
    const itemID = req.params.id; // order_detail_ID
    const { note, role } = req.body; // role = 'waiter' | 'kitchen' (tùy chọn)

    if (!note || note.trim() === "") {
      return res.status(400).json({ message: "Ghi chú trống" });
    }

    if (!itemID) {
      return res.status(400).json({ message: "Thiếu order_detail_ID" });
    }

    // Cập nhật theo role
    if (role === "waiter") {
      await db.query(
        "UPDATE order_details SET note_from_waiter=? WHERE order_detail_ID=?",
        [note, itemID]
      );
    } else if (role === "kitchen") {
      await db.query(
        "UPDATE order_details SET note_from_kitchen=? WHERE order_detail_ID=?",
        [note, itemID]
      );
    } else {
      await db.query(
        "UPDATE order_details SET note=? WHERE order_detail_ID=?",
        [note, itemID]
      );
    }

    res.json({ message: "Cập nhật ghi chú thành công", note });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi cập nhật ghi chú", error: err.message });
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