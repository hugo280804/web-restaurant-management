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
  background: linear-gradient(145deg, #d2b48c, #c19a6b);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  user-select: none;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.18);
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
    setSelectedTable(t);
    if (orders[t.id] && orders[t.id].length > 0) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/table/${t.id}`);
      const items = (res.data?.order_details || []).map(item => ({
        ...item,
        status: item.status || "Chờ xác nhận",
        note_from_waiter: item.note_from_waiter || "",
        note_from_kitchen: item.note_from_kitchen || ""
      }));
      setOrders(prev => ({ ...prev, [t.id]: items }));
    } catch (err) {
      console.error("Lỗi khi lấy orders:", err);
      setOrders(prev => ({ ...prev, [t.id]: [] }));
    }
  };

  const filteredMenus = menus
    .filter(m => m.status === "Bật")
    .filter(m => selectedCategory ? m.category_ID === selectedCategory : true)
    .filter(m => m.menu_name.toLowerCase().includes(search.toLowerCase()));

  const handleAddOrder = (menu) => {
    if (!selectedTable) return alert("Chọn bàn trước!");
    const tableID = selectedTable.id;
    setOrders(prev => {
      const currentOrders = prev[tableID] ? [...prev[tableID]] : [];
      const existIdx = currentOrders.findIndex(o => o.menu_ID === menu.menu_ID);
      if (existIdx >= 0) {
        currentOrders[existIdx].quantity = (currentOrders[existIdx].quantity || 1) + 1;
        return { ...prev, [tableID]: currentOrders };
      }
      return { ...prev, [tableID]: [...currentOrders, { ...menu, quantity: 1, note_from_waiter: "", note_from_kitchen: "", status: "Chờ xác nhận" }] };
    });
  };

  const handleChangeQuantity = (idx, delta) => {
    if (!selectedTable) return;
    const tableID = selectedTable.id;
    setOrders(prev => {
      const currentOrders = [...(prev[tableID] || [])];
      currentOrders[idx].quantity = Math.max(1, currentOrders[idx].quantity + delta);
      return { ...prev, [tableID]: currentOrders };
    });
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
        axios.patch(`http://localhost:5000/api/order-details/${item.order_detail_ID}/note`, {
          note: value,
          role: "waiter"
        }).catch(err => console.error("Lỗi cập nhật note:", err));
      }
      return { ...prev, [tableID]: currentOrders };
    });
  };

  const handleRemoveOrder = (idx) => {
    if (!selectedTable) return;
    const tableID = selectedTable.id;
    setOrders(prev => {
      const currentOrders = [...(prev[tableID] || [])];
      currentOrders.splice(idx, 1);
      return { ...prev, [tableID]: currentOrders };
    });
  };

  const currentOrders = selectedTable ? orders[selectedTable.id] || [] : [];
  const totalTemp = currentOrders.reduce((sum, o) => sum + o.price * (o.quantity || 1), 0);

  const handleSendOrder = async () => {
    if (!selectedTable) return alert("Chọn bàn trước!");
    const tableID = selectedTable.id;
    if (!currentOrders || currentOrders.length === 0) return alert("Chưa có món nào để gửi!");

    try {
      const resOrder = await axios.post("http://localhost:5000/api/orders", {
        table_ID: tableID,
        employee_ID: 1
      });

      const orderID = resOrder.data.order_ID || resOrder.data.id;
      if (!orderID) throw new Error("Không lấy được order_ID từ backend");

      const newOrders = [];

      for (const item of currentOrders) {
        const resItem = await axios.post(`http://localhost:5000/api/orders/${orderID}/items`, {
          menu_ID: item.menu_ID,
          quantity: item.quantity,
          note_from_waiter: item.note_from_waiter,
          price: item.price
        });

        newOrders.push({
          ...item,
          status: resItem.data.status || "Chờ xác nhận",
          order_detail_ID: resItem.data.order_detail_ID || item.order_detail_ID
        });
      }

      setOrders(prev => ({ ...prev, [tableID]: newOrders }));
      alert("Gửi order thành công!");
    } catch (err) {
      console.error("Lỗi khi gửi order:", err.response?.data || err.message);
      alert("Lỗi khi gửi order. Kiểm tra console để biết chi tiết.");
    }
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

        <MapContainer>
          {tablesByFloor.map(t => (
            <Table
              key={t.id}
              className={selectedTable?.id === t.id ? "selected" : ""}
              style={{ left: `${t.pos_x}px`, top: `${t.pos_y}px` }}
              onClick={() => handleSelectTable(t)}
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
                  <span style={{ flex: '1' }}>{Number(o.price).toLocaleString("vi-VN")}đ</span>
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
                  <span style={{ flex:'1' }}>{subtotal.toLocaleString("vi-VN")}đ</span>
                  <span style={{
                    flex:'1',
                    color: o.status === "Hoàn tất" ? "green" : o.status === "Đang nấu" ? "orange" : "blue",
                    fontWeight:600
                  }}>
                    {o.status}
                  </span>
                  <button onClick={() => handleRemoveOrder(idx)}>❌</button>
                </OrderItemStyled>
              );
            })}

            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                type="text"
                placeholder="Số điện thoại"
                value={selectedTable.customerPhone || ""}
                onChange={e => setSelectedTable(prev => ({ ...prev, customerPhone: e.target.value }))}
                style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #ccc' }}
              />
              <select
                value={selectedTable.paymentMethod || ""}
                onChange={e => setSelectedTable(prev => ({ ...prev, paymentMethod: e.target.value }))}
                style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #ccc' }}
              >
                <option value="">Chọn phương thức thanh toán</option>
                <option value="Tiền mặt">Tiền mặt</option>
                <option value="Chuyển khoản">Chuyển khoản</option>
              </select>
            </div>

            <h3 style={{ marginTop: '16px' }}>
              Tổng tạm tính: {totalTemp.toLocaleString("vi-VN")}đ
            </h3>

            <button
              onClick={handleSendOrder}
              style={{ marginTop: '16px', padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#4caf50', color: 'white', cursor: 'pointer' }}
            >
              💾 Gửi Order
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