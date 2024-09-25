import React, { useEffect, useState } from 'react';

function App() {
  const [facts, setFacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCatFacts = async () => {
      try {
        const response = await fetch('https://cat-fact.herokuapp.com/facts');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setFacts(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchCatFacts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="App">
      <h1>Random Cat Facts</h1>
      <ul>
        {facts.map((fact) => (
          <li key={fact._id}>{fact.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
