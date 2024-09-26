// App.jsx
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './App.css';
import RandomFact from './RandomFact';
import Favorites from './Favorites';

function App() {
  const [facts, setFacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('facts');
  const [bgImage, setBgImage] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const fetchCatFacts = async () => {
      try {
        const response = await axios.get('https://cat-fact.herokuapp.com/facts');
        const factsArray = response.data.all || response.data;
        if (Array.isArray(factsArray)) {
          setFacts(factsArray);
        } else {
          throw new Error('La estructura de los datos no es la esperada');
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    const fetchRandomCatImage = async () => {
      try {
        const response = await axios.get('https://api.thecatapi.com/v1/images/search');
        setBgImage(response.data[0].url);
      } catch (error) {
        console.error('Error fetching cat image:', error);
      }
    };

    fetchCatFacts();
    fetchRandomCatImage();
    const intervalId = setInterval(fetchRandomCatImage, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const addToFavorites = (fact) => {
    if (fact && !favorites.includes(fact)) {
      setFavorites([...favorites, fact]);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    }
  };

  const removeFromFavorites = (factToRemove) => {
    setFavorites(favorites.filter((fact) => fact !== factToRemove));
  };

  return (
    <div className="App" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', minHeight: '100vh' }}>
      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: '8px' }}>
        <div className="container-fluid">
          <label className="navbar-brand">Cat Facts App</label>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <button className={`nav-link ${activeTab === 'facts' ? 'active' : ''}`} onClick={() => handleTabChange('facts')}>Facts</button>
              </li>
              <li className="nav-item">
                <button className={`nav-link ${activeTab === 'random' ? 'active' : ''}`} onClick={() => handleTabChange('random')}>Random Fact</button>
              </li>
              <li className="nav-item">
                <button className={`nav-link ${activeTab === 'favorites' ? 'active' : ''}`} onClick={() => handleTabChange('favorites')}>Favorites</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        {activeTab === 'facts' && (
          <div>
            <h1 className="text-center my-4">Random Cat Facts</h1>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            <div className="row">
              {facts.length > 0 ? (
                facts.map((fact) => (
                  <div className="col-md-4" key={fact._id}>
                    <div className="card mb-4">
                      <div className="card-body">
                        <p className="card-text">{fact.text}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No facts available.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'random' && <RandomFact addToFavorites={addToFavorites} />}

        {showNotification && (
          <div className="alert alert-success text-center" role="alert">
            Fact added to favorites!
          </div>
        )}

        {activeTab === 'favorites' && <Favorites favorites={favorites} removeFromFavorites={removeFromFavorites} />}
      </div>
    </div>
  );
}

export default App;
