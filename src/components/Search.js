import React, { useState, useEffect } from "react";
import Moviecard from "./Moviecard"; // Movie card component
import Seriescard from "./Seriescard"; // Series card component

function Search() {
  const [showResults, setShowResults] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]); // State to store search results
  const [loading, setLoading] = useState(false);
  const [selectedTitleId, setSelectedTitleId] = useState(null); // State for the selected title's ID
  const [isMovieSelected, setIsMovieSelected] = useState(true); // Track if selected title is a movie

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

      // Fetch movies and TV shows concurrently
      const movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchTerm}&language=en-US&page=1`;
      const seriesUrl = `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${searchTerm}&language=en-US&page=1`;

      try {
        const [movieResponse, seriesResponse] = await Promise.all([
          fetch(movieUrl),
          fetch(seriesUrl),
        ]);

        const movieData = await movieResponse.json();
        const seriesData = await seriesResponse.json();

        // Combine movie and series results
        setSearchResults([...movieData.results, ...seriesData.results]);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchTerm]); // Only fetch when the search term changes

  // Handle title click (show appropriate card based on type)
  const handleTitleClick = (id, type) => {
    setSelectedTitleId(id); // Set the selected title ID
    setIsMovieSelected(type === "movie"); // Set the type (movie or series)
  };

  // Handle cancel action (close the movie or series card)
  const handleCancel = () => {
    setSelectedTitleId(null); // Reset the selected title ID to null
  };

  return (
    <>
      {/* Display Movie or Series Card based on selected title */}
      {selectedTitleId && (
        <div className="title-card-wrapper">
          {isMovieSelected ? (
            <Moviecard id={selectedTitleId} onCancel={handleCancel} />
          ) : (
            <Seriescard id={selectedTitleId} onCancel={handleCancel} />
          )}
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
              searchResults.map((title) => (
                <div
                  key={title.id}
                  className="title-barners"
                  onClick={() =>
                    handleTitleClick(title.id, title.media_type) // Pass the type (movie or tv)
                  }
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${title.poster_path}`} // Use smaller image size (w500)
                    alt={title.name || title.title} // Use name for TV shows and title for movies
                    className="imag-lists"
                  />
                  <div className="title-name">
                    {title.name || title.title} {/* Show name for series, title for movies */}
                  </div>
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
