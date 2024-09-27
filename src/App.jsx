import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './App.css';
import RandomFact from './RandomFact';
import Favorites from './Favorites';
import Login from './Login.jsx'; // Importa el componente Login

function App() {
  const [facts, setFacts] = useState([]); // Almacena los hechos sobre gatos
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error
  const [activeTab, setActiveTab] = useState('facts');  // Pestaña activa
  const [bgImage, setBgImage] = useState(''); // Almacenar la imagen de fondo
  const [favorites, setFavorites] = useState([]); // Estado para almacenar favoritos
  const [showNotification, setShowNotification] = useState(false);  // Mostrar notificación de éxito
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado de autenticación

  // Obtener todos los hechos de gatos al cargar la página
  useEffect(() => {
    const fetchCatFacts = async () => {
      try {
        const response = await axios.get('https://cat-fact.herokuapp.com/facts');
        const factsArray = response.data.all || response.data;
        if (Array.isArray(factsArray)) {
          setFacts(factsArray); // Almacenar los hechos en el estado
        } else {
          throw new Error('La estructura de los datos no es la esperada');
        }
        setLoading(false);  // Desactivar el estado de carga
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    const fetchRandomCatImage = async () => {
      try {
        const response = await axios.get('https://api.thecatapi.com/v1/images/search');
        setBgImage(response.data[0].url); // Almacenar la URL de la imagen
      } catch (error) {
        console.error('Error fetching cat image:', error);
      }
    };

    fetchCatFacts();
    fetchRandomCatImage();
    const intervalId = setInterval(fetchRandomCatImage, 5000);
    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, []);

  // Función para cambiar entre pestañas
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  // Función para añadir el hecho random a favoritos
  const addToFavorites = (fact) => {
    if (fact && !favorites.includes(fact)) {
      setFavorites([...favorites, fact]);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000); // Ocultar la notificación después de 2 segundos
    }
  };

  // Función para eliminar un hecho de la lista de favoritos
  const removeFromFavorites = (factToRemove) => {
    setFavorites(favorites.filter((fact) => fact !== factToRemove));
  };

  // Función para manejar el inicio de sesión exitoso
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setActiveTab('facts'); // Cambiar a la pestaña de hechos después del login
  };

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('login'); // Redirige al login después de cerrar sesión
  };

  return (
    <div className="App" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', minHeight: '100vh' }}>
      {!isLoggedIn ? (
        // Mostrar el componente Login si el usuario no ha iniciado sesión
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
      {/* Header con pestañas */}
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
            <button className="btn btn-outline-danger ms-auto" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        {/* Mostrar contenido basado en la pestaña activa */}
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

        {/* Contenido de la pestaña "Dato Random" */}
        {activeTab === 'random' && <RandomFact addToFavorites={addToFavorites} />}

        {/* Mostrar notificación si se añade a favoritos */}
        {showNotification && (
          <div className="alert alert-success text-center" role="alert">
            Fact added to favorites!
          </div>
        )}

        {/* Pestaña de favoritos */}
        {activeTab === 'favorites' && <Favorites favorites={favorites} removeFromFavorites={removeFromFavorites} />}
      </div>
      </>
      )}
    </div>
  );
}

export default App;
