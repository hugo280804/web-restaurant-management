import { useState, useEffect } from "react";
import "./tablemap.css";

export default function TableManagementWithFloor() {
  const [floors, setFloors] = useState([]);
  const [currentFloor, setCurrentFloor] = useState("");
  const [tables, setTables] = useState([]);

  const [form, setForm] = useState({
    id: null,
    name: "",
    seats: "",
    floor_ID: "",
  });

  const [editing, setEditing] = useState(false);
  const [dragId, setDragId] = useState(null);

  // ===== LOAD DATA =====
  useEffect(() => {
    // Load floors
    fetch("http://localhost:5000/api/floors")
      .then(res => res.json())
      .then(data => {
        setFloors(data);
        setCurrentFloor(data[0]?.floor_ID || "");
      });

    // Load tables
    fetch("http://localhost:5000/api/tables")
      .then(res => res.json())
      .then(data => {
        const mapped = data.map(t => ({
          id: t.table_ID,
          name: t.table_name,
          seats: t.seats_number,
          floor_ID: t.floor_ID,
          x: t.pos_x || 100,
          y: t.pos_y || 100,
        }));
        setTables(mapped);
      });
  }, []);

  // ===== FORM =====
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ===== ADD TABLE =====
  const handleAdd = async () => {
    if (!form.name || !form.seats) return alert("Nhập thiếu!");
    if (!form.floor_ID) form.floor_ID = currentFloor;

    await fetch("http://localhost:5000/api/tables", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        table_name: form.name,
        seats_number: form.seats,
        floor_ID: form.floor_ID,
      }),
    });
    window.location.reload();
  };

  // ===== SELECT TABLE =====
  const handleSelect = (t) => {
    setForm({
      id: t.id,
      name: t.name,
      seats: t.seats,
      floor_ID: t.floor_ID,
    });
    setEditing(true);
  };

  // ===== UPDATE TABLE =====
  const handleUpdate = async () => {
    const t = tables.find(t => t.id === form.id);
    await fetch(`http://localhost:5000/api/tables/${form.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        table_name: form.name,
        seats_number: form.seats,
        floor_ID: form.floor_ID,
        pos_x: t.x,
        pos_y: t.y,
      }),
    });
    window.location.reload();
  };

  // ===== DELETE TABLE =====
  const handleDelete = async () => {
    await fetch(`http://localhost:5000/api/tables/${form.id}`, { method: "DELETE" });
    window.location.reload();
  };

  const resetForm = () => {
    setForm({ id: null, name: "", seats: "", floor_ID: currentFloor });
    setEditing(false);
  };

  // ===== DRAG =====
  const handleMouseDown = (id) => setDragId(id);
  const handleMouseMove = (e) => {
    if (!dragId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 45;
    const y = e.clientY - rect.top - 45;
    setTables(prev => prev.map(t => t.id === dragId ? { ...t, x, y } : t));
  };
  const handleMouseUp = async () => {
    if (!dragId) return;
    const t = tables.find(t => t.id === dragId);
    await fetch(`http://localhost:5000/api/tables/${dragId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        table_name: t.name,
        seats_number: t.seats,
        floor_ID: t.floor_ID,
        pos_x: t.x,
        pos_y: t.y,
      }),
    });
    setDragId(null);
  };

  // ===== FLOOR =====
  const handleAddFloor = async () => {
    const name = prompt("Tên tầng:");
    if (!name) return;

    const exists = floors.some(f => f.floor_name === name);
    if (exists) return alert("Trùng tên tầng!");

    // Gọi API thêm tầng
    const res = await fetch("http://localhost:5000/api/floors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ floor_name: name }),
    });
    const newFloor = await res.json();
    setFloors([...floors, newFloor]);
    setCurrentFloor(newFloor.floor_ID);
  };

  const handleDeleteFloor = (floor_ID) => {
    const hasTable = tables.some(t => t.floor_ID === floor_ID);
    if (hasTable) return alert("Còn bàn trên tầng!");
    setFloors(floors.filter(f => f.floor_ID !== floor_ID));
  };

  const handleRenameFloor = async (floor_ID) => {
    const floor = floors.find(f => f.floor_ID === floor_ID);
    const newName = prompt("Tên mới:", floor.floor_name);
    if (!newName) return;

    await fetch(`http://localhost:5000/api/floors/${floor_ID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ floor_name: newName }),
    });

    setFloors(floors.map(f => f.floor_ID === floor_ID ? { ...f, floor_name: newName } : f));
    setTables(tables.map(t => t.floor_ID === floor_ID ? { ...t } : t));
  };

  // ===== FILTER TABLES BY FLOOR =====
  const tablesByFloor = tables.filter(t => t.floor_ID === currentFloor);

  return (
    <div className="layout">
      {/* LEFT PANEL */}
      <div className="panel">
        <h3>{editing ? "Sửa bàn" : "Tạo bàn"}</h3>
        <input name="name" placeholder="Tên bàn" value={form.name} onChange={handleChange} />
        <input type="number" name="seats" placeholder="Số ghế" value={form.seats} onChange={handleChange} />
        <select name="floor_ID" value={form.floor_ID} onChange={handleChange}>
          {floors.map(f => (
            <option key={f.floor_ID} value={f.floor_ID}>{f.floor_name}</option>
          ))}
        </select>
        {editing ? (
          <>
            <button onClick={handleUpdate}>Cập nhật</button>
            <button onClick={handleDelete}>Xóa</button>
            <button onClick={resetForm}>Hủy</button>
          </>
        ) : (
          <button onClick={handleAdd}>+ Thêm bàn</button>
        )}
      </div>

      {/* RIGHT MAP */}
      <div className="map-container">
        <div className="floor-tabs">
          {floors.map(f => (
            <div key={f.floor_ID}>
              <button
                className={f.floor_ID === currentFloor ? "active" : ""}
                onClick={() => setCurrentFloor(f.floor_ID)}
                onDoubleClick={() => handleRenameFloor(f.floor_ID)}
              >
                {f.floor_name}
              </button>
              <button onClick={() => handleDeleteFloor(f.floor_ID)}>x</button>
            </div>
          ))}
          <button className="add-floor" onClick={handleAddFloor}>+</button>
        </div>

        <div className="map" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
          {tablesByFloor.map(t => (
            <div
              key={t.id}
              className={`table ${editing && form.id === t.id ? "selected" : ""}`}
              style={{ left: t.x, top: t.y }}
              onMouseDown={() => handleMouseDown(t.id)}
              onClick={() => handleSelect(t)}
            >
              <div className="table-icon">🍽</div>
              <div className="table-name">{t.name}</div>
              <div className="table-info">👥 {t.seats}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}