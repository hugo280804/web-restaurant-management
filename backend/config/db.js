const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",      // hoặc IP server MySQL
  user: "root",           // username MySQL
  password: "", // password MySQL
  database: "restaurant_db", // tên database
  port: 3306, 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
  
});

module.exports = pool;