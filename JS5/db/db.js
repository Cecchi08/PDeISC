// db.js — Conexión a MySQL (alumnosDB)
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'alumnosDB',
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;
