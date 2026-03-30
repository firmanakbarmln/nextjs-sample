import { searchUsers } from '../../lib/db';

export default async function handler(req, res) {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: 'Query required' });
  }

  try {
    // Vulnerability: SQL Injection via searchUsers function
    const users = await searchUsers(q);
    return res.status(200).json(users);
  } catch (error) {
    // Vulnerability: Exposing error details
    return res.status(500).json({
      message: 'Search failed',
      error: error.message,
    });
  }
}
