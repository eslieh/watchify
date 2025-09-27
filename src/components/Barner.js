import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Moviecard from "./Moviecard";

function Barner() {
  const [movie, setMovie] = useState(null);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
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

  // Fetch trailer when movie is loaded
  useEffect(() => {
    const fetchTrailer = async () => {
      if (!movie) return;

      const API_KEY = "589f8d3ada4c0c32b6db7671025e3162";
      const TRAILER_URL = `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}&language=en-US`;

      try {
        const response = await fetch(TRAILER_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch trailer");
        }
        const data = await response.json();
        
        // Find the first YouTube trailer
        const youtubeTrailer = data.results?.find(
          (video) => video.site === "YouTube" && video.type === "Trailer"
        );
        
        if (youtubeTrailer) {
          setTrailer(youtubeTrailer);
          setShowTrailer(true); // Auto-show trailer
        }
      } catch (error) {
        console.error("Error fetching trailer:", error);
      }
    };

    fetchTrailer();
  }, [movie]);

  const handleMovieClick = () => {
    if (movie) {
      setSelectedMovieId(movie.id);
    }
  };

  const handleWatchButtonClick = () => {
    if (movie) {
      const movieTitle = movie?.title ? encodeURIComponent(movie.title) : '';
      const titleParam = movieTitle ? `?title=${movieTitle}` : '';
      navigate(`/watch/${movie.id}${titleParam}`);
    }
  };

  const handleCloseTrailer = () => {
    setShowTrailer(false);
  };

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {selectedMovieId && <Moviecard id={selectedMovieId} />}

      <div className="barners">
        {showTrailer && trailer ? (
          <div className="trailer-container">
            <iframe
              className="trailer-video"
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&controls=0&rel=0&modestbranding=1`}
              title={`${movie.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <button className="close-trailer" onClick={handleCloseTrailer}>
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
        ) : (
          <img
            className="barner-image"
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
          />
        )}
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
