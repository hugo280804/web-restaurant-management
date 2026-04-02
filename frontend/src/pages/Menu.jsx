import { useState } from "react";
import "./menu.css";

export default function MenuPage() {
  const [categories, setCategories] = useState([
    { id: 1, name: "Đồ ăn" },
    { id: 2, name: "Đồ uống" },
    { id: 3, name: "Tráng miệng" },
  ]);

  const [menus, setMenus] = useState([
    { id: 1, name: "Phở bò", price: 50000, category_ID: 1 },
    { id: 2, name: "Trà sữa", price: 30000, category_ID: 2 },
    { id: 3, name: "Bánh flan", price: 20000, category_ID: 3 },
  ]);

  const [selectedCategory, setSelectedCategory] = useState(1);

  const filteredMenu = menus.filter(
    (m) => m.category_ID === selectedCategory
  );

  return (
    <div className="menu-container">
      {/* CATEGORY */}
      <div className="category">
        <div className="category-header">
          <h3>Danh mục</h3>
          <button>+ Thêm</button>
        </div>

        {categories.map((c) => (
          <div
            key={c.id}
            className={`category-item ${
              selectedCategory === c.id ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(c.id)}
          >
            {c.name}
          </div>
        ))}
      </div>

      {/* MENU */}
      <div className="menu">
        <div className="menu-header">
          <h3>Món ăn</h3>
          <button>+ Thêm món</button>
        </div>

        <div className="menu-grid">
          {filteredMenu.map((m) => (
            <div className="menu-card" key={m.id}>
              <div className="menu-img">🍜</div>
              <h4>{m.name}</h4>
              <p>{m.price.toLocaleString()}đ</p>

              <div className="menu-actions">
                <button>Sửa</button>
                <button>Xóa</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}