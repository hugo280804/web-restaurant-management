const express = require("express");
const cors = require("cors");

const app = express();
const categoryRoutes = require('./routes/categoryRoutes'); // chú ý tên file số nhiều
const menuRoutes = require('./routes/menuRoutes');         // số nhiều cũng tốt
const tableRoutes = require('./routes/tableRoutes');     
const floorRoutes = require("./routes/floorRoutes");  // số nhiều cho đồng bộ
const ingredientRoutes = require('./routes/ingredientRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const ingredientCategoryRoutes = require("./routes/ingredientCategoryRoutes"); // số nhiều cho đồng bộ
const orderRoutes = require("./routes/orderRoutes"); // số nhiều cho đồng bộ
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/menus', menuRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/ingredients', ingredientRoutes);
app.use("/api/ingredient-categories", require("./routes/ingredientCategoryRoutes"));

app.use('/api/recipes', recipeRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/floors", floorRoutes); 
app.use("/api/orders", orderRoutes); // số nhiều cho đồng bộ
app.use("/api/orders", require("./routes/orderRoutes"));
app.get("/", (req, res) => {
  res.send("🚀 Server chạy thử thành công!");
});

// Server listen
const PORT = process.env.PORT || 5000; // backend port nên khác frontend
app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});