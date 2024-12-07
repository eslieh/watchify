import React, { useState, useEffect } from "react";
import Moviecard from "./Moviecard";

function Trending() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null); // State to hold the selected movie ID
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch trending movies from TMDb API
    const fetchTrendingMovies = async () => {
      const API_KEY = "589f8d3ada4c0c32b6db7671025e3162"; // Replace with your actual API key
      const BASE_URL = `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`;

      try {
        const response = await fetch(BASE_URL);
        if (!response.ok) {
          throw new Error(`TMDb API Error: ${response.statusText}`);
        }
        const data = await response.json();
        setTrendingMovies(data.results); // Store trending movies
      } catch (error) {
        setError(error.message); // Set error message if the request fails
        console.error("Error fetching trending movies:", error);
      }
    };

    fetchTrendingMovies();
  }, []);

  const handleMovieClick = (id) => {
    setSelectedMovieId(id); // Set the selected movie ID when a movie is clicked
  };

  if (error) {
    return <div>Error: {error}</div>; // Display error if fetching fails
  }

  if (trendingMovies.length === 0) {
    return <div>Loading...</div>; // Display loading state if movies are not yet fetched
  }

  return (
    <div>
      {selectedMovieId && <Moviecard id={selectedMovieId} />} {/* Render Moviecard if a movie is selected */}
      <div className="list">
        {trendingMovies.map((movie) => (
          <div key={movie.id} className="movie-barners" onClick={() => handleMovieClick(movie.id)}>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} // Use smaller image size (w500)
              alt={movie.title}
              className="imag-lists"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Trending;
