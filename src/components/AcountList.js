import React, { useState, useEffect } from "react";
import Moviecard from "./Moviecard";

function AcountList({user_id}) {
  const [myListMovies, setMyListMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null); // State for the selected movie ID
  const [error, setError] = useState(null);

  const handleMovieClick = (id) => {
    setSelectedMovieId(id); // Set the selected movie ID
  };

  if (error) {
    return <div>Error: {error}</div>; // Display error if fetching fails
  }

  if (myListMovies.length === 0) {
    return <div>Loading...</div>; // Display loading state
  }

  return (

   <div>
    <h2 className="header-text">My List</h2>
    <div className="listse">
        {selectedMovieId && <Moviecard id={selectedMovieId} />} {/* Render Moviecard for the selected movie */}
            {myListMovies.map((movie) => (
            <div key={movie.id} className="movie-barners" onClick={() => handleMovieClick(movie.id)}>
                <img
                src={movie.poster_path} // Ensure your backend provides the full image URL
                alt={movie.title}
                className="imadg-lists"
                />
            </div>
            ))}
      </div>
    </div>
  );
}

export default AcountList;
