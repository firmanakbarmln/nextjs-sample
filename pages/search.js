import { useState } from 'react';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const res = await fetch(`/api/search?q=${query}`);
    const data = await res.json();
    setResults(data);
  };

  return (
    <div>
      <h1>Search Users</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <button onClick={handleSearch}>Search</button>

      <div>
        {/* Vulnerability: XSS via dangerouslySetInnerHTML */}
        <p>Search results for: <span dangerouslySetInnerHTML={{ __html: query }} /></p>
        {results.map((user) => (
          <div key={user.id}>
            {/* Vulnerability: Displaying sensitive data */}
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <p>Credit Card: {user.credit_card}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
