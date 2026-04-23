import { useEffect, useState } from "react";
import axios from "axios";
import "react-quill/dist/quill.snow.css";

export default function Home() {
  const [home, setHome] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/home")
      .then((res) => setHome(res.data))
      .catch((err) => console.log(err));
  }, []);

  if (!home) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div>

      {/* ===== QUILL STYLE ===== */}
<style>{`
  body {
    margin: 0;
    font-family: "Segoe UI", sans-serif;
    background: #f3ede7;
  }

  .ql-editor {
    /* XÓA DÒNG all: unset; */
    font-family: inherit;
    color: #3b2a22;
    line-height: 1.8;
    font-size: 16px;
    padding: 0; /* Nếu muốn sát viền card */
  }

  /* Đảm bảo ảnh trong nội dung Quill cũng không bị méo */
  .ql-editor img {
    max-width: 100%;
    height: auto; 
    border-radius: 12px;
    margin: 15px 0;
    display: block;
  }

  .ql-align-center { text-align: center !important; }
  .ql-align-right { text-align: right !important; }
  .ql-align-justify { text-align: justify !important; }
`}</style>
      {/* ===== HERO ===== */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay}>
          <h1 style={styles.heroTitle}>Ẩm thực tinh tế</h1>
          <p style={styles.heroSubtitle}>
            Không gian sang trọng • Hương vị chuẩn Fine Dining
          </p>
          <button style={styles.heroBtn}>Khám phá ngay</button>
        </div>
      </section>

      {/* ===== CONTENT ===== */}
      <section style={styles.section}>
        <div style={styles.container}>

          <div style={styles.card}>

            {/* TITLE + DESCRIPTION */}
            <div className="ql-editor">
              <div
                dangerouslySetInnerHTML={{ __html: home.title }}
                style={{ marginBottom: 20, fontWeight: "bold" }}
              />

              <div
                dangerouslySetInnerHTML={{ __html: home.description }}
              />
            </div>

            {/* IMAGE */}
            {home.banner_url && (
              <div style={styles.bannerWrap}>
                <img
                  src={`http://localhost:5000${home.banner_url}`}
                  alt="banner"
                  style={styles.banner}
                />
                
              </div>
            )}

          </div>

        </div>
      </section>
    </div>
  );
}

/* ================= STYLE ================= */
const styles = {

  /* HERO */
  hero: {
    height: "100vh",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1552566626-52f8b828add9')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
  },

  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    textAlign: "center",
    padding: 20,
  },

  heroTitle: {
    fontSize: "64px",
    fontWeight: "bold",
    margin: 0,
    letterSpacing: "2px",
  },

  heroSubtitle: {
    marginTop: 10,
    fontSize: 18,
    opacity: 0.9,
  },

  heroBtn: {
    marginTop: 25,
    padding: "12px 25px",
    border: "none",
    borderRadius: "30px",
    background: "#c89b3c",
    color: "white",
    fontSize: 16,
    cursor: "pointer",
    transition: "0.3s",
  },

  /* SECTION */
  section: {
    padding: "80px 0",
    background: "linear-gradient(180deg, #f3ede7 0%, #ffffff 100%)",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "0 20px",
  },

  /* CARD */
  card: {
    background: "#fffaf5",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
    textAlign: "center",
  },

  /* BANNER */
/* Sửa lại trong đối tượng styles */
/* Tìm đến phần BANNER trong styles và thay bằng đoạn này */
bannerWrap: {
  position: "relative",
  marginTop: 50,
  borderRadius: 15,
  overflow: "hidden",
  width: "100%", // Đảm bảo khung chiếm hết chiều rộng card
},

banner: {
  width: "100%",
  height: "auto",      // CỰC KỲ QUAN TRỌNG: Giúp giữ đúng tỉ lệ mâm cơm
  display: "block",    // Loại bỏ khoảng trống thừa phía dưới ảnh
  objectFit: "initial", // Đưa về mặc định để không bị can thiệp bởi cover/contain
  transition: "transform 0.5s ease",
},
  bannerOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "24px",
    fontWeight: "bold",
  },
};