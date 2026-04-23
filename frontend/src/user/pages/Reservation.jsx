import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/reservations";

export default function Reservation() {
  const [data, setData] = useState([]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    people: "",
    reservation_time: ""
  });

  // load data
  const fetchData = async () => {
    const res = await axios.get(API);
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(API, form);

    alert("Đặt bàn thành công");

    setForm({
      name: "",
      phone: "",
      people: "",
      reservation_time: ""
    });

    fetchData();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Đặt bàn online</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
        <input
          name="name"
          placeholder="Tên khách"
          value={form.name}
          onChange={handleChange}
          required
        />
        <br />

        <input
          name="phone"
          placeholder="SĐT"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <br />

        <input
          name="people"
          type="number"
          placeholder="Số người"
          value={form.people}
          onChange={handleChange}
          required
        />
        <br />

        <input
          name="reservation_time"
          type="datetime-local"
          value={form.reservation_time}
          onChange={handleChange}
          required
        />
        <br />

        <button type="submit">Đặt bàn</button>
      </form>

      {/* LIST */}
      <h3>Danh sách đặt bàn</h3>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Tên</th>
            <th>SĐT</th>
            <th>Số người</th>
            <th>Thời gian</th>
            <th>Bàn</th>
            <th>Trạng thái</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.reservation_ID}>
              <td>{item.name}</td>
              <td>{item.phone}</td>
              <td>{item.people}</td>
              <td>
                {new Date(item.reservation_time).toLocaleString()}
              </td>
              <td>{item.table_name}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}