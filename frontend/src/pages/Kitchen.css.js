import styled from "styled-components";

/* ===== CONTAINER ===== */
export const Container = styled.div`
  padding: 20px;
  background: #f5f1ea;
  min-height: 100vh;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

/* ===== ORDER CARD ===== */
export const OrderCard = styled.div`
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

/* ===== ORDER HEADER ===== */
export const OrderHeader = styled.div`
  font-weight: 600;
  text-align: center;
  color: #4b2e1e;
  margin-bottom: 12px;
`;

/* ===== ITEM LIST ===== */
export const ItemList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

/* ===== ITEM CARD ===== */
export const ItemCard = styled.div`
  background: #fff8f0;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
`;

/* ===== ITEM NAME ===== */
export const ItemName = styled.div`
  font-weight: 500;
  margin-bottom: 8px;
  color: #4b2e1e;
  text-align: center;
`;

/* ===== INGREDIENT LIST ===== */
export const IngredientList = styled.ul`
  list-style-type: disc;
  padding-left: 16px;
  font-size: 0.9rem;
  color: #5c4033;
  margin-bottom: 10px;
`;

/* ===== STATUS ROW ===== */
export const StatusRow = styled.div`
  display: flex;
  gap: 6px;
  justify-content: center;
`;

/* ===== STATUS BUTTON ===== */
export const StatusButton = styled.button`
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

/* ===== BOTTOM BUTTONS ===== */
export const BottomButtons = styled.div`
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