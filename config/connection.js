const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection(
    {
        host: "localhost",
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: "employee_db"
    }
).promise();

module.exports = db;
