import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

// ===== STYLED COMPONENTS =====
const Container = styled.div`
  padding: 20px;
  background: #f5f1ea;
  min-height: 100vh;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

const OrderCard = styled.div`
  background: #fff8f0;
  padding: 16px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: 0.2s;

  &:hover {
    box-shadow: 0 6px 18px rgba(0,0,0,0.15);
    transform: translateY(-2px);
  }
`;

const OrderHeader = styled.div`
  font-weight: 600;
  text-align: center;
  color: #4b2e1e;
  margin-bottom: 12px;
`;

const ItemList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const ItemCard = styled.div`
  background: #fff8f0;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
`;

const ItemName = styled.div`
  font-weight: 500;
  margin-bottom: 8px;
  color: #4b2e1e;
  text-align: center;
`;

const IngredientList = styled.ul`
  list-style-type: disc;
  padding-left: 16px;
  font-size: 0.9rem;
  color: #5c4033;
  margin-bottom: 10px;
`;

const StatusRow = styled.div`
  display: flex;
  gap: 6px;
  justify-content: center;
`;

const StatusButton = styled.button`
  flex: 1;
  height: 36px;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-weight: bold;
  transition: 0.2s;

  background: ${(p) => {
    if (p.status === "Chờ nấu") return "#f0ad4e";
    if (p.status === "Đang chế biến") return "#5bc0de";
    if (p.status === "Hoàn thành") return "#5cb85c";
  }};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    filter: brightness(0.9);
  }
`;

const BottomButtons = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 6px;

  button {
    flex: 1;
    padding: 10px 12px;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    color: white;
    transition: 0.2s;
  }

  button:nth-child(1) { background: #5bc0de; } /* Chế biến tất cả */
  button:nth-child(2) { background: #5cb85c; } /* Hoàn thành tất cả */
  button:nth-child(3) { background: #d9534f; } /* In phiếu */

  button:hover {
    filter: brightness(0.9);
  }
`;

// ===== COMPONENT =====
export default function KitchenOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // ===== PRINT FUNCTION =====
  const printOrder = async (orderID) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/${orderID}/print`);
      const data = res.data;

      if (!data || !data.items?.length) {
        alert("Không có dữ liệu để in");
        return;
      }

      let html = `
        <html>
        <head>
          <title>Print</title>
          <style>
            body { font-family: monospace; width: 300px; }
            h3 { text-align: center; }
            hr { border: 1px dashed black; }
            ul { padding-left: 16px; margin: 0; }
          </style>
        </head>
        <body>
          <h3>PHIẾU BẾP</h3>
          <p>Bàn: ${data.table || ""}</p>
          <p>Nhân viên: ${data.employee || ""}</p>
          <p>Giờ: ${new Date(data.created_at).toLocaleTimeString()}</p>
          <hr/>
      `;

      data.items.forEach(item => {
        html += `<p>${item.menu}</p><ul>`;
        item.ingredients.forEach(ing => html += `<li>${ing}</li>`);
        html += `</ul>`;
      });

      html += `<hr/><p style="text-align:center">***</p></body></html>`;

      const win = window.open("", "", "width=300,height=600");
      win.document.write(html);
      win.document.close();
      win.print();
    } catch (err) {
      console.error(err);
      alert("Lỗi in phiếu");
    }
  };

  // ===== FETCH ORDERS =====
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders/details/all");
      const data = Array.isArray(res.data) ? res.data : [];

      const grouped = {};
      data.forEach(item => {
        if (!grouped[item.order_ID]) {
          grouped[item.order_ID] = {
            order_ID: item.order_ID,
            table_name: item.table_name ?? "",
            employee_name: item.employee_name ?? "",
            created_at: item.created_at,
            items: [],
          };
        }

        const ingredients = item.ingredients?.map(
          ing => `${ing.ingredient_name}: ${ing.total_required}${ing.unit}`
        ) ?? [];

        grouped[item.order_ID].items.push({
          ...item,
          pendingQty: item.pendingQty ?? item.quantity ?? 0,
          cookingQty: item.cookingQty ?? 0,
          doneQty: item.doneQty ?? 0,
          ingredients,
          menu: `${item.menu_name} x${item.quantity}`
        });
      });

      setOrders(Object.values(grouped));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  // ===== UPDATE 1 ITEM =====
  const updateStatus = async (item, action) => {
    try {
      setLoading(true);
      await axios.put(`http://localhost:5000/api/orders/details/${item.order_detail_ID}/status`, { action });
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Lỗi xử lý món");
    } finally {
      setLoading(false);
    }
  };

  // ===== UPDATE ALL =====
  const updateAll = async (orderID, action) => {
    try {
      setLoading(true);
      await axios.put(`http://localhost:5000/api/orders/${orderID}/status/all`, { action });
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Lỗi chế biến tất cả");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      {orders.map(order => (
        <OrderCard key={order.order_ID}>
          <OrderHeader>Bàn {order.table_name} - {order.employee_name}</OrderHeader>

          <ItemList>
            {order.items.map(item => (
              <ItemCard key={item.order_detail_ID}>
                <ItemName>{item.menu}</ItemName>
                <IngredientList>
                  {item.ingredients.map((ing, idx) => <li key={idx}>{ing}</li>)}
                </IngredientList>

                <StatusRow>
                  <StatusButton status="Chờ nấu" disabled={item.pendingQty === 0 || loading} onClick={() => updateStatus(item, "pending")}>{item.pendingQty} →</StatusButton>
                  <StatusButton status="Đang chế biến" disabled={item.cookingQty === 0 || loading} onClick={() => updateStatus(item, "cooking")}>{item.cookingQty} →</StatusButton>
                  <StatusButton status="Hoàn thành" disabled>{item.doneQty}</StatusButton>
                </StatusRow>
              </ItemCard>
            ))}
          </ItemList>

          <BottomButtons>
            <button onClick={() => updateAll(order.order_ID, "pending")}>Chế biến tất cả</button>
            <button onClick={() => updateAll(order.order_ID, "cooking")}>Hoàn thành tất cả</button>
            <button onClick={() => printOrder(order.order_ID)}>In phiếu</button>
          </BottomButtons>

          <OrderHeader>{new Date(order.created_at).toLocaleTimeString()}</OrderHeader>
        </OrderCard>
      ))}
    </Container>
  );
}