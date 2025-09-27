import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import WatchTracker from "../components/WatchTracker";
import "./watch.css";

function Watch() {
  const { id } = useParams(); // movie ID from route
  const [movieData, setMovieData] = useState(null);
  const navigate = useNavigate();
  // Fetch movie details for tracking
  useEffect(() => {
    if (!id) return;

    const fetchMovieDetails = async () => {
      const API_KEY = "589f8d3ada4c0c32b6db7671025e3162";
      const BASE_URL = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`;

      try {
        const response = await fetch(BASE_URL);
        if (response.ok) {
          const data = await response.json();
          setMovieData({
            id: data.id,
            title: data.title,
            poster: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : null,
            overview: data.overview
          });
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (!id) {
    return (
      <>
        <Nav />
        <div className="watch-container">No video ID provided.</div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="watch-container">
        <iframe
          id="watchdiv"
          className="player"
          src={`https://www.2embed.cc/embed/${id}`}
          title="Video Stream"
          allowFullScreen
        />
        <div className="navigation-buttons">
          <div className="navigation-buttons-inner">
            <button className="navbtns" onClick={() => navigate("/")}><i className="fa-solid fa-arrow-left"></i></button>
          </div>
          <div className="navigation-buttons-inner">
            <button className="navbtns" style={{cursor: "default", marginRight: "-55px", visibility: "hidden"}} onClick={() => navigate("/")}><i className="fa-solid fa-arrow-left"></i></button>
            <span className="movie_data_details">
              <span className="movie_data_details_title">
                {movieData?.title || "Movie"}
              </span>
            </span>
          </div>
        </div>
        {/* Watch tracker for movies */}
        {movieData && (
          <WatchTracker
            id={movieData.id}
            type="movie"
            title={movieData.title}
            poster={movieData.poster}
            overview={movieData.overview}
          />
        )}
      </div>
    </>
  );
}

export default Watch;
