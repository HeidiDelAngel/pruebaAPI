import React from 'react';

//Renderiza la lista de hechos favoritos de gatos y permite eliminarlos
const Favorites = ({ favorites, removeFromFavorites }) => {
  return (
    <div>
      <h1 className="text-center my-4">Favorite Cat Facts</h1>
      <div className="row">
        {/* Verifica si hay hechos favoritos, si los hay, los mapea para mostrarlos */}
        {favorites.length > 0 ? (
          favorites.map((fact, index) => (
            <div className="col-md-4" key={index}>
              <div className="card mb-4 position-relative">
                <button
                  className="btn btn-outline-dark btn-sm position-absolute top-0 end-0 m-2"
                  onClick={() => removeFromFavorites(fact)} // Llama a la función para eliminar el hecho al hacer clic
                >
                  &times;
                </button>
                <div className="card-body">
                  <p className="card-text">{fact.text}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Muestra un mensaje si no hay hechos favoritos
          <p className="text-center">No favorite facts yet.</p>
        )}
      </div>
    </div>
  );
};

export default Favorites;
