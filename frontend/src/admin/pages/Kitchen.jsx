import { useEffect, useState } from "react";
import styled from "styled-components";
import api from "../../api/axiosClient";

// ===== THEME =====
const colors = {
  bg: "#f6f1e9",
  card: "#fffaf3",
  primary: "#c19a6b",
  cooking: "#3498db",
  done: "#2ecc71",
  pending: "#f39c12",
  danger: "#e74c3c",
  text: "#3e2a1f"
};

// ===== LAYOUT =====
const Page = styled.div`
  padding: 20px;
  background: ${colors.bg};
  min-height: 100vh;
`;

const Title = styled.h2`
  margin-bottom: 10px;
  color: ${colors.text};
`;

// ===== TOOLBAR =====
const Toolbar = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 16px;

  select {
    padding: 6px 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
    background: white;
    cursor: pointer;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  gap: 18px;
`;

// ===== CARD =====
const Card = styled.div`
  background: ${colors.card};
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 6px 16px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  border: ${(p) => (p.late ? "2px solid red" : "2px solid #f0e6d6")};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-weight: 600;
  color: ${colors.text};
`;

const TableName = styled.div`
  font-size: 18px;
`;

const Time = styled.div`
  font-size: 12px;
  color: #999;
`;

// ===== ITEM =====
const Item = styled.div`
  background: ${(p) => (p.error ? "#ffe6e6" : "white")};
  border: 1px solid ${(p) => (p.error ? "red" : "#eee")};
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
`;

const ItemName = styled.div`
  font-weight: 600;
  margin-bottom: 6px;
  color: ${colors.text};
`;

const Row = styled.div`
  display: flex;
  gap: 6px;
`;

// ===== BUTTON =====
const Button = styled.button`
  flex: 1;
  padding: 6px;
  border-radius: 6px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  color: white;
  transition: 0.2s;

  background: ${(p) => {
    if (p.type === "pending") return colors.pending;
    if (p.type === "cooking") return colors.cooking;
    if (p.type === "done") return colors.done;
    if (p.type === "danger") return colors.danger;
    return colors.primary;
  }};

  &:hover {
    filter: brightness(0.9);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

// ===== EMPTY =====
const Empty = styled.div`
  text-align: center;
  color: #999;
  margin-top: 60px;
`;

// ===== COMPONENT =====
export default function KitchenOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filterStatus, setFilterStatus] = useState("all");
  const [sortType, setSortType] = useState("oldest");

  // ===== FETCH =====
  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/details/all");

      const grouped = {};
      res.data.forEach(item => {
        if (!grouped[item.order_ID]) {
          grouped[item.order_ID] = {
            ...item,
            items: []
          };
        }

        grouped[item.order_ID].items.push({
          ...item,
          pendingQty: item.pendingQty ?? item.quantity,
          cookingQty: item.cookingQty ?? 0,
          doneQty: item.doneQty ?? 0,
        });
      });

      setOrders(Object.values(grouped));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
    const i = setInterval(fetchOrders, 5000);
    return () => clearInterval(i);
  }, []);

  // ===== FILTER + SORT =====
  const processedOrders = orders
    .filter(o => {
      if (filterStatus === "all") return true;

      const allDone = o.items.every(i => i.doneQty >= i.quantity);

      if (filterStatus === "done") return allDone;
      if (filterStatus === "processing") return !allDone;
    })
    .sort((a, b) => {
      const t1 = new Date(a.created_at).getTime();
      const t2 = new Date(b.created_at).getTime();
      return sortType === "oldest" ? t1 - t2 : t2 - t1;
    });

  // ===== CHECK ĐƠN LÂU =====
  const isLate = (time) => {
    return Date.now() - new Date(time).getTime() > 10 * 60 * 1000;
  };

  // ===== UPDATE =====
const updateStatus = async (id, action, qty) => {
  try {
    setLoading(true);

    await api.put(`/orders/details/${id}/status`, {
      action,
      quantity: qty // 🔥 bắt buộc
    });

    await fetchOrders();
  } catch (err) {
    console.error("API ERROR:", err.response?.data || err);
    alert(err.response?.data?.message || "Lỗi cập nhật");
  } finally {
    setLoading(false);
  }
};
  const updateAll = async (orderID, action) => {
    try {
      setLoading(true);
      await api.put(`/orders/${orderID}/status/all`, { action });
      fetchOrders();
    } catch {
      alert("Lỗi xử lý");
    } finally {
      setLoading(false);
    }
  };
const updateKitchenNote = async (id, note) => {
  try {
    await api.patch(`/order-details/${id}/note`, {
      note,
      role: "kitchen"
    });

    fetchOrders();
  } catch (err) {
    console.error(err);
    alert("Lỗi ghi chú");
  }
};
const formatNumber = (value) => {
  if (!value) return value;

  const num = parseFloat(value);
  if (isNaN(num)) return value;

  return Number.isInteger(num) ? num : num.toFixed(2).replace(/\.00$/, "");
};
  // ===== PRINT =====
  const printOrder = async (id) => {
  try {
    const res = await api.get(`/orders/${id}/print`);
    const data = res.data;

    if (!data || !data.items?.length) {
      alert("Không có dữ liệu để in");
      return;
    }

    const time = new Date(data.created_at).toLocaleString("vi-VN");

    let html = `
      <html>
      <head>
        <style>
          body {
            font-family: monospace;
            width: 280px;
            padding: 10px;
          }
          h3 { text-align:center; margin:5px 0; }
          .line { border-top:1px dashed black; margin:6px 0; }
          .menu { font-weight:bold; }
          ul { margin:4px 0 8px 14px; padding:0; }
          li { font-size:12px; }
        </style>
      </head>
      <body>

        <h3>🍳 PHIẾU BẾP</h3>

        <p><b>Bàn:</b> ${data.table || "---"}</p>
        <p><b>NV:</b> ${data.employee || "---"}</p>
        <p><b>Giờ:</b> ${time}</p>

        <div class="line"></div>
    `;

    data.items.forEach((item, i) => {
      html += `
        <div>
          <div class="menu">${i + 1}. ${item.menu}</div>
      `;

      // ✅ IN NGUYÊN LIỆU
      if (item.ingredients && item.ingredients.length > 0) {
        html += `<ul>`;
        item.ingredients.forEach(ing => {
          html += `<li>${ing.replace(/(\d+(\.\d+)?)g/g, (match) => {
  const num = parseFloat(match);
  return (Number.isInteger(num) ? num : num.toFixed(2).replace(/\.00$/, "")) + "g";
})}</li>`;
        });
        html += `</ul>`;
      }

      html += `</div>`;
    });

    html += `
        <div class="line"></div>
        <p style="text-align:center">***</p>
      </body>
      </html>
    `;

    const w = window.open("", "", "width=300,height=600");
    w.document.write(html);
    w.document.close();
    w.print();

  } catch (err) {
    console.error(err);
    alert("Lỗi in");
  }
};
  // ===== RENDER =====
  return (
    <Page>
      <Title>🍳 Màn hình bếp</Title>

      {/* FILTER */}
      <Toolbar>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">Tất cả</option>
          <option value="processing">Chưa hoàn thành</option>
          <option value="done">Đã hoàn thành</option>
        </select>

        <select value={sortType} onChange={e => setSortType(e.target.value)}>
          <option value="oldest">Cũ → Mới</option>
          <option value="newest">Mới → Cũ</option>
        </select>
      </Toolbar>

      {processedOrders.length === 0 && <Empty>Không có đơn</Empty>}

      <Grid>
        {processedOrders.map(o => (
          <Card key={o.order_ID} late={isLate(o.created_at)}>
            <Header>
              <TableName>🍽 Bàn {o.table_name}</TableName>
              <Time>{new Date(o.created_at).toLocaleTimeString()}</Time>
            </Header>

                      {o.items.map(i => (
              <Item key={i.order_detail_ID} error={!i.canCook}>

                {/* ✅ TÊN MÓN */}
                <ItemName>{i.menu_name}</ItemName>

                {/* ✅ NOTE KHÁCH */}
                {i.note_from_waiter && (
                  <div style={{ fontSize: "12px", color: "#555", marginBottom: "4px" }}>
                    🧾 Note: {i.note_from_waiter}
                  </div>
                )}

               

                {/* 🚨 THIẾU NGUYÊN LIỆU */}
                {!i.canCook && i.missingIngredients?.length > 0 && (
                  <div style={{ color: "red", fontSize: "12px", marginBottom: "6px" }}>
                    ⚠ Thiếu:
                    {i.missingIngredients.map((m, idx) => (
                      <div key={idx}>
                        - {m.name}: thiếu {m.thieu} {m.unit} (còn {m.current}, cần {m.required})
                      </div>
                    ))}
                  </div>
                )}

                {/* ✅ BUTTON */}
                <Row>
                  <Button
                    type="pending"
                    disabled={!i.canCook || (i.pendingQty ?? 0) <= 0 || loading}
                    onClick={() =>
                      updateStatus(i.order_detail_ID, "pending", i.pendingQty)
                    }
                  >
                    ⏳ {i.pendingQty}
                  </Button>

                  <Button
                    type="cooking"
                    disabled={(i.cookingQty ?? 0) <= 0 || loading}
                    onClick={() =>
                      updateStatus(i.order_detail_ID, "cooking", i.cookingQty)
                    }
                  >
                    🔥 {i.cookingQty}
                  </Button>

                  <Button type="done">
                    ✅ {i.doneQty}
                  </Button>
                </Row>

              </Item>
            ))}
                        <Row>
              <Button onClick={() => updateAll(o.order_ID, "pending")}>
                🚀 Nấu hết
              </Button>

              <Button type="done" onClick={() => updateAll(o.order_ID, "cooking")}>
                ✔ Xong hết
              </Button>

              <Button type="danger" onClick={() => printOrder(o.order_ID)}>
                🖨 In
              </Button>
            </Row>
          </Card>
        ))}
      </Grid>
    </Page>
  );
}