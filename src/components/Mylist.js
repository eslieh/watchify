import React, { useState, useEffect } from "react";
import Moviecard from "./Moviecard";

function MyList({user_id}) {
  const [myListMovies, setMyListMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null); // State for the selected movie ID
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user's movie list from your backend API
    const fetchMyList = async () => {
      const API_URL = `https://fueldash.net/watchify/userdata/getmylist.php?user_id=${user_id}`; // Replace with your backend URL

      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`Backend API Error: ${response.statusText}`);
        }
        const data = await response.json();
        setMyListMovies(data); // Assume data is an array of movie objects
      } catch (error) {
        setError(error.message); // Handle errors
        console.error("Error fetching My List:", error);
      }
    };

    fetchMyList();
  }, []);

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
    <div className="mylists">
        <h2 className="hio">My List</h2>
      {selectedMovieId && <Moviecard id={selectedMovieId} />} {/* Render Moviecard for the selected movie */}
      <div className="list">
        {myListMovies.map((movie) => (
          <div key={movie.id} className="movie-barners" onClick={() => handleMovieClick(movie.id)}>
            <img
              src={movie.poster_path} // Ensure your backend provides the full image URL
              alt={movie.title}
              className="imag-lists"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyList;
