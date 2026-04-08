const db = require("../config/db");

// ===== CHUYỂN VỀ BASE (g / ml) =====
const toBase = (qty, unit) => {
  qty = Number(qty) || 0;

  switch (unit) {
    case "kg": return qty * 1000;
    case "l": return qty * 1000;
    case "g":
    case "ml":
    default: return qty;
  }
};

// ===== CHUYỂN NGƯỢC =====
const fromBase = (qty, unit) => {
  qty = Number(qty) || 0;

  switch (unit) {
    case "kg": return +(qty / 1000).toFixed(2);
    case "l": return +(qty / 1000).toFixed(2);
    case "g":
    case "ml":
    default: return +qty.toFixed(2);
  }
};

const updateIngredient = async (orderDetailID, moveQty) => {
  if (!moveQty || moveQty <= 0) return;

  // ===== LẤY MENU =====
  const [rows] = await db.query(
    "SELECT menu_ID FROM order_details WHERE order_detail_ID=?",
    [orderDetailID]
  );
  if (!rows.length) throw new Error("Không tìm thấy món");

  const menu_ID = rows[0].menu_ID;

  // ===== LẤY RECIPE (THÊM UNIT) =====
  const [recipe] = await db.query(
    "SELECT ingredient_ID, quantity_required, unit FROM recipe WHERE menu_ID=?",
    [menu_ID]
  );

  // ===== LOOP =====
  for (let r of recipe) {
    const [ingRows] = await db.query(
      "SELECT quantity, unit FROM ingredient WHERE ingredient_ID=?",
      [r.ingredient_ID]
    );
    if (!ingRows.length) continue;

    const ingUnit = ingRows[0].unit || "g";
    const recipeUnit = r.unit || "g";

    // ===== CONVERT ĐÚNG =====
    const currentBase = toBase(ingRows[0].quantity, ingUnit);
    const requiredBase = toBase(r.quantity_required, recipeUnit) * moveQty;

    // ===== DEBUG (có thể xóa sau) =====
    console.log("CHECK NL:", {
      ingredient: r.ingredient_ID,
      currentBase,
      requiredBase,
      ingUnit,
      recipeUnit
    });

    // ===== CHECK =====
    if (currentBase < requiredBase) {
      throw new Error(
        `Thiếu NL ${r.ingredient_ID} (còn ${currentBase}, cần ${requiredBase})`
      );
    }

    // ===== TRỪ =====
    const newBase = currentBase - requiredBase;
    const newQty = fromBase(newBase, ingUnit);

    await db.query(
      "UPDATE ingredient SET quantity=? WHERE ingredient_ID=?",
      [newQty, r.ingredient_ID]
    );
  }
};

module.exports = { updateIngredient };