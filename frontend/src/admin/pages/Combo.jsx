import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

export default function Combo() {
  const [combos, setCombos] = useState([]);
  const [menus, setMenus] = useState([]);
  const formatMoney = (value) => {
  return Number(value || 0).toLocaleString("vi-VN");
};
  const [form, setForm] = useState({
    combo_ID: null,
    combo_name: "",
    price: "",
  });

  const [comboInput, setComboInput] = useState({});

  useEffect(() => {
    fetchCombos();
    fetchMenus();
  }, []);

  const fetchCombos = async () => {
    const res = await axios.get(`${API}/combos`);
    setCombos(res.data);
  };

  const fetchMenus = async () => {
    const res = await axios.get(`${API}/menus`);
    setMenus(res.data);
  };

  /* ================= SAVE ================= */
  const saveCombo = async () => {
    if (!form.combo_name) return alert("Nhập tên combo");

    if (form.combo_ID) {
      await axios.put(`${API}/combos/${form.combo_ID}`, form);
    } else {
      await axios.post(`${API}/combos`, form);
    }

    setForm({ combo_ID: null, combo_name: "", price: "" });
    fetchCombos();
  };

  const editCombo = (c) => {
    setForm({
      combo_ID: c.combo_ID,
      combo_name: c.combo_name,
      price: c.combo_price,
    });
  };

  const deleteCombo = async (id) => {
    if (!window.confirm("Xóa combo?")) return;
    await axios.delete(`${API}/combos/${id}`);
    fetchCombos();
  };

  /* ================= MENU ================= */
  const addMenu = async (combo_ID) => {
    const data = comboInput[combo_ID];
    if (!data?.menu_ID) return alert("Chọn món");

    await axios.post(`${API}/combos/add-menu`, {
      combo_ID,
      menu_ID: Number(data.menu_ID),
      quantity: Number(data.quantity || 1),
    });

    setComboInput({
      ...comboInput,
      [combo_ID]: { keyword: "", menu_ID: "", quantity: 1 },
    });

    fetchCombos();
  };

  const deleteMenu = async (id) => {
    await axios.delete(`${API}/combos/remove-menu/${id}`);
    fetchCombos();
  };

  /* ================= TOTAL ================= */
  const calcTotal = (items = []) =>
    items.reduce((sum, i) => sum + i.menu_price * i.quantity, 0);

  return (
    <div className="page">
      <h2>🍔 Combo Management</h2>

      {/* FORM */}
      <div className="form">
        <input
          placeholder="Tên combo"
          value={form.combo_name}
          onChange={(e) =>
            setForm({ ...form, combo_name: e.target.value })
          }
        />

        <input
          placeholder="Giá combo"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <button onClick={saveCombo}>
          {form.combo_ID ? "Cập nhật" : "Tạo"}
        </button>
      </div>

      {/* LIST */}
      <div className="grid">
        {combos.map((c) => {
          const total = calcTotal(c.items);

          const keyword = comboInput[c.combo_ID]?.keyword || "";

          const filtered = menus.filter((m) =>
            m.menu_name.toLowerCase().includes(keyword.toLowerCase())
          );

          return (
            <div className="card" key={c.combo_ID}>
              <h3>🍱 {c.combo_name}</h3>
              <p>💰 {formatMoney(c.combo_price)}đ</p>
              <p className={total > c.combo_price ? "warn" : "ok"}>
                🧮 Tổng món: {formatMoney(total)}đ
              </p>

              {/* ITEMS */}
              {c.items?.length ? (
                c.items.map((i) => (
                  <div className="item" key={i.combo_detail_ID}>
                    🍽 {i.menu_name} - {Number(i.menu_price).toLocaleString("vi-VN")}đ x {i.quantity}
                    <button onClick={() => deleteMenu(i.combo_detail_ID)}>
                      ❌
                    </button>
                  </div>
                ))
              ) : (
                <p className="empty">Chưa có món</p>
              )}

              {/* ===== AUTOCOMPLETE ===== */}
              <div className="add">
                <input
                  placeholder="🔍 nhập tên món..."
                  value={keyword}
                  onChange={(e) =>
                    setComboInput({
                      ...comboInput,
                      [c.combo_ID]: {
                        ...comboInput[c.combo_ID],
                        keyword: e.target.value,
                      },
                    })
                  }
                />

                {/* DROPDOWN GỢI Ý */}
                {keyword && (
                  <div className="dropdown">
                    {filtered.map((m) => (
                      <div
                        key={m.menu_ID}
                        className="option"
                        onClick={() =>
                          setComboInput({
                            ...comboInput,
                            [c.combo_ID]: {
                              ...comboInput[c.combo_ID],
                              menu_ID: m.menu_ID,
                              keyword: m.menu_name,
                            },
                          })
                        }
                      >
                        {m.menu_name} - {m.price}đ
                      </div>
                    ))}
                  </div>
                )}

                <input
                  type="number"
                  min="1"
                  value={comboInput[c.combo_ID]?.quantity || 1}
                  onChange={(e) =>
                    setComboInput({
                      ...comboInput,
                      [c.combo_ID]: {
                        ...comboInput[c.combo_ID],
                        quantity: e.target.value,
                      },
                    })
                  }
                />

                <button onClick={() => addMenu(c.combo_ID)}>
                  + Thêm
                </button>
              </div>

              {/* ACTION */}
              <div className="actions">
                <button onClick={() => editCombo(c)}>✏</button>
                <button onClick={() => deleteCombo(c.combo_ID)}>
                  🗑
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CSS */}
      <style>{`
        .page {
          padding: 20px;
          background: #f5f1ea;
          min-height: 100vh;
          font-family: sans-serif;
        }

        .form {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        input {
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #ccc;
        }

        button {
          padding: 8px 12px;
          border: none;
          background: #8b5e3c;
          color: white;
          border-radius: 8px;
          cursor: pointer;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 15px;
        }

        .card {
          background: white;
          padding: 15px;
          border-radius: 12px;
          position: relative;
        }

        .item {
          display: flex;
          justify-content: space-between;
          margin: 5px 0;
        }

        .add {
          margin-top: 10px;
          position: relative;
        }

        .dropdown {
          position: absolute;
          background: white;
          border: 1px solid #ccc;
          width: 100%;
          max-height: 150px;
          overflow-y: auto;
          z-index: 10;
        }

        .option {
          padding: 8px;
          cursor: pointer;
        }

        .option:hover {
          background: #eee;
        }

        .actions {
          margin-top: 10px;
          display: flex;
          gap: 5px;
        }

        .warn { color: red; }
        .ok { color: green; }
        .empty { color: gray; }
      `}</style>
    </div>
  );
}