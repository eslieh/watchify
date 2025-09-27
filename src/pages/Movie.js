import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import "./watch.css";
function Movie() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const [isInMyList, setIsInMyList] = useState(false); // State to track if the movie is in the user's list
  const navigate = useNavigate();
  const [userId, userid_i] = useState([]);
  useEffect(() => {
    // Check for user authentication data in localStorage
    const userData = localStorage.getItem("user_data");

    if (userData) {
      const parsedData = JSON.parse(userData);

      // Check if the data has expired
      if (parsedData.expiry > Date.now()) {
        sessionStorage.setItem("user_id", parsedData.user_id);
        sessionStorage.setItem("profile", parsedData.profile);
        userid_i(parsedData.user_id);
        // Redirect to homepage if valid
        // navigate("/");
      } else {
        // Remove expired data
        localStorage.removeItem("user_data");
      }
    }
  }, [navigate]);
  console.log(userId);
  useEffect(() => {
    // Fetch movie details using the provided movie id
    const fetchMovieDetails = async () => {
      const API_KEY = "589f8d3ada4c0c32b6db7671025e3162"; // Replace with your actual API key
      const BASE_URL = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`;

      try {
        const response = await fetch(BASE_URL);
        if (!response.ok) {
          throw new Error(`TMDb API Error: ${response.statusText}`);
        }
        const data = await response.json();
        setMovie(data); // Store movie details
      } catch (error) {
        setError(error.message); // Set error message if the request fails
        console.error("Error fetching movie details:", error);
      }
    };

    // Check if the movie is already in the user's "My List"
    const checkMovieInList = async () => {
      if (!userId) return; // Ensure user is logged in

      try {
        // Fetch the user's movie list with both user_id and movie_id in the URL as query parameters
        const response = await fetch(
          `https://fueldash.net/watchify/userdata/mylist.php?action=check&user_id=${userId}&movie_id=${id}`
        );

        // Check if the response is ok (status 200)
        if (!response.ok) {
          throw new Error("Failed to fetch movie list");
        }

        // Parse the JSON response
        const data = await response.json();
        // Check if the movie ID is in the user's list (data will be an object with a "found" key)
        setIsInMyList(data.found); // Assuming the PHP script returns { found: true/false }
      } catch (error) {
        console.error("Error checking movie in list:", error);
      }
    };

    if (id) {
      fetchMovieDetails();
      checkMovieInList();
    }
  }, [id, userId]); // Fetch data whenever the movie id or user id changes

  // Function to handle cancel button click and reset movie card visibility
  const handleCancelClick = () => {
    setMovie(null); // Reset the movie data when cancel button is clicked
  };

  // Function to handle Watch button click, navigating to the /watch page with the movie id
  const handleWatchClick = () => {
    const movieTitle = movie?.title ? encodeURIComponent(movie.title) : '';
    const titleParam = movieTitle ? `?title=${movieTitle}` : '';
    navigate(`/watch/${id}${titleParam}`); // Redirect to the /watch page with the movie id
  };

  // Function to handle add/remove from My List
  const handleMyListClick = async () => {
    if (!userId) return; // Ensure user is logged in

    const action = isInMyList ? "remove" : "add"; // Decide whether to add or remove

    try {
      console.log(userId);
      const postData = {
        user_id: userId,
        movie_id: id,
        title: movie.title, // Include the movie title
        thumb_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`, // Include the thumbnail URL
      };
      console.log(postData);
      // Make a POST request to your PHP backend to add or remove the movie
      const response = await fetch(
        `https://fueldash.net/watchify/userdata/mylist.php?action=${action}&user_id=${userId}&movie_id=${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }
      );

      if (!response.ok) {
        throw new Error("Error updating movie list");
      }

      const data = await response.json();
      if (data.success) {
        setIsInMyList(!isInMyList); // Toggle the button state after the request
      } else {
        console.error("Error updating the list:", data.error);
      }
    } catch (error) {
      console.error("Error updating movie list:", error);
    }
  };

  if (error) {
    return <div id="load">Error: {error}</div>; // Display error if fetching fails
  }

  if (!movie) {
    return <div id="load">Loading...</div>; // Display loading state if movie data is not yet fetched
  }
  const link = `https://wa.me/?text=Watch this https://watchifyy.vercel.app/movie/${id}`;
  return (
    <>
      <Nav />
      <div className="movie-card-pop-s">
        <div className="movie-data-details">
          <div className="card-image">
            <img
              className="cardim"
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} // Use smaller image size (w500)
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
                <button
                  className="watchNow"
                  onClick={handleMyListClick}
                  title={isInMyList ? "Remove from My List" : "Add to My List"} // Show helper text
                >
                  <i
                    className={`fa-solid ${
                      isInMyList ? "fa-check" : "fa-plus"
                    }`}
                  ></i>{" "}
                  {/* Change icon based on movie status in My List */}
                </button>
                <a href={link}>
                  <button
                    className="watchNow"
                    title={"Share"} // Show helper text
                  >
                    <i class="fa-solid fa-arrow-up-from-bracket"></i>
                    Share
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Movie;
