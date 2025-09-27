import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Moviecard({ id }) {
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch movie details using the provided movie id
    const fetchMovieDetails = async () => {
      const API_KEY = "589f8d3ada4c0c32b6db7671025e3162";
      const BASE_URL = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`;

      try {
        const response = await fetch(BASE_URL);
        if (!response.ok) {
          throw new Error(`TMDb API Error: ${response.statusText}`);
        }
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching movie details:", error);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  const handleCancelClick = () => {
    setMovie(null);
  };

  const handleWatchClick = () => {
    const movieTitle = movie?.title ? encodeURIComponent(movie.title) : '';
    const titleParam = movieTitle ? `?title=${movieTitle}` : '';
    navigate(`/watch/${id}${titleParam}`);
  };

  if (error) {
    return <div id="load">Error: {error}</div>;
  }

  if (!movie) {
    return <div id="load">Loading...</div>;
  }

  const link = `https://wa.me/?text=Watch this https://watchifyy.vercel.app/movie/${id}`;
  return (
    <div className="movie-card-pop">
      <div className="movie-data-details">
        <div className="card-image">
          <img
            className="cardim"
            src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
            alt={movie.title}
          />
        </div>
        <div className="movie-info">
          <div className="cancelbt">
            <button className="cancel" onClick={handleCancelClick}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="moviencjks">
            <div className="movie-name">{movie.title}</div>
            <div className="movie-description">{movie.overview}</div>
            <div className="action-details">
              <button className="watchNow" onClick={handleWatchClick}>
                Play <i className="fa-solid fa-play"></i>
              </button>
              <a href={link} target="_blank" rel="noopener noreferrer">
                <button className="watchNow" title="Share">
                  <i className="fa-solid fa-arrow-up-from-bracket"></i> Share
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Moviecard;
