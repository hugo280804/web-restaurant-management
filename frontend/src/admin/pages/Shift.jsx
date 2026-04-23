import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

export default function Shift() {
  const [shifts, setShifts] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [openForm, setOpenForm] = useState(false);
  const [employee_ID, setEmployee_ID] = useState("");
  const [formRole, setFormRole] = useState("Phục vụ");

  const [selected, setSelected] = useState({
    shift_ID: null,
    shift_date: ""
  });

  const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [s, a, e] = await Promise.all([
        axios.get(`${API}/shifts`),
        axios.get(`${API}/assignments`),
        axios.get(`${API}/employees`)
      ]);

      setShifts(s.data || []);
      setAssignments(a.data || []);
      setEmployees(e.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const roleMap = Object.fromEntries(
    employees.map(e => [e.employee_ID, e.role])
  );

  const getRoleIcon = (role) => {
    if (role === "Bếp") return "👨‍🍳";
    if (role === "Phục vụ") return "🧑‍💼";
    return "👤";
  };

  const getRoleClass = (role) => {
    if (role === "Bếp") return "bep";
    if (role === "Phục vụ") return "phucvu";
    return "default";
  };

  const formatDate = (d) => {
    const date = new Date(d);
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0")
    ].join("-");
  };

  const getDayName = (dateStr) =>
    new Date(dateStr).toLocaleDateString("vi-VN", { weekday: "short" });

const getWeekDays = (offset = 0) => {
  const now = new Date();

  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  const monday = new Date(now);
  monday.setDate(now.getDate() + diff + offset * 7);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
};
const days = getWeekDays(weekOffset);
  const formEmployees = employees.filter(e => e.role === formRole);

  /* ================= CSS INLINE ================= */
  const css = {
    page: {
      padding: 20,
      background: "#f5f1ea",
      minHeight: "100vh",
      fontFamily: "Segoe UI"
    },
    title: {
      color: "#5c4033",
      marginBottom: 15
    },
    nav: {
      display: "flex",
      gap: 10,
      marginBottom: 10
    },
    btn: {
      padding: "8px 12px",
      borderRadius: 10,
      border: "1px solid #d6c7b2",
      background: "#fffaf3",
      color: "#5c4033",
      cursor: "pointer"
    },
    headerRow: {
      display: "flex",
      gap: 10,
      marginBottom: 10,
      fontWeight: "bold",
      color: "#5c4033"
    },
    shiftRow: {
      display: "flex"
    },
    shiftBox: {
      width: 150,
      padding: 10,
      border: "1px solid #e0d6c8",
      background: "#fffaf3",
      borderRadius: 10
    },
    dayBox: {
      width: 140,
      minHeight: 70,
      border: "1px solid #e0d6c8",
      padding: 6,
      cursor: "pointer",
      background: "#fff"
    },
    tag: {
      fontSize: 12,
      padding: "3px 6px",
      borderRadius: 8,
      marginBottom: 4,
      display: "inline-block"
    },
    modalBg: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.4)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    },
    modal: {
      background: "#fffaf3",
      padding: 20,
      width: 360,
      borderRadius: 14,
      border: "1px solid #e0d6c8"
    },
    select: {
      width: "100%",
      padding: 8,
      borderRadius: 10,
      border: "1px solid #d6c7b2",
      marginBottom: 10
    }
  };

  return (
    <div style={css.page}>

      <h2 style={css.title}>📅 Lịch phân ca</h2>

      {/* NAV */}
      <div style={css.nav}>
        <button style={css.btn} onClick={() => setWeekOffset(weekOffset - 1)}>⬅</button>
        <button style={css.btn} onClick={() => setWeekOffset(0)}>Tuần hiện tại</button>
        <button style={css.btn} onClick={() => setWeekOffset(weekOffset + 1)}>➡</button>
      </div>

      {/* HEADER */}
      <div style={css.headerRow}>
        <div style={{ width: 150 }}>Ca / Ngày</div>
        {days.map(day => (
          <div key={day} style={{ width: 140 }}>
            <div>{day}</div>
            <div style={{ fontSize: 12, color: "#777" }}>{getDayName(day)}</div>
          </div>
        ))}
      </div>

      {/* GRID */}
      {shifts.map(shift => (
        <div key={shift.shift_ID} style={css.shiftRow}>

          <div style={css.shiftBox}>
            <b style={{ color: "#5c4033" }}>{shift.shift_name}</b>
            <br />
            <small style={{ color: "#7a5c45" }}>
              {shift.start_time} - {shift.end_time}
            </small>
          </div>

          {days.map(day => {

            const items = assignments.filter(a =>
              Number(a.shift_ID) === Number(shift.shift_ID) &&
              formatDate(a.shift_date) === day
            );

            return (
              <div
                key={day}
                style={css.dayBox}
                onClick={() => {
                  setSelected({ shift_ID: shift.shift_ID, shift_date: day });
                  setOpenForm(true);
                }}
              >

                {items.length ? items.map(a => (
                  <div
                    key={a.employee_shift_ID}
                    className=""
                    style={{
                      ...css.tag,
                      background:
                        roleMap[a.employee_ID] === "Bếp"
                          ? "#c0392b"
                          : "#8b5e3c",
                      color: "#fff"
                    }}
                  >
                    {getRoleIcon(roleMap[a.employee_ID])} {a.employee_name}
                  </div>
                )) : (
                  <span style={{ fontSize: 12, color: "#999" }}>Trống</span>
                )}

              </div>
            );
          })}
        </div>
      ))}

      {/* MODAL */}
      {openForm && (
        <div style={css.modalBg}>
          <div style={css.modal}>

            <h3 style={{ color: "#5c4033" }}>➕ Phân công ca</h3>

            <p>Ngày: <b>{selected.shift_date}</b></p>

            <select
              style={css.select}
              value={formRole}
              onChange={(e) => {
                setFormRole(e.target.value);
                setEmployee_ID("");
              }}
            >
              <option value="Phục vụ">🧑‍💼 Phục vụ</option>
              <option value="Bếp">👨‍🍳 Bếp</option>
            </select>

            <select
              style={css.select}
              value={employee_ID}
              onChange={(e) => setEmployee_ID(e.target.value)}
            >
              <option value="">Chọn nhân viên</option>
              {formEmployees.map(e => (
                <option key={e.employee_ID} value={e.employee_ID}>
                  {getRoleIcon(e.role)} {e.name}
                </option>
              ))}
            </select>

            <div style={{ display: "flex", gap: 10 }}>

              <button
                style={{
                  ...css.btn,
                  background: "#c8a97e",
                  color: "#4b2e1e",
                  fontWeight: "bold"
                }}
                onClick={async () => {
                  await axios.post(`${API}/assignments`, {
                    employee_ID,
                    shift_ID: selected.shift_ID,
                    shift_date: selected.shift_date
                  });

                  setOpenForm(false);
                  setEmployee_ID("");
                  loadData();
                }}
              >
                Lưu
              </button>

              <button
                style={{ ...css.btn, background: "#c0392b", color: "#fff" }}
                onClick={() => setOpenForm(false)}
              >
                Hủy
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}