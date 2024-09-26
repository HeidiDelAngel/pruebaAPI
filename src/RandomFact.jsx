import React, { useState } from 'react';
import axios from 'axios';

const RandomFact = ({ addToFavorites }) => {
  const [randomFact, setRandomFact] = useState(null);
  const [randomLoading, setRandomLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para obtener un hecho aleatorio directamente desde la API
  const getRandomFactFromAPI = async () => {
    setRandomLoading(true); // Mostrar estado de carga
    try {
      const response = await axios.get('https://cat-fact.herokuapp.com/facts/random');
      const fact = response.data;
      // Filtrar el hecho para que contenga "cat" o "cats"
      if (fact.text.toLowerCase().includes('cat')) {
        setRandomFact(fact);  // Guardar el hecho aleatorio
      } else {
        // Si no contiene "cat", buscar otro hecho aleatorio
        await getRandomFactFromAPI(); // Llamar recursivamente
      }
      setRandomLoading(false);  // Desactivar estado de carga
    } catch (error) {
      setError(error);
      setRandomLoading(false);  // Desactivar estado de carga
    }
  };

  return (
    //Contenido de la pestaña "Dato Random"
    <div>
      <h1 className="text-center my-4">Get a Random Fact</h1>
      <div className="d-flex justify-content-center">
        <button className="btn btn-dark" onClick={getRandomFactFromAPI}>
          {randomLoading ? 'Cargando...' : 'New random fact'}
        </button>
      </div>
      {randomFact && !randomLoading && (
        <div className="mt-4 text-center">
          <div className="card">
            <div className="card-body">
              <p className="card-text">{randomFact.text}</p>
              <button className="btn btn-dark mt-2" onClick={() => addToFavorites(randomFact)}>Add to Favorites</button>
            </div>
          </div>
        </div>
      )}
      {error && <p className="text-center mt-4">Error: {error.message}</p>}
    </div>
  );
};

export default RandomFact;
