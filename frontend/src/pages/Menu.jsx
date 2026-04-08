import { useState, useEffect } from "react";
import axios from "axios";
import "./menu.css";

export default function MenuPage() {
  // ===== CATEGORY STATE =====
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  // ===== MENU STATE =====
  const [menus, setMenus] = useState([]);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [currentMenu, setCurrentMenu] = useState(null);

  const [menuName, setMenuName] = useState("");
  const [menuPrice, setMenuPrice] = useState("");
  const [menuImage, setMenuImage] = useState(null);
  const [menuStatus, setMenuStatus] = useState("Bật");

  // ===== RECIPES STATE =====
  const [recipes, setRecipes] = useState([]);

  // ===== FETCH DATA =====
  useEffect(() => {
    fetchCategories();
    fetchMenus();
    fetchRecipes();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      setCategories(res.data);
      if (res.data.length > 0 && !selectedCategory)
        setSelectedCategory(res.data[0].category_ID);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMenus = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/menus");
      setMenus(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecipes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/recipes");
      setRecipes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredMenu = menus.filter((m) => m.category_ID === selectedCategory);

  // ===== FORMAT PRICE =====
  const formatPrice = (price) => {
    if (!price) return "0đ";
    return Number(price).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + "đ";
  };

  // ================= CATEGORY ACTIONS =================
  const openAddCategory = () => {
    setCategoryName("");
    setEditingCategory(null);
    setShowAddCategory(true);
  };

  const handleSaveCategory = async () => {
    if (!categoryName) return alert("Nhập tên danh mục!");
    try {
      if (editingCategory) {
        await axios.put(
          `http://localhost:5000/api/categories/${editingCategory.category_ID}`,
          { category_name: categoryName }
        );
      } else {
        await axios.post("http://localhost:5000/api/categories", {
          category_name: categoryName,
        });
      }
      setCategoryName("");
      setEditingCategory(null);
      setShowAddCategory(false);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditCategory = (c) => {
    setEditingCategory(c);
    setCategoryName(c.category_name);
    setShowAddCategory(true);
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= MENU ACTIONS =================
  const openAddMenu = () => {
    setMenuName("");
    setMenuPrice("");
    setMenuImage(null);
    setMenuStatus("Bật");
    setShowAddMenu(true);
  };

  // Kiểm tra giá không âm
  const handlePriceChange = (value) => {
    if (value < 0) value = 0;
    setMenuPrice(value);
  };

  const handleAddMenu = async () => {
    if (!menuName || menuPrice === "") return alert("Nhập tên và giá món!");
    const formData = new FormData();
    formData.append("menu_name", menuName);
    formData.append("category_ID", selectedCategory);
    formData.append("price", parseFloat(menuPrice));
    formData.append("status", menuStatus);
    if (menuImage) formData.append("image", menuImage);

    try {
      await axios.post("http://localhost:5000/api/menus", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setShowAddMenu(false);
      fetchMenus();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditMenu = (menu) => {
    setCurrentMenu(menu);
    setMenuName(menu.menu_name);
    setMenuPrice(menu.price);
    setMenuStatus(menu.status);
    setMenuImage(null);
    setShowEditMenu(true);
  };

  const handleEditMenu = async () => {
    if (!menuName || menuPrice === "") return alert("Nhập tên và giá món!");
    const formData = new FormData();
    formData.append("menu_name", menuName);
    formData.append("category_ID", currentMenu.category_ID);
    formData.append("price", parseFloat(menuPrice));
    formData.append("status", menuStatus);
    if (menuImage) formData.append("image", menuImage);

    try {
      await axios.put(
        `http://localhost:5000/api/menus/${currentMenu.menu_ID}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setShowEditMenu(false);
      setCurrentMenu(null);
      fetchMenus();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMenu = async (menu_ID) => {
    if (!window.confirm("Bạn có chắc muốn xóa món này?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/menus/${menu_ID}`);
      fetchMenus();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= RECIPES =================
  const filteredMenuWithRecipe = filteredMenu.map((m) => {
    const hasRecipe = recipes.some(
      (r) => Number(r.menu_ID) === Number(m.menu_ID)
    );
    return { ...m, hasRecipe };
  });

  return (
    <div className="menu-container">
      {/* CATEGORY */}
      <div className="category">
        <div className="category-header">
          <h3>Danh mục</h3>
          <button onClick={openAddCategory}>+ Thêm</button>
        </div>
        {categories.map((c) => (
          <div
            key={c.category_ID}
            className={`category-item ${selectedCategory === c.category_ID ? "active" : ""}`}
            onClick={() => setSelectedCategory(c.category_ID)}
          >
            {c.category_name}
            <div className="category-actions">
              <button onClick={() => handleEditCategory(c)}>✏️</button>
              <button onClick={() => handleDeleteCategory(c.category_ID)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {/* MENU */}
      <div className="menu">
        <div className="menu-header">
          <h3>Món ăn</h3>
          <button onClick={openAddMenu}>+ Thêm món</button>
        </div>

        <div className="menu-grid">
          {filteredMenuWithRecipe.map((m) => (
            <div className="menu-card" key={m.menu_ID}>
              <div className="menu-img">
                {m.image_url ? (
                  <img src={`http://localhost:5000${m.image_url}`} alt={m.menu_name} />
                ) : (
                  "🍜"
                )}
              </div>
              <p>Mã: {m.menu_code}</p>
              <h4>{m.menu_name}</h4>
              {!m.hasRecipe && (
                <span className="badge-no-recipe">Chưa có công thức</span>
              )}
              <p>{formatPrice(m.price)}</p>
              <p>Trạng thái: {m.status}</p>
              <div className="menu-actions">
                <button onClick={() => openEditMenu(m)}>Sửa</button>
                <button onClick={() => handleDeleteMenu(m.menu_ID)}>Xóa</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL ADD / EDIT CATEGORY */}
      {showAddCategory && (
        <div className="modal">
          <h4>{editingCategory ? "Sửa danh mục" : "Thêm danh mục"}</h4>
          <input
            type="text"
            placeholder="Tên danh mục"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <div className="modal-actions">
            <button onClick={handleSaveCategory}>
              {editingCategory ? "Cập nhật" : "Thêm"}
            </button>
            <button onClick={() => setShowAddCategory(false)}>Hủy</button>
          </div>
        </div>
      )}

      {/* MODAL ADD / EDIT MENU */}
      {showAddMenu && (
        <div className="modal">
          <h4>Thêm món mới</h4>
          <input
            type="text"
            placeholder="Tên món"
            value={menuName}
            onChange={(e) => setMenuName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Giá"
            min="0"
            value={menuPrice}
            onChange={(e) => handlePriceChange(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setMenuImage(e.target.files[0])}
          />
          <select value={menuStatus} onChange={(e) => setMenuStatus(e.target.value)}>
            <option value="Bật">Bật</option>
            <option value="Tắt">Tắt</option>
          </select>
          <div className="modal-actions">
            <button onClick={handleAddMenu}>Thêm món</button>
            <button onClick={() => setShowAddMenu(false)}>Hủy</button>
          </div>
        </div>
      )}

      {showEditMenu && (
        <div className="modal">
          <h4>Sửa món</h4>
          <input
            type="text"
            value={menuName}
            onChange={(e) => setMenuName(e.target.value)}
          />
          <input
            type="number"
            min="0"
            value={menuPrice}
            onChange={(e) => handlePriceChange(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setMenuImage(e.target.files[0])}
          />
          <select value={menuStatus} onChange={(e) => setMenuStatus(e.target.value)}>
            <option value="Bật">Bật</option>
            <option value="Tắt">Tắt</option>
          </select>
          <div className="modal-actions">
            <button onClick={handleEditMenu}>Cập nhật</button>
            <button onClick={() => setShowEditMenu(false)}>Hủy</button>
          </div>
        </div>
      )}
    </div>
  );
}