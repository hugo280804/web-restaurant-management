import { useEffect, useState } from "react";
import axios from "axios";

export default function Menu() {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/menus")
      .then((res) => setMenu(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.title}>🍽 Menu Nhà Hàng</h1>
        <p style={styles.subtitle}>
          Khám phá các món ăn đặc trưng được chế biến tinh tế
        </p>
      </div>

      {/* GRID */}
      <div style={styles.grid}>
        {menu.map((item) => (
          <div key={item.menu_ID} style={styles.card}>

            {/* IMAGE */}
            <div style={styles.imgBox}>
              <img
                src={`http://localhost:5000${item.image_url}`}
                alt=""
                style={styles.img}
              />
            </div>

            {/* INFO */}
            <div style={styles.content}>
              <h3 style={styles.name}>{item.menu_name}</h3>

              <p style={styles.desc}>
                Món ăn đặc trưng, nguyên liệu tươi mỗi ngày
              </p>

              <div style={styles.row}>
                <span style={styles.price}>
                  {(item.price || 0).toLocaleString()} đ
                </span>

                <button style={styles.btn}>
                  + Thêm món
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

/* ================= STYLE ================= */
const styles = {

page: {
  padding: "60px 20px",
  maxWidth: 1200,
  margin: "0 auto",
  background: "#fff",
},

header: {
  textAlign: "center",
  marginBottom: 50,
},

title: {
  fontSize: 38,
  fontWeight: "bold",
  color: "#222",
},

subtitle: {
  marginTop: 10,
  color: "#777",
  fontSize: 16,
},

grid: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: 35,
},

/* CARD */
card: {
  background: "#fff",
  borderRadius: 18,
  overflow: "hidden",
  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
  transition: "0.3s",
  cursor: "pointer",
},

imgBox: {
  height: 220,
  overflow: "hidden",
},

img: {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "0.4s",
},

content: {
  padding: 18,
},

name: {
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 8,
  color: "#111",
},

desc: {
  fontSize: 13,
  color: "#777",
  marginBottom: 15,
  lineHeight: 1.4,
},

row: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
},

price: {
  color: "#c0392b",
  fontWeight: "bold",
  fontSize: 16,
},

btn: {
  padding: "8px 14px",
  borderRadius: 10,
  border: "none",
  background: "#111",
  color: "white",
  cursor: "pointer",
  fontSize: 13,
},
};