import axios from 'axios';

export default async function handler(req, res) {
  const { id, url } = req.query;

  if (req.method === 'GET') {
    // Vulnerability: SSRF - user controlled URL
    if (url) {
      try {
        const response = await axios.get(url);
        return res.status(200).json(response.data);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    // Vulnerability: Path Traversal
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join('/var/data/', id);
    
    try {
      // Vulnerability: No path sanitization
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return res.status(200).json({ content: fileContent });
    } catch (error) {
      return res.status(404).json({ message: 'File not found' });
    }
  }

  if (req.method === 'POST') {
    const { command } = req.body;

    // Vulnerability: Command Injection
    const { exec } = require('child_process');
    exec(`echo ${command}`, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(200).json({ output: stdout });
    });
  }

  if (req.method === 'DELETE') {
    // Vulnerability: No authentication check before delete
    const { exec } = require('child_process');
    exec(`rm -rf /tmp/${id}`, (error, stdout, stderr) => {
      return res.status(200).json({ message: 'Deleted' });
    });
  }
}
