import { useState } from "react";

export default function Recruitment() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    position: "",
    note: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("🎉 Gửi hồ sơ thành công! Chúng tôi sẽ liên hệ sớm.");
  };

  return (
    <div style={styles.page}>

      <div style={styles.card}>
        <h1 style={styles.title}>Tuyển dụng nhân sự</h1>

        <p style={styles.subtitle}>
          Gia nhập đội ngũ nhà hàng cao cấp của chúng tôi 🍽  
          Môi trường chuyên nghiệp – thu nhập hấp dẫn – cơ hội phát triển.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>

          <input
            name="name"
            placeholder="Họ và tên"
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="phone"
            placeholder="Số điện thoại"
            onChange={handleChange}
            style={styles.input}
          />

          <select
            name="position"
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">-- Chọn vị trí ứng tuyển --</option>
            <option>Nhân viên phục vụ</option>
            <option>Pha chế (Bartender)</option>
            <option>Đầu bếp</option>
            <option>Lễ tân</option>
            <option>Phụ bếp</option>
          </select>

          <textarea
            name="note"
            placeholder="Giới thiệu bản thân / kinh nghiệm làm việc..."
            onChange={handleChange}
            style={styles.textarea}
          />

          <button type="submit" style={styles.button}>
            Gửi hồ sơ ứng tuyển
          </button>

        </form>
      </div>

    </div>
  );
}

/* ================= STYLE ================= */
const styles = {
  page: {
    padding: "70px 20px",
    background: "linear-gradient(180deg, #f3ede7, #ffffff)",
    minHeight: "100%",
  },

  card: {
    maxWidth: 650,
    margin: "0 auto",
    background: "#fffaf5",
    padding: 45,
    borderRadius: 20,
    boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
    textAlign: "center",
  },

  title: {
    fontSize: 32,
    marginBottom: 10,
    color: "#3b2a22",
  },

  subtitle: {
    marginBottom: 30,
    color: "#666",
    fontSize: 15,
    lineHeight: 1.6,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },

  input: {
    padding: 12,
    borderRadius: 10,
    border: "1px solid #ddd",
    fontSize: 14,
    outline: "none",
  },

  textarea: {
    padding: 12,
    borderRadius: 10,
    border: "1px solid #ddd",
    minHeight: 110,
    resize: "none",
    fontSize: 14,
  },

  button: {
    padding: 13,
    borderRadius: 10,
    border: "none",
    background: "#c89b3c",
    color: "white",
    fontSize: 16,
    cursor: "pointer",
    fontWeight: "bold",
  },
};