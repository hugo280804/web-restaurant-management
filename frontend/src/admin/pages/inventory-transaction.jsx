import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/ingredients";

export default function StockPage() {
  const [ingredient_ID, setIngredientID] = useState("");
  const [quantity, setQuantity] = useState("");

  const [history, setHistory] = useState([]);

  const loadHistory = async () => {
    const res = await axios.get(`${API}/transactions`);
    setHistory(res.data);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const importStock = async () => {
    await axios.post(`${API}/import`, {
      ingredient_ID,
      quantity,
    });

    setQuantity("");
    loadHistory();
  };

  const exportStock = async () => {
    await axios.post(`${API}/export`, {
      ingredient_ID,
      quantity,
    });

    setQuantity("");
    loadHistory();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📦 Nhập / Xuất kho</h2>

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

      <button onClick={importStock} style={{ background: "green", color: "#fff" }}>
        Nhập
      </button>

      <button onClick={exportStock} style={{ background: "red", color: "#fff" }}>
        Xuất
      </button>

      <h3>Lịch sử</h3>

      <table border="1" width="100%">
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
          {history.map((t) => (
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
    </div>
  );
}