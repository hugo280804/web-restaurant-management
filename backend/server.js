const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// ===== ROUTES =====
const categoryRoutes = require("./routes/categoryRoutes");
const menuRoutes = require("./routes/menuRoutes");
const tableRoutes = require("./routes/tableRoutes");
const floorRoutes = require("./routes/floorRoutes");
const ingredientRoutes = require("./routes/ingredientRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const ingredientCategoryRoutes = require("./routes/ingredientCategoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const promotionRoutes = require("./routes/promotionRoutes");
const comboRoutes = require("./routes/comboRoutes");
const customerRoutes = require("./routes/customerRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const authRoutes = require("./routes/authRoutes");
const shiftRoutes = require("./routes/shiftRoutes");
const homeRoutes = require("./routes/homeRoutes");
const momoRoutes = require("./routes/momoRoutes"); 
const reportRoutes = require("./routes/reportRoutes");

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// ===== STATIC FILES =====
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===== API ROUTES =====
app.use("/api/categories", categoryRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/floors", floorRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/ingredient-categories", ingredientCategoryRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/combos", comboRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/shifts", shiftRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/momo", momoRoutes);
app.use("/api/report", reportRoutes);

// ===== TEST ROUTE =====
app.get("/", (req, res) => {
  res.send("🚀 Server chạy OK");
});

// ===== HANDLE 404 =====
app.use((req, res) => {
  res.status(404).json({ message: "Route không tồn tại" });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});