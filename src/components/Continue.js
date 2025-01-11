import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Continue() {
  const navigate = useNavigate();  // Initialize the navigate function

  // Define state to store the movies data
  const [userMovies, setUserMovies] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors
  const [thumbnails, setThumbnails] = useState({}); // Store movie thumbnails fetched from TMDb
  const userId =
    sessionStorage.getItem("user_id") || localStorage.getItem("user_id");

  // Function to fetch movie or series thumbnail from TMDb API
  const fetchMovieThumbnail = async (movieId, isSeries = false) => {
    const tmdbApiKey = "589f8d3ada4c0c32b6db7671025e3162"; // Replace with your actual TMDb API key
    const tmdbApiUrl = `https://api.themoviedb.org/3/${isSeries ? "tv" : "movie"}/${movieId}?api_key=${tmdbApiKey}&language=en-US`;

    try {
      const response = await fetch(tmdbApiUrl);
      const data = await response.json();
      
      // Check if the response is a series or movie and if a poster is available
      if (data.poster_path) {
        const thumbnailUrl = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
        setThumbnails((prevThumbnails) => ({
          ...prevThumbnails,
          [movieId]: thumbnailUrl,
        }));
      } else {
        console.log(`No thumbnail found for ${isSeries ? "series" : "movie"} with ID: ${movieId}`);
      }
    } catch (error) {
      console.error(`Error fetching thumbnail for ${isSeries ? "series" : "movie"} with ID: ${movieId}`, error);
    }
  };

  // Function to fetch movies data from userdata API
  useEffect(() => {
    // Make sure userId exists before making the API call
    if (!userId) {
      setError("User ID not found");
      setLoading(false);
      return;
    }
  
    // The URL of your PHP script that fetches user watch data
    const apiUrl = `https://fueldash.net/watchify/userdata/streamdata.php?user_id=${userId}`; // Adjust the endpoint as needed
  
    // Make the API request to get the user watch data
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data from server");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);  // Log to check the structure
  
        if (data.success) {
          setUserMovies(data.data); // Store the fetched movies data in state
  
          // For each movie, check if it's part of a series and fetch thumbnail if needed
          data.data.forEach((movie) => {
            if (!movie.movie_thumb || movie.movie_thumb === "0") {
              console.log(`Checking if movie ID ${movie.movie_id} is part of a series...`);
              
              // Check if the movie is part of a series (check for season or series data)
              const isSeries = movie.s !== null && movie.e !== null;  // Assuming s and e represent season/episode info

              // Fetch the thumbnail if not already available
              fetchMovieThumbnail(movie.movie_id, isSeries);
            }
          });
        } else {
          setError("Unexpected response format or no data available");
        }
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.message); // Set the error message
        setLoading(false); // Stop loading on error
      });
  }, [userId]);
  
  // Handle click on a movie item (navigating to watch or series page)
  const handleItemClick = (movie) => {
    console.log(`Clicked on movie with ID: ${movie.movie_id}`);
    
    // Check if the clicked item is a movie or series
    const isSeries = movie.s !== null && movie.e !== null; // Assuming s and e represent season/episode info

    // Navigate accordingly
    if (isSeries) {
      // Navigate to series page with season and episode query parameters
      navigate(`/series/${movie.movie_id}?s=${movie.s}&e=${movie.e}`);
    } else {
      // Navigate to movie page
      navigate(`/watch/${movie.movie_id}`);
    }
  };

  // If there's an error, display it
  if (error) {
    return <div>Error: {error}</div>;
  }

  // If still loading, show a loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="header-text">Continue Watching</h2>
      <div className="listse">
        {userMovies.map((movie) => (
            <div
              key={movie.movie_id} // Assuming movie_id is the unique identifier
              className="movie-barners"
              onClick={() => handleItemClick(movie)} // Pass the movie object to handle item click
            >
              <img
                src={
                  movie.movie_thumb && movie.movie_thumb !== "0"
                    ? movie.movie_thumb
                    : thumbnails[movie.movie_id] // Fallback if movie_thumb is missing or "0"
                }
                alt={`Movie ${movie.movie_id}`}
                className="imadg-lists"
              />
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default Continue;
