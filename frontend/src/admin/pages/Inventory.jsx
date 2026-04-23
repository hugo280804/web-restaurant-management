import { useEffect, useState } from "react";
import api from "../../api/axiosClient";

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [ingredient_ID, setIngredientID] = useState("");
  const [quantity, setQuantity] = useState("");
  const [employee_ID, setEmployeeID] = useState("1");

  const [tab, setTab] = useState("inventory");

  // LOAD DATA
  const loadInventory = async () => {
    const res = await api.get("/inventory");
    setInventory(res.data);
  };

  const loadTransactions = async () => {
    const res = await api.get("/inventory/transactions");
    setTransactions(res.data);
  };

  useEffect(() => {
    loadInventory();
    loadTransactions();
  }, []);

  // NHẬP KHO
  const handleImport = async () => {
    await api.post("/inventory/import", {
      ingredient_ID,
      quantity,
      employee_ID,
    });

    setQuantity("");
    loadInventory();
    loadTransactions();
  };

  // XUẤT KHO
  const handleExport = async () => {
    await api.post("/inventory/export", {
      ingredient_ID,
      quantity,
      employee_ID,
    });

    setQuantity("");
    loadInventory();
    loadTransactions();
  };

  return (
    <div style={styles.container}>

      {/* CSS INLINE */}
      <style>{css}</style>

      <h2>📦 Quản lý kho</h2>

      {/* TAB */}
      <div style={styles.tab}>
        <button onClick={() => setTab("inventory")}>Tồn kho</button>
        <button onClick={() => setTab("history")}>Lịch sử</button>
      </div>

      {/* FORM */}
      <div style={styles.form}>
        <input
          placeholder="Ingredient ID"
          value={ingredient_ID}
          onChange={(e) => setIngredientID(e.target.value)}
        />

        <input
          placeholder="Số lượng"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <input
          placeholder="Employee ID"
          value={employee_ID}
          onChange={(e) => setEmployeeID(e.target.value)}
        />

        <button className="import" onClick={handleImport}>
          ➕ Nhập kho
        </button>

        <button className="export" onClick={handleExport}>
          ➖ Xuất kho
        </button>
      </div>

      {/* INVENTORY */}
      {tab === "inventory" && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Đơn vị</th>
              <th>Tồn</th>
              <th>Cảnh báo</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((i) => (
              <tr key={i.inventory_ID}>
                <td>{i.ingredient_ID}</td>
                <td>{i.ingredient_name}</td>
                <td>{i.unit}</td>
                <td>{i.quantity}</td>
                <td>{i.min_quantity_alert}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* HISTORY */}
      {tab === "history" && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nguyên liệu</th>
              <th>Loại</th>
              <th>Số lượng</th>
              <th>Ngày</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.transaction_ID}>
                <td>{t.transaction_ID}</td>
                <td>{t.ingredient_name}</td>
                <td>{t.type}</td>
                <td>{t.quantity}</td>
                <td>{new Date(t.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* ================= INLINE STYLE ================= */
const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial",
  },
  tab: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
  },
  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
    flexWrap: "wrap",
  },
};

/* ================= CSS STRING ================= */
const css = `
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th {
  background: #34495e;
  color: white;
  padding: 8px;
}

td {
  border: 1px solid #ddd;
  padding: 8px;
}

button {
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  border-radius: 6px;
}

.import {
  background: green;
  color: white;
}

.export {
  background: red;
  color: white;
}
`;