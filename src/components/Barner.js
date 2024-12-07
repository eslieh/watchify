import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import Moviecard from "./Moviecard";

function Barner() {
  const [movie, setMovie] = useState(null);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    // Fetch a movie from TMDb API
    const fetchMovieData = async () => {
      const API_KEY = '589f8d3ada4c0c32b6db7671025e3162'; // Replace with your TMDb API key
      
      function getRandomNumber() {
        return Math.floor(Math.random() * 1000) + 1; // Adjust range as needed
      }

      const movieId = getRandomNumber();
      const BASE_URL = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US`;

      try {
        const response = await fetch(BASE_URL);
        const data = await response.json();
        setMovie(data);  // Set the movie data
      } catch (error) {
        console.error('Error fetching movie data:', error);
      }
    };

    fetchMovieData();
  }, []);  // Empty dependency array ensures it runs only once on mount

  const handleMovieClick = () => {
    if (movie) {
      setSelectedMovieId(movie.id); // Set the selected movie ID when "More Info" is clicked
    }
  };

  // Navigate to the watch page when the "Watch Movie" button is clicked
  const handleWatchButtonClick = () => {
    if (movie) {
      navigate(`/watch/${movie.id}`); // Navigate to the watch page with the movie ID
    }
  };

  if (!movie) {
    return <div>Loading...</div>; // Show loading state if data is not yet fetched
  }

  return (
    <>
      {selectedMovieId && <Moviecard id={selectedMovieId} />} {/* Render Moviecard if a movie is selected */}
      
      <div className="barners">
        <img
          className="barner-imamge"
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} // Use backdrop image URL from TMDb
          alt={movie.title}
        />
        <div className="movie-details">
          <div className="movie-data">
            <div className="movie-name">{movie.title}</div>
            <div className="movie-description">{movie.overview}</div>
            <div className="action-btns">
              <button className="watchBtn" id="watch" onClick={handleWatchButtonClick}>
                Watch Movie
              </button>
              <button className="Morein" id="watch" onClick={handleMovieClick}>
                More Info <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Barner;
