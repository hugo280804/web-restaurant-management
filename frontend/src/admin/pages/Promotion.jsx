import { useEffect, useState } from "react";
import axios from "axios";

export default function Promotion() {
  const [list, setList] = useState([]);

  const [form, setForm] = useState({
    discount_ID: null,
    name: "",
    type: "MENU",
    menu_ID: "",
    code: "",
    discount_percent: "",
    discount_amount: "",
    start_date: "",
    end_date: "",
    usage_limit: ""
  });

  const isEdit = form.discount_ID !== null;

  // LOAD DATA
  const loadData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/promotions");
      setList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      discount_ID: null,
      name: "",
      type: "MENU",
      menu_ID: "",
      code: "",
      discount_percent: "",
      discount_amount: "",
      start_date: "",
      end_date: "",
      usage_limit: ""
    });
  };

const handleSubmit = async () => {
  const payload = {
    ...form,
    discount_percent: Number(form.discount_percent || 0),
    discount_amount: Number(form.discount_amount || 0),
  };

  if (isEdit) {
    await axios.put(
      `http://localhost:5000/api/promotions/${form.discount_ID}`,
      payload
    );
  } else {
    await axios.post("http://localhost:5000/api/promotions", payload);
  }

  resetForm();
  loadData();
};

 const handleEdit = (item) => {
  setForm({
    discount_ID: item.discount_ID,
    name: item.name || "",
    type: item.type || "MENU",
    menu_ID: item.menu_ID || "",
    code: item.code || "",
    discount_percent: item.discount_percent ?? "",
    discount_amount: item.discount_amount ?? "",
    start_date: item.start_date || "",
    end_date: item.end_date || "",
    usage_limit: item.usage_limit || ""
  });
};
  const handleDelete = async (id) => {
    if (!window.confirm("Xoá khuyến mãi này?")) return;
    await axios.delete(`http://localhost:5000/api/promotions/${id}`);
    loadData();
  };

  return (
    <div className="promotion-page">

      {/* STYLE */}
      <style>{css}</style>

      {/* HEADER */}
      <div className="promotion-header">
        <button onClick={resetForm}>Reset</button>
      </div>

      {/* FORM */}
      <div className="promotion-form">

        <input
          name="name"
          placeholder="Tên khuyến mãi"
          value={form.name}
          onChange={handleChange}
        />

        <select name="type" value={form.type} onChange={handleChange}>
          <option value="MENU">MENU</option>
          <option value="ORDER">ORDER</option>
        </select>

    <input
  name="discount_percent"
  type="number"
  value={form.discount_percent ?? ""}
  onChange={handleChange}
/>

<input
  name="discount_amount"
  type="number"
  value={form.discount_amount ?? ""}
  onChange={handleChange}
/>

       <input
        name="discount_percent"
        placeholder="% giảm"
        type="number"
        min="0"
        max="100"
        step="1"
        value={form.discount_percent || ""}
        onChange={handleChange}
      />
            <input
        name="discount_amount"
        placeholder="Tiền giảm"
        type="number"
        min="0"
        step="1000"
        value={form.discount_amount || ""}
        onChange={handleChange}
      />

        <input
          type="date"
          name="start_date"
          value={form.start_date?.slice(0, 10) || ""}
          onChange={handleChange}
        />

        <input
          type="date"
          name="end_date"
          value={form.end_date?.slice(0, 10) || ""}
          onChange={handleChange}
        />

        <input
          name="usage_limit"
          placeholder="Giới hạn"
          value={form.usage_limit || ""}
          onChange={handleChange}
        />

        <button onClick={handleSubmit}>
          {isEdit ? "Cập nhật" : "Thêm"}
        </button>

      </div>

      {/* TABLE */}
      <table className="promotion-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Type</th>
            <th>Menu</th>
            <th>Code</th>
            <th>%</th>
            <th>Amount</th>
            <th>Start</th>
            <th>End</th>
            <th>Limit</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {list.map((item) => (
            <tr key={item.discount_ID}>
              <td>{item.discount_ID}</td>
              <td>{item.name}</td>
              <td>{item.type}</td>
              <td>{item.menu_ID}</td>
              <td>{item.code}</td>
              <td>
            {item.discount_percent
              ? `${parseFloat(item.discount_percent)}%`
              : ""}
          </td>
                        <td>{item.discount_amount
            ? `${Number(item.discount_amount).toLocaleString("vi-VN")}đ`
            : ""}</td>
              <td>{item.start_date?.slice(0, 10)}</td>
              <td>{item.end_date?.slice(0, 10)}</td>
              <td>{item.usage_limit}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(item)}>Sửa</button>
                <button className="delete-btn" onClick={() => handleDelete(item.discount_ID)}>Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

/* ===== CSS (giống Ingredient page) ===== */
const css = `
* {
  margin:0;
  padding:0;
  box-sizing:border-box;
  font-family:"Segoe UI",sans-serif;
}

/* PAGE */
.promotion-page {
  padding:20px;
  background:#f5f1ea;
  min-height:100vh;
}

/* HEADER */
.promotion-header {
  display:flex;
  gap:10px;
  margin-bottom:15px;
}

.promotion-header button {
  padding:8px 14px;
  border-radius:8px;
  border:none;
  background:#a67c52;
  color:#fff8f0;
  cursor:pointer;
}

.promotion-header button:hover {
  background:#8c6239;
}

/* FORM */
.promotion-form {
  display:flex;
  flex-wrap:wrap;
  gap:10px;
  margin-bottom:15px;
}

.promotion-form input,
.promotion-form select {
  padding:8px;
  border-radius:8px;
  border:1px solid #d6c7b2;
  background:#fff8f0;
}

.promotion-form button {
  padding:8px 12px;
  border:none;
  border-radius:8px;
  background:#8b5e3c;
  color:white;
  cursor:pointer;
}

.promotion-form button:hover {
  background:#6f472c;
}

/* TABLE */
.promotion-table {
  width:100%;
  border-collapse:collapse;
  background:white;
  box-shadow:0 4px 10px rgba(0,0,0,0.1);
}

.promotion-table th,
.promotion-table td {
  padding:10px;
  border:1px solid #e0d6c8;
  text-align:center;
}

.promotion-table th {
  background:#fdf6f3;
  color:#5c4033;
}

/* BUTTON */
.edit-btn {
  background:#c8a97e;
  border:none;
  padding:4px 8px;
  border-radius:6px;
}

.delete-btn {
  background:#c0392b;
  color:white;
  border:none;
  padding:4px 8px;
  border-radius:6px;
}
`;