const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "albertinemorkvikskjold",
  password: "",
  database: "hitster",
});

db.connect((err) => {
  if (err) {
    console.error("Klarte ikke koble til databasen:", err.message);
    return;
  }
  console.log("Koblet til MariaDB!");
});

module.exports = db;