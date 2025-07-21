import React, { useState, useEffect } from "react";
import Moviecard from "./Moviecard";
import Seriescard from "./Seriescard";

function Trending() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTVShows, setTrendingTVShows] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null); // State to hold the selected item ID
  const [selectedItemType, setSelectedItemType] = useState(null); // State to hold the type of selected item (movie or TV)
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch trending movies and TV shows from TMDb API
    const fetchTrendingData = async () => {
      const API_KEY = "589f8d3ada4c0c32b6db7671025e3162"; // Replace with your actual API key

      try {
        // Fetch trending movies
        const movieResponse = await fetch(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
        );
        if (!movieResponse.ok) {
          throw new Error(`TMDb Movies API Error: ${movieResponse.statusText}`);
        }
        const movieData = await movieResponse.json();
        setTrendingMovies(movieData.results);

        // Fetch trending TV shows
        const tvResponse = await fetch(
          `https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}`
        );
        if (!tvResponse.ok) {
          throw new Error(`TMDb TV Shows API Error: ${tvResponse.statusText}`);
        }
        const tvData = await tvResponse.json();
        setTrendingTVShows(tvData.results);
      } catch (error) {
        setError(error.message); // Set error message if any request fails
        console.error("Error fetching trending data:", error);
      }
    };

    fetchTrendingData();
  }, []);

  const handleItemClick = (id, type) => {
    setSelectedItemId(id); // Set the selected item ID when clicked
    setSelectedItemType(type); // Set the selected item type (movie or TV)
  };

  if (error) {
    return <div>Error: {error}</div>; // Display error if fetching fails
  }

  if (trendingMovies.length === 0 && trendingTVShows.length === 0) {
    return <div>Loading...</div>; // Display loading state if no data is fetched
  }

  return (
    <div className="about-indo">
      {/* Render Moviecard or Seriescard based on the selected item type */}
      {selectedItemId && selectedItemType === "movie" && (
        <Moviecard id={selectedItemId} />
      )}
      {selectedItemId && selectedItemType === "tv" && (
        <Seriescard id={selectedItemId} />
      )}

      <h2 className="header-text">Movies</h2>
      <div className="list trending">
        {trendingMovies.map((movie) => (
          <div
            key={movie.id}
            className="movie-barners"
            onClick={() => handleItemClick(movie.id, "movie")}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="imag-lists"
            />
          </div>
        ))}
      </div>

      <h2 className="header-text">TV Shows</h2>
      <div className="list trending">
        {trendingTVShows.map((tvShow) => (
          <div
            key={tvShow.id}
            className="movie-barners"
            onClick={() => handleItemClick(tvShow.id, "tv")}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
              alt={tvShow.name}
              className="imag-lists"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Trending;
