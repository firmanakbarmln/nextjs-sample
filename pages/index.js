import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
//Testing
export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      setMessage(data.message);
      // Vulnerability: Storing token in localStorage (XSS risk)
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
    } catch (err) {
      setMessage('Login failed');
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Sample App - Fortify Scan</title>
      </Head>
      <main className={styles.main}>
        <h1>Sample Next.js Application</h1>
        <form onSubmit={handleLogin}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
        {/* Vulnerability: XSS via dangerouslySetInnerHTML */}
        {message && (
          <div dangerouslySetInnerHTML={{ __html: message }} />
        )}
      </main>
    </div>
  );
}
