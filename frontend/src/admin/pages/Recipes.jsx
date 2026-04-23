import { useEffect, useState } from "react";
import axios from "axios";
import "./recipes.css";

const API_MENU = "http://localhost:5000/api/menus";
const API_INGREDIENTS = "http://localhost:5000/api/ingredients";
const API_RECIPE = "http://localhost:5000/api/recipes";
const API_CATEGORY = "http://localhost:5000/api/ingredient-categories";

export default function RecipesPage() {
  const [menuList, setMenuList] = useState([]);
  const [ingredientList, setIngredientList] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);

  const [editing, setEditing] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState("");
  const [search, setSearch] = useState(""); // 🔥 SEARCH

  const [ingredientRows, setIngredientRows] = useState([
    { ingredient_ID: "", quantity_required: "", unit: "", category_ID: "" },
  ]);

  // ===== FORMAT =====
  const formatQuantity = (num) => {
    const n = Number(num);
    if (isNaN(n)) return "";
    return n % 1 === 0 ? n : n.toFixed(2);
  };

  // ===== LOAD =====
  useEffect(() => {
    axios.get(API_MENU).then(res => setMenuList(res.data));
    axios.get(API_INGREDIENTS).then(res => setIngredientList(res.data));
    axios.get(API_CATEGORY).then(res => setCategories(res.data));
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    const res = await axios.get(API_RECIPE);
    setRecipes(res.data);
  };

  // ===== ROW =====
  const handleAddRow = () => {
    setIngredientRows(prev => [
      ...prev,
      { ingredient_ID: "", quantity_required: "", unit: "", category_ID: "" },
    ]);
  };

  const handleRemoveRow = (index) => {
    setIngredientRows(prev => prev.filter((_, i) => i !== index));
  };

  const handleRowChange = (index, field, value) => {
    setIngredientRows(prev => {
      const rows = [...prev];

      rows[index] = {
        ...rows[index],
        [field]: value,
      };

      if (field === "category_ID") {
        rows[index].ingredient_ID = "";
        rows[index].unit = "";
      }

      if (field === "ingredient_ID") {
        const ingredient = ingredientList.find(
          i => Number(i.ingredient_ID) === Number(value)
        );
        rows[index].unit = ingredient ? ingredient.unit : "";
      }

      return rows;
    });
  };

  // ===== SUBMIT =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMenu) return alert("Chọn món!");

    try {
      if (editing) {
        await axios.delete(`${API_RECIPE}/menu/${editing.menu_ID}`);
      }

      for (let row of ingredientRows) {
        if (!row.ingredient_ID || !row.quantity_required || !row.unit) continue;

        if (Number(row.quantity_required) <= 0) {
          alert("Số lượng phải > 0");
          return;
        }

        await axios.post(API_RECIPE, {
          menu_ID: Number(selectedMenu),
          ingredient_ID: Number(row.ingredient_ID),
          quantity_required: row.quantity_required,
          unit: String(row.unit).trim(),
        });
      }

      resetForm();
      fetchRecipes();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setSelectedMenu("");
    setIngredientRows([
      { ingredient_ID: "", quantity_required: "", unit: "", category_ID: "" },
    ]);
    setEditing(null);
  };

  // ===== EDIT =====
  const handleEdit = (menu_ID) => {
    const rows = recipes
      .filter(r => Number(r.menu_ID) === Number(menu_ID))
      .map(r => {
        const ingredient = ingredientList.find(
          i => Number(i.ingredient_ID) === Number(r.ingredient_ID)
        );

        return {
          ingredient_ID: r.ingredient_ID,
          quantity_required: r.quantity_required,
          unit: r.unit || (ingredient ? ingredient.unit : ""),
          category_ID: ingredient ? ingredient.category_ID : "",
        };
      });

    setSelectedMenu(Number(menu_ID));
    setIngredientRows(rows);
    setEditing({ menu_ID });
  };

  // ===== DELETE =====
  const handleDelete = async (menu_ID) => {
    if (!window.confirm("Xóa công thức?")) return;

    await axios.delete(`${API_RECIPE}/menu/${menu_ID}`);
    fetchRecipes();
  };

  // ===== UNIT =====
  const mapUnits = (baseUnit) => {
    switch (baseUnit) {
      case "kg": return ["kg", "g"];
      case "l": return ["l", "ml"];
      case "muỗng": return ["muỗng", "muỗng canh", "muỗng cà phê"];
      default: return [baseUnit];
    }
  };

  // ===== FILTER MENU =====
  const menusWithRecipe = menuList.filter(menu =>
    recipes.some(r => Number(r.menu_ID) === Number(menu.menu_ID))
  );

  const menusWithoutRecipe = menuList.filter(menu =>
    !recipes.some(r => Number(r.menu_ID) === Number(menu.menu_ID))
  );

  return (
    <div className="recipes-page">
      <h2>Quản lý công thức</h2>

      <select
        value={selectedMenu}
        onChange={e => setSelectedMenu(Number(e.target.value))}
      >
        <option value="">-- Chọn món --</option>

        <optgroup label="Đã có công thức">
          {menusWithRecipe.map(m => (
            <option key={m.menu_ID} value={m.menu_ID}>
              {m.menu_name}
            </option>
          ))}
        </optgroup>

        <optgroup label="Chưa có công thức">
          {menusWithoutRecipe.map(m => (
            <option key={m.menu_ID} value={m.menu_ID}>
              {m.menu_name}
            </option>
          ))}
        </optgroup>
      </select>

      {/* FORM */}
      <form className="recipe-form" onSubmit={handleSubmit}>
        <h4>Nguyên liệu</h4>

        {ingredientRows.map((row, idx) => {
          const filteredIngredients = ingredientList.filter(
            i =>
              !row.category_ID ||
              Number(i.category_ID) === Number(row.category_ID)
          );

          const selectedIngredient = ingredientList.find(
            i => Number(i.ingredient_ID) === Number(row.ingredient_ID)
          );

          let availableUnit = [];

          if (selectedIngredient) {
            availableUnit = mapUnits(selectedIngredient.unit);

            if (row.unit && !availableUnit.includes(row.unit)) {
              availableUnit.push(row.unit);
            }
          } else if (row.unit) {
            availableUnit = [row.unit];
          }

          return (
            <div className="recipe-row" key={idx}>
              <select
                value={row.category_ID}
                onChange={e =>
                  handleRowChange(idx, "category_ID", e.target.value)
                }
              >
                <option value="">-- Danh mục --</option>
                {categories.map(c => (
                  <option key={c.category_ID} value={c.category_ID}>
                    {c.category_name}
                  </option>
                ))}
              </select>

              <select
                value={row.ingredient_ID}
                onChange={e =>
                  handleRowChange(idx, "ingredient_ID", e.target.value)
                }
                required
              >
                <option value="">-- Nguyên liệu --</option>
                {filteredIngredients.map(i => (
                  <option key={i.ingredient_ID} value={i.ingredient_ID}>
                    {i.ingredient_name} ({i.unit})
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="0"
                value={row.quantity_required}
                onChange={e =>
                  handleRowChange(idx, "quantity_required", e.target.value)
                }
                placeholder="SL"
                required
              />

              <select
                value={row.unit}
                onChange={e =>
                  handleRowChange(idx, "unit", e.target.value)
                }
                required
              >
                <option value="">Đơn vị</option>
                {availableUnit.map(u => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>

              <button
                className="recipe-btn delete"
                type="button"
                onClick={() => handleRemoveRow(idx)}
              >
                Xóa
              </button>
            </div>
          );
        })}

        <button
          className="recipe-btn add-btn"
          type="button"
          onClick={handleAddRow}
        >
          + Thêm nguyên liệu
        </button>

        <button className="recipe-btn submit-btn" type="submit">
          {editing ? "Cập nhật" : "Thêm công thức"}
        </button>
      </form>

      {/* LIST */}
      <div className="recipe-list">
        <h3>Danh sách công thức</h3>

        {/* 🔍 SEARCH */}
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Tìm món..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {Array.from(new Set(recipes.map(r => r.menu_ID)))
          .filter(menu_ID => {
            const menu = menuList.find(
              m => Number(m.menu_ID) === Number(menu_ID)
            );

            return menu?.menu_name
              ?.toLowerCase()
              .includes(search.toLowerCase());
          })
          .map(menu_ID => {
            const rows = recipes.filter(
              r => Number(r.menu_ID) === Number(menu_ID)
            );

            const totalCost = rows.reduce(
              (sum, r) => sum + Number(r.cost || 0),
              0
            );

            return (
              <div className="recipe-card" key={menu_ID}>
                <strong>
                  {rows[0].menu_name} - Cost:{" "}
                  {totalCost.toLocaleString()} VND
                </strong>

                <ul>
                  {rows.map(r => {
                    const ingredient = ingredientList.find(
                      i => Number(i.ingredient_ID) === Number(r.ingredient_ID)
                    );

                    const unit = r.unit || (ingredient ? ingredient.unit : "");

                    return (
                      <li key={r.recipe_ID}>
                        {r.ingredient_name} (
                        {formatQuantity(r.quantity_required)} {unit})
                        - {Number(r.cost || 0).toLocaleString()} đ
                      </li>
                    );
                  })}
                </ul>

                <div className="recipe-actions">
                  <button
                    className="recipe-btn"
                    onClick={() => handleEdit(menu_ID)}
                  >
                    Sửa
                  </button>

                  <button
                    className="recipe-btn delete"
                    onClick={() => handleDelete(menu_ID)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}