import { Link, Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <div style={styles.page}>

      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.logo}>🍽 Restaurant</div>

        <nav style={styles.nav}>
        <Link to="/" style={styles.link}>Trang chủ</Link>
        <Link to="/menu" style={styles.link}>Thực đơn</Link>
        <Link to="/recruitment" style={styles.link}>Tuyển dụng</Link>
        <Link to="/order" style={styles.link}>Đặt món</Link>
        <Link to="/reservation" style={styles.link}>Đặt bàn</Link>
        <Link to="/track" style={styles.link}>Theo dõi</Link>
        
      </nav>
      </header>

      {/* CONTENT (SCROLL AREA) */}
      <main style={styles.content}>
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer style={styles.footer}>
        © 2026 Restaurant Pro • All rights reserved
      </footer>

    </div>
  );
}

/* ================= STYLE ================= */
const styles = {
  page: {
    fontFamily: "Arial",
    background: "#faf7f2",
    height: "100vh",          // 🔥 quan trọng
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",       // 🔥 khóa scroll toàn page
  },

  header: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    background: "#111",
    color: "white",
    padding: "15px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f4c542",
  },

  nav: {
    display: "flex",
    gap: 20,
  },

  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: 500,
    padding: "6px 10px",
    borderRadius: 6,
  },

  content: {
    flex: 1,
    overflowY: "auto",   // 🔥 scroll nằm ở đây
  },

  footer: {
    background: "#111",
    color: "white",
    textAlign: "center",
    padding: 20,
  },
};