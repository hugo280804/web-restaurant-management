import { useEffect, useState } from "react";
import axios from "axios";

export default function Employee() {
  const API = "http://localhost:5000/api/employees";

  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    employee_ID: null,
    name: "",
    role: "Phục vụ",
    username: "",
    password: "",
    contact: "",
    status: "Active"
  });

  const [isEdit, setIsEdit] = useState(false);

  // ===== LOAD =====
  const fetchEmployees = async () => {
    const res = await axios.get(API);
    setEmployees(res.data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ===== RESET =====
  const resetForm = () => {
    setForm({
      employee_ID: null,
      name: "",
      role: "Phục vụ",
      username: "",
      password: "",
      contact: "",
      status: "Active"
    });
    setIsEdit(false);
  };

  // ===== CREATE =====
  const createEmployee = async () => {
    await axios.post(API, form);
    fetchEmployees();
    resetForm();
  };

  // ===== UPDATE =====
  const updateEmployee = async () => {
    const payload = { ...form };

    if (!payload.password || payload.password.trim() === "") {
      delete payload.password;
    }

    await axios.put(`${API}/${form.employee_ID}`, payload);
    fetchEmployees();
    resetForm();
  };

  // ===== DELETE =====
  const deleteEmployee = async (id) => {
    if (!window.confirm("Xóa nhân viên này?")) return;
    await axios.delete(`${API}/${id}`);
    fetchEmployees();
  };

  // ===== EDIT =====
  const handleEdit = (emp) => {
    setForm({
      employee_ID: emp.employee_ID,
      name: emp.name,
      role: emp.role,
      username: emp.username,
      password: "",
      contact: emp.contact,
      status: emp.status
    });
    setIsEdit(true);
  };

  return (
    <div className="employee-page">

      {/* ===== CSS INLINE ===== */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: "Segoe UI", sans-serif;
        }

        .employee-page {
          padding: 20px;
          background: #f5f1ea;
          min-height: 100vh;
        }

        .employee-page h2 {
          margin-bottom: 15px;
          color: #4b2e1e;
        }

        .employee-form {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
        }

        .employee-form input,
        .employee-form select {
          padding: 8px 10px;
          border-radius: 8px;
          border: 1px solid #d6c7b2;
          background: #fff8f0;
          color: #4b2e1e;
          outline: none;
        }

        .employee-form input:focus,
        .employee-form select:focus {
          border-color: #a67c52;
          box-shadow: 0 0 4px rgba(166,124,82,0.5);
        }

        .employee-form button {
          padding: 8px 14px;
          border-radius: 8px;
          border: none;
          background: #a67c52;
          color: #fff8f0;
          cursor: pointer;
          font-weight: 500;
        }

        .employee-form button:hover {
          background: #8c6239;
        }

        .employee-table {
          width: 100%;
          border-collapse: collapse;
          background: #fff;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .employee-table th,
        .employee-table td {
          padding: 10px;
          border: 1px solid #e0d6c8;
          text-align: center;
        }

        .employee-table th {
          background: #fdf6f3;
          color: #5c4033;
        }

        .password {
          font-family: monospace;
          color: #666;
        }

        .status {
          padding: 4px 8px;
          border-radius: 6px;
          color: white;
          font-size: 13px;
        }

        .active { background: #27ae60; }
        .inactive { background: #c0392b; }

        .action-btn {
          padding: 5px 10px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          margin: 0 2px;
        }

        .edit-btn {
          background: #c8a97e;
          color: #4b2e1e;
        }

        .edit-btn:hover {
          background: #b8966d;
        }

        .delete-btn {
          background: #c0392b;
          color: white;
        }

        .delete-btn:hover {
          background: #922b21;
        }
      `}</style>

      <h2>👨‍💼 Quản lý nhân viên</h2>

      {/* ===== FORM ===== */}
      <div className="employee-form">

        <input
          placeholder="Tên"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Username"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
        />

        <input
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <input
          placeholder="Phone"
          value={form.contact}
          onChange={e => setForm({ ...form, contact: e.target.value })}
        />

        <select
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
        >
          <option>Admin</option>
          <option>Phục vụ</option>
          <option>Bếp</option>
          <option>Thu ngân</option>
        </select>

        <select
          value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value })}
        >
          <option>Active</option>
          <option>Inactive</option>
        </select>

        {!isEdit ? (
          <button onClick={createEmployee}>+ Thêm</button>
        ) : (
          <>
            <button onClick={updateEmployee}>✔ Cập nhật</button>
            <button onClick={resetForm}>Hủy</button>
          </>
        )}
      </div>

      {/* ===== TABLE ===== */}
      <table className="employee-table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Role</th>
            <th>Username</th>
            <th>Password</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {employees.map(e => (
            <tr key={e.employee_ID}>
              <td>{e.name}</td>
              <td>{e.role}</td>
              <td>{e.username}</td>

              <td className="password">*******</td>

              <td>{e.contact}</td>

              <td>
                <span className={`status ${e.status === "Active" ? "active" : "inactive"}`}>
                  {e.status}
                </span>
              </td>

              <td>
                <button
                  className="action-btn edit-btn"
                  onClick={() => handleEdit(e)}
                >
                  Sửa
                </button>

                <button
                  className="action-btn delete-btn"
                  onClick={() => deleteEmployee(e.employee_ID)}
                >
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