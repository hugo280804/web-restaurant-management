import { useEffect, useState } from "react";
import axios from "axios";
import "./ingredient.css";

const API = "http://localhost:5000/api/ingredients";
const CATEGORY_API = "http://localhost:5000/api/ingredient-categories";

export default function IngredientPage() {
  const [ingredients, setIngredients] = useState([]);
  const [categories, setCategories] = useState([]);

  const [editing, setEditing] = useState(null);
  const [editingCat, setEditingCat] = useState(null);
  const [showCategory, setShowCategory] = useState(false);

  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [quantity, setQuantity] = useState(""); 
  const [price, setPrice] = useState(""); 
  const [importDate, setImportDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [categoryID, setCategoryID] = useState("");

  const [catName, setCatName] = useState("");

  const [search, setSearch] = useState("");
  const [searchCategory, setSearchCategory] = useState(""); // chọn category để lọc
  const [selectedIds, setSelectedIds] = useState([]);

  // ===== FETCH =====
  const fetchIngredients = async () => {
    const res = await axios.get(API);
    setIngredients(res.data);
  };

  const fetchCategories = async () => {
    const res = await axios.get(CATEGORY_API);
    setCategories(res.data);
  };

  useEffect(() => {
    fetchIngredients();
    fetchCategories();
  }, []);

  // ===== TÍNH NGÀY HSD =====
  const calcDaysLeft = (expiry) => {
    if (!expiry) return "";
    const today = new Date();
    const exp = new Date(expiry);
    today.setHours(0,0,0,0);
    exp.setHours(0,0,0,0);
    const diff = Math.ceil((exp - today)/(1000*60*60*24));
    if(diff < 0) return "Hết hạn";
    if(diff === 0) return "Hôm nay";
    return diff + " ngày";
  };

  // ===== INGREDIENT =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ingredient_name: name,
      unit,
      quantity: quantity ? parseFloat(quantity) : 0,
      price: price ? parseInt(price,10) : 0,
      import_date: importDate || null,
      expiry_date: expiryDate || null,
      category_ID: categoryID || null,
    };

    if(editing){
      await axios.put(`${API}/${editing.ingredient_ID}`, payload);
      setEditing(null);
    } else {
      await axios.post(API, payload);
    }

    resetForm();
    fetchIngredients();
  };

  const handleEdit = (i) => {
    setEditing(i);
    setName(i.ingredient_name);
    setUnit(i.unit);
    setQuantity(i.quantity);
    setPrice(i.price);
    setImportDate(i.import_date?.split("T")[0] || "");
    setExpiryDate(i.expiry_date?.split("T")[0] || "");
    setCategoryID(i.category_ID || "");
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Xóa nguyên liệu?")) return;
    await axios.delete(`${API}/${id}`);
    fetchIngredients();
  };

  const resetForm = () => {
    setName(""); setUnit(""); setQuantity(""); setPrice("");
    setImportDate(""); setExpiryDate(""); setCategoryID("");
  };

  // ===== CATEGORY =====
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if(editingCat){
      await axios.put(`${CATEGORY_API}/${editingCat.category_ID}`, {category_name: catName});
    } else {
      await axios.post(CATEGORY_API, {category_name: catName});
    }
    setCatName(""); setEditingCat(null);
    fetchCategories();
  };

  const handleEditCategory = (cat) => {
    setEditingCat(cat);
    setCatName(cat.category_name);
  };

  const handleDeleteCategory = async (id) => {
    if(!window.confirm("Xóa danh mục?")) return;
    await axios.delete(`${CATEGORY_API}/${id}`);
    fetchCategories();
  };

  // ===== SEARCH & FILTER =====
  const filteredIngredients = ingredients.filter(i =>
    (i.ingredient_name.toLowerCase().includes(search.toLowerCase()) ||
     (i.category_name || "").toLowerCase().includes(search.toLowerCase()))
    &&
    (searchCategory === "" || i.category_ID === Number(searchCategory)) // fix type
  );

  // ===== CHECKBOX =====
  const handleSelect = (id) => {
    if(selectedIds.includes(id)){
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAll = (checked) => {
    if(checked){
      setSelectedIds(filteredIngredients.map(i => i.ingredient_ID));
    } else {
      setSelectedIds([]);
    }
  };

  const handleDeleteSelected = async () => {
    if(selectedIds.length===0) return;
    if(!window.confirm(`Xóa ${selectedIds.length} nguyên liệu?`)) return;
    await Promise.all(selectedIds.map(id => axios.delete(`${API}/${id}`)));
    setSelectedIds([]);
    fetchIngredients();
  };

  return (
    <div className="ingredient-page">
      <h2>Quản lý nguyên liệu</h2>

      {/* ===== CATEGORY HEADER ===== */}
      <div className="category-header">
        <button onClick={()=>setShowCategory(true)}>+ Danh mục</button>
      </div>

      {/* ===== SEARCH & FILTER ===== */}
      <div style={{display:"flex", alignItems:"center", gap:"10px", marginBottom:"10px"}}>
        <input 
          type="text"
          placeholder="Tìm kiếm nguyên liệu..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="search-input"
        />
        <select 
          value={searchCategory} 
          onChange={(e)=>setSearchCategory(e.target.value ? Number(e.target.value) : "")}
          className="search-category"
        >
          <option value="">Tìm kiếm theo danh mục</option>
          {categories.map(c => (
            <option key={c.category_ID} value={c.category_ID}>{c.category_name}</option>
          ))}
        </select>
      </div>

      {/* ===== FORM INGREDIENT ===== */}
      <form onSubmit={handleSubmit} className="ingredient-form">
        <input placeholder="Tên" value={name} onChange={(e)=>setName(e.target.value)} required/>
        <select value={unit} onChange={(e)=>setUnit(e.target.value)} required>
          <option value="">Đơn vị</option>
          <option value="kg">kg</option>
          <option value="g">g</option>
          <option value="l">l</option>
          <option value="ml">ml</option>
          <option value="cái">cái</option>
          <option value="quả">quả</option>
          <option value="chai">chai</option>
          <option value="gói">gói</option>
        </select>
        <input type="number" placeholder="Số lượng" min="0" step="0.01" value={quantity} onChange={(e)=>{
          const val = e.target.value; if(/^\d*\.?\d*$/.test(val)) setQuantity(val);
        }}/>
        <input type="number" placeholder="Giá" min="0" step="1" value={price} onChange={(e)=>{
          const val=e.target.value; if(/^\d*$/.test(val)) setPrice(val);
        }}/>
        <select value={categoryID} onChange={(e)=>setCategoryID(e.target.value)}>
          <option value="">Danh mục</option>
          {categories.map(c=>(
            <option key={c.category_ID} value={c.category_ID}>{c.category_name}</option>
          ))}
        </select>
        <input type="date" value={importDate} onChange={(e)=>setImportDate(e.target.value)}/>
        <input type="date" value={expiryDate} onChange={(e)=>setExpiryDate(e.target.value)}/>
        <button>{editing?"Cập nhật":"Thêm"}</button>
      </form>

      {/* ===== BUTTON XÓA NHIỀU ===== */}
      {selectedIds.length>0 && (
        <button className="delete-selected-btn" onClick={handleDeleteSelected}>
          Xóa {selectedIds.length} nguyên liệu đã chọn
        </button>
      )}

      {/* ===== TABLE ===== */}
      <table className="ingredient-table">
        <thead>
          <tr>
            <th>
              <input 
                type="checkbox" 
                checked={selectedIds.length===filteredIngredients.length && filteredIngredients.length>0}
                onChange={(e)=>handleSelectAll(e.target.checked)}
              />
            </th>
            <th>Tên</th>
            <th>Danh mục</th>
            <th>Số lượng</th>
            <th>Giá</th>
            <th>Ngày nhập</th>
            <th>Ngày hết hạn</th>
            <th>Còn lại</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredIngredients.map(i=>(
            <tr key={i.ingredient_ID}>
              <td>
                <input type="checkbox" checked={selectedIds.includes(i.ingredient_ID)} onChange={()=>handleSelect(i.ingredient_ID)}/>
              </td>
              <td>{i.ingredient_name}</td>
              <td>{i.category_name || ""}</td>
              <td>{parseFloat(i.quantity)%1===0 ? parseInt(i.quantity,10) : i.quantity} {i.unit}</td>
              <td>{Number(i.price).toLocaleString("vi-VN",{maximumFractionDigits:0})} đ</td>
              <td>{i.import_date?.split("T")[0]}</td>
              <td>{i.expiry_date?.split("T")[0]}</td>
              <td>{calcDaysLeft(i.expiry_date)}</td>
              <td>
                <button className="edit-btn" onClick={()=>handleEdit(i)}>Sửa</button>
                <button className="delete-btn" onClick={()=>handleDelete(i.ingredient_ID)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===== POPUP CATEGORY ===== */}
      {showCategory && (
        <div className="category-popup">
          <div className="category-popup-inner">
            <h3>Danh mục</h3>
            <form onSubmit={handleCategorySubmit}>
              <input value={catName} onChange={(e)=>setCatName(e.target.value)} placeholder="Tên danh mục" required/>
              <button>{editingCat?"Cập nhật":"Thêm"}</button>
            </form>
            <hr/>
            {categories.map(c=>(
              <div key={c.category_ID} className="category-row">
                <span>{c.category_name}</span>
                <div>
                  <button onClick={()=>handleEditCategory(c)}>Sửa</button>
                  <button onClick={()=>handleDeleteCategory(c.category_ID)}>Xóa</button>
                </div>
              </div>
            ))}
            <button className="close-btn" onClick={()=>setShowCategory(false)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}