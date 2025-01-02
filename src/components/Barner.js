import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Moviecard from "./Moviecard";

function Barner() {
  const [movie, setMovie] = useState(null);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch a trending movie from TMDb API
    const fetchTrendingMovie = async () => {
      const API_KEY = "589f8d3ada4c0c32b6db7671025e3162"; // Replace with your TMDb API key
      const BASE_URL = `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`;

      try {
        const response = await fetch(BASE_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch trending movies");
        }
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          setMovie(data.results[0]); // Set the first trending movie
        }
      } catch (error) {
        console.error("Error fetching trending movie:", error);
      }
    };

    fetchTrendingMovie();
  }, []);

  const handleMovieClick = () => {
    if (movie) {
      setSelectedMovieId(movie.id);
    }
  };

  const handleWatchButtonClick = () => {
    if (movie) {
      navigate(`/watch/${movie.id}`);
    }
  };

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {selectedMovieId && <Moviecard id={selectedMovieId} />}

      <div className="barners">
        <img
          className="barner-image"
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
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
