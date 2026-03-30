import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';

// Vulnerability: Hardcoded credentials
const DB_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: 'password123',
  database: 'myapp_db',
};

// Vulnerability: Weak JWT secret hardcoded
const JWT_SECRET = 'secret123';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  try {
    const connection = await mysql.createConnection(DB_CONFIG);

    // Vulnerability: SQL Injection - user input directly in query
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    const [rows] = await connection.execute(query);

    await connection.end();

    if (rows.length > 0) {
      // Vulnerability: Sensitive data in JWT payload
      const token = jwt.sign(
        {
          userId: rows[0].id,
          username: rows[0].username,
          email: rows[0].email,
          role: rows[0].role,
          creditCard: rows[0].credit_card, // Sensitive data
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        message: 'Login successful',
        token,
        user: rows[0], // Vulnerability: Returning full user object
      });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    // Vulnerability: Exposing error details to client
    return res.status(500).json({
      message: 'Database error',
      error: error.message,
      stack: error.stack,
    });
  }
}
