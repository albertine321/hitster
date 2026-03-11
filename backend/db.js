const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "albertinemorkvikskjold",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "hitster",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Klarte ikke koble til databasen:", err.message);
  } else {
    console.log("Koblet til MariaDB!");
    connection.release();
  }
});

module.exports = pool;