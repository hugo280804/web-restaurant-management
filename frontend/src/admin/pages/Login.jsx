import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });

       localStorage.clear();

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Đăng nhập thành công");

      const role = res.data.user.role;

      if (role === "Admin") window.location.href = "/admin/orders";
      else if (role === "Bếp") window.location.href = "/admin/kitchen";
      else if (role === "Phục vụ") window.location.href = "/admin/orders";
      else window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi đăng nhập");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>🍽 Restaurant Login</h2>

        <input
          style={styles.input}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleLogin}>
          Đăng nhập
        </button>
      </div>
    </div>
  );
}

/* ================= STYLE (THEO INGREDIENT THEME) ================= */
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f1ea",
    fontFamily: '"Segoe UI", sans-serif',
  },

  box: {
    width: "380px",
    padding: "30px",
    background: "#fff8f0",
    border: "1px solid #e0d6c8",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
  },

  title: {
    marginBottom: "20px",
    color: "#4b2e1e",
    fontSize: "22px",
    fontWeight: "600",
  },

  input: {
    width: "100%",
    padding: "10px 12px",
    marginBottom: "12px",
    border: "1px solid #d2b48c",
    borderRadius: "8px",
    background: "#fff8f0",
    color: "#4b2e1e",
    fontSize: "14px",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    background: "#a67c52",
    color: "#fff8f0",
    fontSize: "15px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "0.2s",
  },
};