import { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

// ===== STYLED COMPONENTS =====
const Layout = styled.div`
  display: flex;
  height: 100vh;
  background: #f5f1ea;
`;

const LeftPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const FloorTabs = styled.div`
  display: flex;
  gap: 10px;
  padding: 12px;
  background: #fffaf3;
  border-bottom: 1px solid #e0d6c8;
  overflow-x: auto;
  button {
    padding: 6px 14px;
    background: #e9dfd3;
    color: #5c4033;
    border-radius: 10px;
    font-weight: 500;
    white-space: nowrap;
    cursor: pointer;
    border: none;
  }
  button:hover {
    background: #d8c7b3;
  }
  .active {
    background: linear-gradient(135deg, #c8a97e, #e0c097);
    font-weight: 600;
  }
`;

const MapContainer = styled.div`
  flex: 1;
  position: relative;
  background: #f3ede5;
`;

const Table = styled.div`
  position: absolute;
  width: 100px;
  height: 110px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  user-select: none;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.18);
  transition: 0.2s;

  &.empty {
    background: linear-gradient(145deg, #d2b48c, #c19a6b); // 🟤 Trống
  }

  &.serving {
    background: linear-gradient(145deg, #ff7043, #ff5722); // 🔴 Đang phục vụ
    color: white;
  }

  &.reserved {
    background: linear-gradient(145deg, #42a5f5, #1e88e5); // 🔵 Đã đặt
    color: white;
  }

  &.selected {
    border: 2px solid #ffcc80;
  }
`;

const TableIcon = styled.div`
  font-size: 20px;
`;
const TableName = styled.div`
  font-weight: 600;
  color: #4b2e1e;
`;
const TableInfo = styled.div`
  background: rgba(255, 255, 255, 0.7);
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 13px;
  color: #3e2a1f;
`;

const RightPanel = styled.div`
  width: 450px;
  border-left: 1px solid #e0d6c8;
  padding: 12px;
  overflow-y: auto;
  background: #fffaf3;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 6px 10px;
  margin-bottom: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const CategorySelect = styled.select`
  width: 100%;
  padding: 6px 10px;
  margin-bottom: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const MenuItem = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
  padding: 8px;
  border-radius: 12px;
  background: #f5f1ea;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  align-items: center;
  img {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    object-fit: cover;
  }
  div {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  button {
    padding: 4px 8px;
    background: #c19a6b;
    border: none;
    color: white;
    border-radius: 8px;
    cursor: pointer;
  }
  button:hover {
    background: #a87b50;
  }
`;

const OrderPopup = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fffaf3;
  padding: 16px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

const OrderItemStyled = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #e0d6c8;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  button {
    padding: 2px 6px;
    background: #c19a6b;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  button:hover {
    background: #a87b50;
  }
`;

const NoteInput = styled.input`
  padding: 2px 6px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

// ===== COMPONENT =====
export default function TableMenuOrder() {
  const [floors, setFloors] = useState([]);
  const [currentFloor, setCurrentFloor] = useState("");
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); 
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState({}); // { tableID: [orderItems] }
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [floorsRes, tablesRes, menusRes, categoriesRes, ordersRes] = await Promise.all([
          axios.get("http://localhost:5000/api/floors"),
          axios.get("http://localhost:5000/api/tables"),
          axios.get("http://localhost:5000/api/menus"),
          axios.get("http://localhost:5000/api/categories"),
          axios.get("http://localhost:5000/api/orders")
        ]);

        setFloors(floorsRes.data || []);
        setCurrentFloor(floorsRes.data[0]?.floor_ID || "");

        const mappedTables = (tablesRes.data || []).map(t => ({
        id: t.table_ID,
        name: t.table_name,
        seats: t.seats_number,
        floor_ID: t.floor_ID,
        pos_x: t.pos_x || 50,
        pos_y: t.pos_y || 50,
        status: t.status // 🔥 thêm dòng này
      }));
        setTables(mappedTables);

        setMenus(menusRes.data || []);
        setCategories(categoriesRes.data || []);

        const mappedOrders = {};
        (ordersRes.data || []).forEach(order => {
          const tableID = order.table_ID;
          mappedOrders[tableID] = (order.order_details || []).map(item => ({
            ...item,
            status: item.status || "Chờ xác nhận",
            note_from_waiter: item.note_from_waiter || "",
            note_from_kitchen: item.note_from_kitchen || ""
          }));
        });
        setOrders(mappedOrders);

      } catch (err) {
        console.error("Lỗi load dữ liệu từ DB:", err);
      }
    };
    fetchData();
  }, []);

  const tablesByFloor = tables.filter(t => t.floor_ID === currentFloor);

const handleSelectTable = async (t) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/orders/table/${t.id}`);
    const order = res.data;

    
    setSelectedTable({
      ...t,
      customerPhone: order?.phone || "",
      paymentMethod: order?.payment_method || "Tiền mặt", // 🔥 FIX
      discountValue: order?.discount_amount || 0
    });
    const items = (order?.order_details || []).map(item => ({
      order_detail_ID: item.order_detail_ID, // 🔥 BẮT BUỘC
      menu_ID: item.menu_ID,
      menu_name: item.menu_name,
      price: item.price,
      quantity: item.quantity,
      status: item.status || "Chờ xác nhận",
      note_from_waiter: item.note_from_waiter || "",
      note_from_kitchen: item.note_from_kitchen || ""
    }));

    setOrders(prev => ({
      ...prev,
      [t.id]: items
    }));

  } catch (err) {
    console.error("Lỗi khi lấy orders:", err);
    setOrders(prev => ({ ...prev, [t.id]: [] }));
  }
};
const handleChangeQuantity = async (idx, delta) => {
  if (!selectedTable) return;

  const tableID = selectedTable.id;
  const item = orders[tableID][idx];

  const newQty = Math.max(1, item.quantity + delta);

  try {
    await axios.patch(
      `http://localhost:5000/api/orders/order-details/${item.order_detail_ID}/quantity`,
      { quantity: newQty }
    );

    const res = await axios.get(
      `http://localhost:5000/api/orders/table/${tableID}`
    );

    setOrders(prev => ({
      ...prev,
      [tableID]: res.data?.order_details || []
    }));

  } catch (err) {
    console.error(err);
  }
};
  const handleChangeNote = (idx, value) => {
    if (!selectedTable) return;
    const tableID = selectedTable.id;
    setOrders(prev => {
      const currentOrders = [...(prev[tableID] || [])];
      currentOrders[idx] = {
        ...currentOrders[idx],
        note_from_waiter: value
      };
      const item = currentOrders[idx];
      if(item?.order_detail_ID){
        axios.patch(`http://localhost:5000/api/orders/order-details/${item.order_detail_ID}/note`, {
        note: value,
        role: "waiter"
      }).catch(err => console.error("Lỗi cập nhật note:", err));
      }
      return { ...prev, [tableID]: currentOrders };
    });
  };

 const handleRemoveOrder = async (idx) => {
  const item = currentOrders[idx];

  if (item?.order_detail_ID) {
    await axios.delete(`http://localhost:5000/api/orders/items/${item.order_detail_ID}`);
  }

  setOrders(prev => {
    const updated = [...(prev[selectedTable.id] || [])];
    updated.splice(idx, 1);
    return { ...prev, [selectedTable.id]: updated };
  });
};
  const currentOrders = selectedTable ? orders[selectedTable.id] || [] : [];
  const totalTemp = currentOrders.reduce((sum, o) => sum + o.price * (o.quantity || 1), 0);

const handleSendOrder = async () => {
  if (!selectedTable) return alert("Chọn bàn trước!");

  const tableID = selectedTable.id;

  try {
    const resOrder = await axios.post("http://localhost:5000/api/orders", {
      table_ID: tableID,
      employee_ID: user.id,   
      phone: selectedTable.customerPhone || ""
    });

    const orderID = resOrder.data.order_ID;

    for (const item of currentOrders) {
      await axios.post(`http://localhost:5000/api/orders/${orderID}/items`, {
        menu_ID: item.menu_ID,
        quantity: item.quantity || 1,
        note: item.note_from_waiter || "",
        price: item.price
      });
    }

    alert("Gửi order thành công!");

    // ✅ FIX: load lại từ DB thay vì clear
    handleSelectTable(selectedTable);

  } catch (err) {
    console.error(err);
    alert("Lỗi gửi order");
  }
  await fetchTables(); // 🔥 thêm dòng này
};
const handlePay = async () => {
  if (!selectedTable) return;

  if (!selectedTable.paymentMethod) {
    return alert("Chọn phương thức thanh toán!");
  }

  try {
    // ===== CASE 1: MOMO =====
    if (selectedTable.paymentMethod === "MoMo") {
      const res = await axios.post(
        "http://localhost:5000/api/momo/create",
        {
          orderId: selectedTable.id,
          amount: totalTemp - (selectedTable.discountValue || 0),
        }
      );

      window.location.href = res.data.payUrl;
      return; // ⛔ dừng luôn, không chạy code bên dưới
    }

    // ===== CASE 2: THANH TOÁN THƯỜNG =====

    // 1. Lấy order
    const res = await axios.get(
      `http://localhost:5000/api/orders/table/${selectedTable.id}`
    );

    const orderID = res.data?.order_ID;
    if (!orderID) return alert("Không có order");

    // 2. Update payment
    await axios.put(
      `http://localhost:5000/api/orders/pay/${orderID}`,
      {
        payment_method: selectedTable.paymentMethod,
        discount_amount: selectedTable.discountValue || 0,
        phone: selectedTable.customerPhone || ""
      }
    );

    // 3. Lấy bill
    const billRes = await axios.get(
      `http://localhost:5000/api/orders/${orderID}/bill`
    );

    printBill(billRes.data);

    alert("Thanh toán & in hóa đơn thành công!");
    await fetchTables(); // 🔥 refresh table

  } catch (err) {
    console.error(err);
    alert("Lỗi thanh toán");
  }
};

const handleAddOrder = async (menu) => {
  if (!selectedTable) return alert("Chọn bàn trước!");

  const tableID = selectedTable.id;

  try {
    // 1. chỉ lấy hoặc tạo order
    const resOrder = await axios.post("http://localhost:5000/api/orders", {
      table_ID: tableID,
      employee_ID: user.id,   
      phone: selectedTable.customerPhone || ""
    });

    const orderID = resOrder.data.order_ID;

    // 2. thêm món
    await axios.post(`http://localhost:5000/api/orders/${orderID}/items`, {
      menu_ID: menu.menu_ID,
      quantity: 1,
      note: "",
      price: menu.price
    });

    // 3. reload
    const res = await axios.get(
      `http://localhost:5000/api/orders/table/${tableID}`
    );

    setOrders(prev => ({
      ...prev,
      [tableID]: res.data?.order_details || []
    }));

  } catch (err) {
    console.error(err);
    alert("Không thêm được món");
  }
};
const [selectedTables, setSelectedTables] = useState([]);

const toggleTableSelect = (id) => {
  setSelectedTables(prev =>
    prev.includes(id)
      ? prev.filter(x => x !== id)
      : [...prev, id]
  );
};
const handleMergeTables = async () => {
  if (selectedTables.length < 2) {
    return alert("Chọn ít nhất 2 bàn");
  }

  try {
    await axios.post("/api/orders/merge-tables", {
      tableIDs: selectedTables
    });

    alert("Gộp bàn thành công");

    setSelectedTables([]);
    fetchTables();

  } catch (err) {
    console.error(err);
    alert("Lỗi gộp bàn");
  }
};

const handleSplitTables = async () => {
  if (!selectedTable?.group_order_id) {
    return alert("Bàn này chưa được gộp");
  }

  try {
    await axios.post("/api/orders/split-table", {
      groupID: selectedTable.group_order_id
    });

    alert("Tách bàn thành công");

    setSelectedTable(null);
    fetchTables();

  } catch (err) {
    console.error(err);
    alert("Lỗi tách bàn");
  }
};
const splitBill = (orderID, itemIDs) => {
  // tạo order mới
  // chuyển item sang order mới
};
const fetchTables = async () => {
  const res = await axios.get("http://localhost:5000/api/tables");
  const mappedTables = (res.data || []).map(t => ({
    id: t.table_ID,
    name: t.table_name,
    seats: t.seats_number,
    floor_ID: t.floor_ID,
    pos_x: t.pos_x || 50,
    pos_y: t.pos_y || 50,
    group_order_id: t.group_order_id
  }));
  setTables(mappedTables);
};
const isGrouped = selectedTable?.group_order_id != null;
const filteredMenus = menus
  .filter(m => m.status === "Bật")
  .filter(m => selectedCategory ? m.category_ID === selectedCategory : true)
  .filter(m => m.menu_name.toLowerCase().includes(search.toLowerCase()));
  const printBill = (bill) => {
  const win = window.open("", "", "width=400,height=600");

  win.document.write(`
    <html>
      <head>
        <title>Hóa đơn</title>
        <style>
          body { font-family: Arial; font-size: 14px; }
          h2 { text-align: center; }
          table { width: 100%; border-collapse: collapse; }
          td { padding: 4px 0; }
          .right { text-align: right; }
          hr { margin: 8px 0; }
        </style>
      </head>
      <body>

        <h2>HÓA ĐƠN THANH TOÁN</h2>

        <p>Bàn: ${bill.table || ""}</p>
        <p>Nhân viên: ${bill.employee || ""}</p>
        <p>Thời gian: ${bill.created_at || ""}</p>

        <hr/>

        <table>
          ${bill.items.map(i => `
            <tr>
              <td>${i.menu_name} x${i.quantity}</td>
              <td class="right">${(i.price * i.quantity).toLocaleString("vi-VN")}đ</td>
            </tr>
          `).join("")}
        </table>

        <hr/>

        <p>Tạm tính: ${bill.total.toLocaleString("vi-VN")}đ</p>
        <p>Giảm giá: ${bill.discount.toLocaleString("vi-VN")}đ</p>

        <h3>Tổng: ${bill.final_total.toLocaleString("vi-VN")}đ</h3>

        <p>Thanh toán: ${bill.payment_method}</p>

        <hr/>
        <p style="text-align:center">Cảm ơn quý khách!</p>

      </body>
    </html>
  `);

  win.document.close();
  win.print();
};
  return (
    <Layout>
      <LeftPanel>
        <FloorTabs>
          {floors.map(f => (
            <button
              key={f.floor_ID}
              className={f.floor_ID === currentFloor ? "active" : ""}
              onClick={() => setCurrentFloor(f.floor_ID)}
            >
              {f.floor_name}
            </button>
          ))}
        </FloorTabs>
       {selectedTables.length >= 2 && (
            <button
              onClick={handleMergeTables}
              style={{
                position: "absolute",
                bottom: 20,
                left: 20,
                padding: "10px 14px",
                background: "#ff9800",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer"
              }}
            >
              🔗 Gộp bàn ({selectedTables.length})
            </button>
          )}
          {selectedTable?.group_order_id && (
        <button
          onClick={handleSplitTables}
          style={{
            marginTop: "10px",
            padding: "10px 14px",
            background: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            width: "100%"
          }}
        >
          ❌ Tách bàn
        </button>
      )}
        <MapContainer>
          {tablesByFloor.map(t => (
          <Table
              key={t.id}
              className={`
                ${selectedTable?.id === t.id ? "selected" : ""}
                ${selectedTables.includes(t.id) ? "multiSelected" : ""}
                ${t.status === "Trống" ? "empty" : ""}
                ${t.status === "Đang phục vụ" ? "serving" : ""}
                ${t.status === "Đã đặt" ? "reserved" : ""}
              `}
            style={{ left: `${t.pos_x}px`, top: `${t.pos_y}px` }}
            onClick={() => {
              handleSelectTable(t);
              toggleTableSelect(t.id); // 🔥 đặt ở đây
            }}
          >
              <TableIcon>🍽</TableIcon>
              <TableName>{t.name}</TableName>
              <TableInfo>👥 {t.seats}</TableInfo>
            </Table>
          ))}
        </MapContainer>

        {selectedTable && (
       <OrderPopup>
  <button
    onClick={() => setSelectedTable(null)}
    style={{
      marginBottom: '12px',
      padding: '6px 12px',
      borderRadius: '8px',
      border: 'none',
      background: '#c19a6b',
      color: 'white',
      cursor: 'pointer'
    }}
  >
    ⬅️ Quay lại bản đồ
  </button>

  <h3>Món đã chọn (Bàn {selectedTable.name})</h3>

  {currentOrders.length === 0 && <div>Chưa có món nào</div>}

  {currentOrders.map((o, idx) => {
    const quantity = o.quantity || 1;
    const subtotal = o.price * quantity;

    return (
      <OrderItemStyled key={idx}>
        <strong style={{ flex: '2' }}>{o.menu_name}</strong>

        <span style={{ flex: '1' }}>
          {Number(o.price).toLocaleString("vi-VN")}đ
        </span>

        <QuantityControls>
          <button onClick={() => handleChangeQuantity(idx, -1)}>-</button>
          <span>{quantity}</span>
          <button onClick={() => handleChangeQuantity(idx, 1)}>+</button>
        </QuantityControls>

        <NoteInput
          value={o.note_from_waiter || ""}
          onChange={e => handleChangeNote(idx, e.target.value)}
          style={{ flex: '2' }}
          placeholder="Ghi chú phục vụ"
        />

        <div style={{
          flex:'2',
          padding:'4px 6px',
          borderRadius:'6px',
          border:'1px solid #ccc',
          background:'#fff5e6',
          fontSize:'13px'
        }}>
          {o.note_from_kitchen || "Chưa có ghi chú từ bếp"}
        </div>

        <span style={{ flex:'1' }}>
          {subtotal.toLocaleString("vi-VN")}đ
        </span>

        <span style={{
          flex:'1',
          color:
            o.status === "Hoàn tất" ? "green"
            : o.status === "Đang nấu" ? "orange"
            : "blue",
          fontWeight:600
        }}>
          {o.status}
        </span>

        <button onClick={() => handleRemoveOrder(idx)}>❌</button>
      </OrderItemStyled>
    );
  })}

  {/* ===== FORM CHUYÊN NGHIỆP ===== */}
  <div style={{
    marginTop: '16px',
    padding: '12px',
    borderRadius: '10px',
    background: '#f9f5ef',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  }}>
    <h4>Thông tin khách hàng</h4>

    <input
      type="text"
      placeholder="Số điện thoại"
      value={selectedTable.customerPhone || ""}
      onChange={e =>
        setSelectedTable(prev => ({
          ...prev,
          customerPhone: e.target.value
        }))
      }
      style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #ccc' }}
    />

    {/* MÃ GIẢM GIÁ */}
    <div style={{ display: 'flex', gap: '8px' }}>
      <input
        type="text"
        placeholder="Mã giảm giá"
        value={selectedTable.discountCode || ""}
        onChange={e =>
          setSelectedTable(prev => ({
            ...prev,
            discountCode: e.target.value
          }))
        }
        style={{ flex: 1, padding: '6px 10px', borderRadius: '8px', border: '1px solid #ccc' }}
      />

      <button
        onClick={() => {
          if (selectedTable.discountCode === "SALE10") {
            setSelectedTable(prev => ({
              ...prev,
              discountValue: totalTemp * 0.1
            }));
          } else {
            alert("Mã không hợp lệ");
            setSelectedTable(prev => ({
              ...prev,
              discountValue: 0
            }));
          }
        }}
        style={{
          padding: '6px 10px',
          borderRadius: '8px',
          border: 'none',
          background: '#c19a6b',
          color: 'white'
        }}
      >
        Áp dụng
      </button>
    </div>

    {/* THANH TOÁN */}
    <select
      value={selectedTable.paymentMethod || ""}
      onChange={e =>
        setSelectedTable(prev => ({
          ...prev,
          paymentMethod: e.target.value
        }))
      }
      style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #ccc' }}
    >
      <option value="">Chọn phương thức thanh toán</option>
      <option value="Tiền mặt">Tiền mặt</option>
      <option value="Chuyển khoản">Chuyển khoản</option>
    </select>
  </div>

  {/* ===== BILL ===== */}
  <div style={{
    marginTop: '16px',
    padding: '12px',
    borderRadius: '10px',
    background: '#fff',
    border: '1px solid #ddd'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span>Tạm tính</span>
      <span>{totalTemp.toLocaleString("vi-VN")}đ</span>
    </div>

    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'green' }}>
      <span>Giảm giá</span>
      <span>
        {(selectedTable.discountValue || 0).toLocaleString("vi-VN")}đ
      </span>
    </div>

    <hr />

    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      fontWeight: 'bold',
      fontSize: '18px'
    }}>
      <span>Tổng thanh toán</span>
      <span>
        {(totalTemp - (selectedTable.discountValue || 0)).toLocaleString("vi-VN")}đ
      </span>
    </div>
  </div>

  <button
    onClick={handleSendOrder}
    style={{
      marginTop: '16px',
      padding: '10px',
      borderRadius: '10px',
      border: 'none',
      background: '#4caf50',
      color: 'white',
      width: '100%',
      fontSize: '16px'
    }}
  >
    💾 Gửi Order
  </button>
       <button
            onClick={handlePay}
            style={{
              marginTop: '10px',
              padding: '10px',
              borderRadius: '10px',
              border: 'none',
              background: '#ff9800',
              color: 'white',
              width: '100%',
              fontSize: '16px'
            }}
          >
            💳 Thanh toán
          </button>
</OrderPopup>
        )}
      </LeftPanel>

      <RightPanel>
        <h3>Thực đơn {selectedTable ? `(Bàn ${selectedTable.name})` : ""}</h3>

        <CategorySelect value={selectedCategory} onChange={e=>setSelectedCategory(Number(e.target.value)||"")}>
          <option value="">Tất cả</option>
          {categories.map(c=><option key={c.category_ID} value={c.category_ID}>{c.category_name}</option>)}
        </CategorySelect>

        <SearchInput type="text" placeholder="Tìm món..." value={search} onChange={e=>setSearch(e.target.value)} />

        {filteredMenus.map(m=>(
          <MenuItem key={m.menu_ID}>
            {m.image_url ? <img src={`http://localhost:5000${m.image_url}`} alt={m.menu_name} /> : "🍜"}
            <div>
              <strong>{m.menu_name}</strong>
              <span>{Number(m.price).toLocaleString("vi-VN")}đ</span>
            </div>
            <button onClick={()=>handleAddOrder(m)}>➕ Order</button>
       
          </MenuItem>
        ))}
      </RightPanel>
    </Layout>
  );
}