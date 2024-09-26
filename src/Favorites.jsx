// Favorites.jsx
import React from 'react';

const Favorites = ({ favorites, removeFromFavorites }) => {
  return (
    <div>
      <h1 className="text-center my-4">Favorite Cat Facts</h1>
      <div className="row">
        {favorites.length > 0 ? (
          favorites.map((fact, index) => (
            <div className="col-md-4" key={index}>
              <div className="card mb-4 position-relative">
                <button
                  className="btn btn-outline-dark btn-sm position-absolute top-0 end-0 m-2"
                  onClick={() => removeFromFavorites(fact)}
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
          <p className="text-center">No favorite facts yet.</p>
        )}
      </div>
    </div>
  );
};

export default Favorites;
