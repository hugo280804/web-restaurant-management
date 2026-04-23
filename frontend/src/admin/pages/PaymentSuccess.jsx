import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const updatePayment = async () => {
      try {
        // Lấy query từ MoMo trả về URL
        const query = new URLSearchParams(window.location.search);

        const orderId = query.get("orderId");
        const resultCode = query.get("resultCode");

        // Nếu thanh toán thành công
        if (resultCode === "0") {
          await axios.put(
            `http://localhost:5000/api/orders/pay/${orderId}`,
            {
              payment_method: "MoMo",
            }
          );

          alert("Thanh toán MoMo thành công 🎉");

          // quay về trang bàn
          navigate("/");
        } else {
          alert("Thanh toán thất bại ❌");
          navigate("/");
        }
      } catch (err) {
        console.error(err);
        alert("Lỗi xử lý thanh toán");
        navigate("/");
      }
    };

    updatePayment();
  }, [navigate]);

  return (
    <div style={styles.container}>
      <h2>Đang xử lý thanh toán...</h2>
      <p>Vui lòng chờ trong giây lát</p>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f1ea",
    fontFamily: "Arial",
  },
};