import { useEffect, useState } from "react";
import api from "../../api/axiosClient";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FILTER STATE
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const formatMoney = (value) => {
  if (!value) return "0 đ";
  return Number(value).toLocaleString("vi-VN") + " đ";
};

  // ===== LOAD ORDERS =====
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.log("Lỗi load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // ===== LOAD ITEMS =====
  const fetchItems = async (orderID) => {
    try {
      const res = await api.get(`/orders/${orderID}/items`);
      setItems(res.data);
    } catch (err) {
      console.log("Lỗi load items:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ===== FILTER =====
  const filteredOrders = orders.filter((o) => {
    const keyword = search.toLowerCase();

    const matchSearch =
      o.order_ID.toString().includes(keyword) ||
      (o.table_name || "").toLowerCase().includes(keyword) ||
      (o.employee_name || "").toLowerCase().includes(keyword);

    const matchStatus =
      !filterStatus || o.status === filterStatus;

    const orderDate = new Date(o.created_at);

    const matchFrom =
      !fromDate || orderDate >= new Date(fromDate);

    const matchTo =
      !toDate || orderDate <= new Date(toDate + " 23:59:59");

    return matchSearch && matchStatus && matchFrom && matchTo;
  });

  // ===== STATUS STYLE =====
  const getStatusClass = (status) => {
    switch (status) {
      case "Chờ xác nhận":
        return "status pending";
      case "Đang chế biến":
        return "status cooking";
      case "Hoàn thành":
        return "status done";
      case "Đã thanh toán":
        return "status paid";
      default:
        return "status";
    }
  };

  // ===== PAY =====
  const handlePay = async (id) => {
    try {
      await api.put(`/orders/pay/${id}`);
      fetchOrders();
      setSelected(null);
    } catch (err) {
      console.log("Lỗi thanh toán:", err);
    }
  };

  return (
    <div className="orders-page">

      {/* ===== CSS INLINE ===== */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: "Segoe UI", sans-serif;
        }

        .orders-page {
          padding: 20px;
          background: #f5f1ea;
          min-height: 100vh;
        }

        .orders-page h2 {
          margin-bottom: 15px;
          color: #4b2e1e;
        }

        .filter-bar {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
          flex-wrap: wrap;
        }

        .filter-bar input,
        .filter-bar select {
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #d2b48c;
          background: #fff8f0;
        }

        .filter-bar button {
          padding: 8px 14px;
          border-radius: 8px;
          border: none;
          background: #a67c52;
          color: #fff8f0;
          cursor: pointer;
        }

        .filter-bar button:hover {
          background: #8c6239;
        }

        .orders-container {
          display: flex;
          gap: 20px;
        }

        .orders-list {
          flex: 1;
        }

        .orders-table {
          width: 100%;
          border-collapse: collapse;
          background: #fff;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .orders-table th,
        .orders-table td {
          padding: 10px;
          border: 1px solid #e0d6c8;
          text-align: center;
        }

        .orders-table th {
          background: #fdf6f3;
          color: #5c4033;
        }

        .orders-table button {
          padding: 5px 10px;
          border-radius: 6px;
          border: none;
          background: #a67c52;
          color: white;
          cursor: pointer;
        }

        .orders-table button:hover {
          background: #8c6239;
        }

        .status {
          padding: 4px 8px;
          border-radius: 6px;
          color: white;
        }

        .pending { background: orange; }
        .cooking { background: blue; }
        .done { background: green; }
        .paid { background: purple; }

        .order-detail {
          width: 400px;
          background: #fff8f0;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .items-table {
          width: 100%;
          margin-top: 10px;
          border-collapse: collapse;
        }

        .items-table th,
        .items-table td {
          padding: 8px;
          border: 1px solid #e0d6c8;
          text-align: center;
        }

        .pay-btn {
          margin-top: 10px;
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: none;
          background: #d2691e;
          color: white;
          cursor: pointer;
        }

        .close-btn {
          margin-top: 10px;
          width: 100%;
          padding: 8px;
          border-radius: 8px;
          border: none;
          background: #8c6239;
          color: white;
          cursor: pointer;
        }
      `}</style>

      <h2>📦 Quản lý đơn hàng</h2>

      {/* ===== FILTER ===== */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="🔍 Tìm ID, bàn, nhân viên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Tất cả</option>
          <option>Chờ xác nhận</option>
          <option>Đang chế biến</option>
          <option>Hoàn thành</option>
          <option>Đã thanh toán</option>
        </select>

        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />

        <button
          onClick={() => {
            setSearch("");
            setFilterStatus("");
            setFromDate("");
            setToDate("");
          }}
        >
          Reset
        </button>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="orders-container">

          {/* ===== LIST ===== */}
          <div className="orders-list">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Bàn</th>
                  <th>Nhân viên</th>
                  <th>Trạng thái</th>
                  <th>Tổng</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((o) => (
                  <tr key={o.order_ID}>
                    <td>#{o.order_ID}</td>
                    <td>{o.table_name}</td>
                    <td>{o.employee_name}</td>

                    <td>
                      <span className={getStatusClass(o.status)}>
                        {o.status}
                      </span>
                    </td>

                   <td>
              {Number(o.total_amount || 0).toLocaleString("vi-VN")} đ
            </td>

                    <td>
                      <button
                        onClick={() => {
                          setSelected(o);
                          fetchItems(o.order_ID);
                        }}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ===== DETAIL ===== */}
          {selected && (
            <div className="order-detail">
              <h3>Đơn #{selected.order_ID}</h3>

              <p>Bàn: {selected.table_name}</p>
              <p>Nhân viên: {selected.employee_name}</p>

              <table className="items-table">
                <thead>
                  <tr>
                    <th>Món</th>
                    <th>SL</th>
                    <th>Giá</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((i) => (
                    <tr key={i.order_detail_ID}>
                      <td>{i.menu_name}</td>
                      <td>{i.quantity}</td>
                      <td>{formatMoney(i.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                className="pay-btn"
                onClick={() => handlePay(selected.order_ID)}
              >
                Thanh toán
              </button>

              <button
                className="close-btn"
                onClick={() => setSelected(null)}
              >
                Đóng
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}