const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route test
app.get("/", (req, res) => {
  res.send("🚀 Server chạy thử thành công!");
});

// Server listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server chạy tại http://localhost:${PORT}`);
});