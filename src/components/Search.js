import React, { useState, useEffect } from "react";
import Moviecard from "./Moviecard"; // Make sure you have the MovieCard component

function Search() {
  const [showResults, setShowResults] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]); // State to store search results
  const [loading, setLoading] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null); // State for the selected movie's ID

  const API_KEY = "589f8d3ada4c0c32b6db7671025e3162"; // TMDb API key

  // Handle the input change
  const handleSearch = (event) => {
    const input = event.target.value;
    setSearchTerm(input); // Update the search term
    setShowResults(input.length > 0); // Show results if input is not empty
  };

  // Fetch search results when the search term changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchTerm) return; // If search term is empty, don't fetch

      setLoading(true);

      const BASE_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchTerm}&language=en-US&page=1`;

      try {
        const response = await fetch(BASE_URL);
        const data = await response.json();
        setSearchResults(data.results); // Store the search results
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchTerm]); // Only fetch when the search term changes

  // Handle movie click (show movie card)
  const handleMovieClick = (id) => {
    setSelectedMovieId(id); // Set the selected movie ID
  };

  // Handle cancel action (close the movie card)
  const handleCancel = () => {
    setSelectedMovieId(null); // Reset the selected movie ID to null
  };

  return (
    <>
      {/* Display Movie Card if a movie is selected */}
      {selectedMovieId && (
        <div className="movie-card-wrapper">
          <Moviecard id={selectedMovieId} onCancel={handleCancel} />
        </div>
      )}

      <div className="search-cint">
        <button className="searchbtn">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
        <input
          type="text"
          name="search"
          onChange={handleSearch}
          placeholder="What do you wanna watch?"
        />
      </div>

      {/* Show the search term and results only when there's input */}
      {showResults && (
        <div className="search-wrapper-info">
          <p className="result-texte">Results for "{searchTerm}"</p>

          {/* Show loading indicator if results are being fetched */}
          {loading && <div>Loading...</div>}

          {/* Display the search results */}
          <div className="list">
            {searchResults.length > 0 ? (
              searchResults.map((movie) => (
                <div
                  key={movie.id}
                  className="movie-barners"
                  onClick={() => handleMovieClick(movie.id)} // Click to view movie card with the movie id
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} // Use smaller image size (w500)
                    alt={movie.title}
                    className="imag-lists"
                  />
                  <div className="movie-title">{movie.title}</div>
                </div>
              ))
            ) : (
              <div>No results found.</div> // Show message if no results found
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Search;
