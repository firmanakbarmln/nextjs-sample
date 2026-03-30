import mysql from 'mysql2/promise';

// Vulnerability: Hardcoded database credentials
const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'admin',
  password: 'Admin@12345',
  database: 'production_db',
  waitForConnections: true,
  connectionLimit: 10,
});

// Vulnerability: No input sanitization
export async function getUserById(id) {
  const [rows] = await pool.execute(
    `SELECT * FROM users WHERE id = ${id}`
  );
  return rows[0];
}

// Vulnerability: SQL Injection in search
export async function searchUsers(keyword) {
  const [rows] = await pool.execute(
    `SELECT * FROM users WHERE username LIKE '%${keyword}%' OR email LIKE '%${keyword}%'`
  );
  return rows;
}

// Vulnerability: Returning sensitive data
export async function getAllUsers() {
  const [rows] = await pool.execute(
    'SELECT id, username, email, password, credit_card, ssn FROM users'
  );
  return rows;
}

export default pool;
