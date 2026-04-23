import { useEffect, useState } from "react";
import axios from "axios";

export default function Customer() {
  const API = "http://localhost:5000/api/customers/spent";

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    customer_ID: null,
    name: "",
    phone: "",
    email: "",
  });

  const isEdit = form.customer_ID !== null;

  // LOAD
  const loadData = async () => {
    const res = await axios.get(API);

    const data = Array.isArray(res.data)
      ? res.data
      : res.data?.data || res.data?.rows || [];

    setCustomers(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  // FILTER + SORT VIP
  const filteredCustomers = customers
    .filter((c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search)
    )
    .sort((a, b) => b.total_spent - a.total_spent);

  const resetForm = () => {
    setForm({
      customer_ID: null,
      name: "",
      phone: "",
      email: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const BASE = "http://localhost:5000/api/customers";

    if (isEdit) {
      await axios.put(`${BASE}/${form.customer_ID}`, form);
    } else {
      await axios.post(BASE, form);
    }

    resetForm();
    loadData();
  };

  const handleEdit = (c) => setForm(c);

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa khách hàng này?")) return;
    await axios.delete(`http://localhost:5000/api/customers/${id}`);
    loadData();
  };

  const formatMoney = (m) =>
    Number(m || 0).toLocaleString("vi-VN") + " đ";

  const getBadge = (money) => {
    if (money >= 500000) return "VIP 🔥";
    if (money >= 200000) return "GOLD ⭐";
    return "NORMAL 👤";
  };

  return (
    <div className="customer-page">

      {/* ===== CSS INLINE ===== */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: "Segoe UI", sans-serif;
        }

        .customer-page {
          padding: 20px;
          background: #f5f1ea;
          min-height: 100vh;
        }

        .customer-page h2 {
          margin-bottom: 15px;
          color: #4b2e1e;
        }

        /* SEARCH */
        .search-box {
          padding: 8px 10px;
          width: 300px;
          border-radius: 8px;
          border: 1px solid #d6c7b2;
          background: #fff8f0;
          margin-bottom: 15px;
          outline: none;
        }

        /* FORM */
        .customer-form {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
        }

        .customer-form input {
          padding: 8px 10px;
          border-radius: 8px;
          border: 1px solid #d6c7b2;
          background: #fff8f0;
          outline: none;
        }

        .customer-form button {
          padding: 8px 14px;
          border-radius: 8px;
          border: none;
          background: #a67c52;
          color: #fff8f0;
          cursor: pointer;
        }

        .customer-form button:hover {
          background: #8c6239;
        }

        /* TABLE */
        .customer-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .customer-table th,
        .customer-table td {
          padding: 10px;
          border: 1px solid #e0d6c8;
          text-align: center;
        }

        .customer-table th {
          background: #fdf6f3;
          color: #5c4033;
        }

        /* BADGE */
        .badge {
          padding: 4px 8px;
          border-radius: 6px;
          color: white;
          font-size: 13px;
        }

        .vip { background: #e74c3c; }
        .gold { background: #f39c12; }
        .normal { background: #7f8c8d; }

        /* BUTTON */
        .btn {
          padding: 5px 10px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          margin: 0 2px;
        }

        .edit {
          background: #c8a97e;
          color: #4b2e1e;
        }

        .delete {
          background: #c0392b;
          color: white;
        }
      `}</style>

      <h2>👤 Quản lý khách hàng</h2>

      {/* SEARCH */}
      <input
        className="search-box"
        placeholder="🔍 Tìm theo tên hoặc SĐT..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* FORM */}
      <form className="customer-form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Tên"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          name="phone"
          placeholder="SĐT"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <button type="submit">
          {isEdit ? "Cập nhật" : "Thêm"}
        </button>

        {isEdit && (
          <button type="button" onClick={resetForm}>
            Hủy
          </button>
        )}
      </form>

      {/* TABLE */}
      <table className="customer-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>SĐT</th>
            <th>Email</th>
            <th>Tổng chi tiêu</th>
            <th>Hạng</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {filteredCustomers.map((c) => (
            <tr key={c.customer_ID}>
              <td>{c.customer_ID}</td>
              <td>{c.name}</td>
              <td>{c.phone}</td>
              <td>{c.email}</td>

              <td>{formatMoney(c.total_spent)}</td>

              <td>
                <span
                  className={`badge ${
                    c.total_spent >= 500000
                      ? "vip"
                      : c.total_spent >= 200000
                      ? "gold"
                      : "normal"
                  }`}
                >
                  {getBadge(c.total_spent)}
                </span>
              </td>

              <td>
                <button className="btn edit" onClick={() => handleEdit(c)}>
                  Sửa
                </button>

                <button className="btn delete" onClick={() => handleDelete(c.customer_ID)}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}