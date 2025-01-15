import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login";
import Signup from "../components/Signup";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true); // For loading state
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
      } finally {
        setLoading(false); // Set loading state to false after fetching
      }
    };
  
    fetchTrendingMovie();
  }, []);

  useEffect(() => {
    // Check for user authentication data in localStorage
    const userData = localStorage.getItem("user_data");

    if (userData) {
      const parsedData = JSON.parse(userData);

      // Check if the data has expired
      if (parsedData.expiry > Date.now()) {
        sessionStorage.setItem("user_id", parsedData.user_id);
        sessionStorage.setItem("profile", parsedData.profile);
        // Redirect to homepage if valid
        navigate("/");
      } else {
        // Remove expired data
        localStorage.removeItem("user_data");
      }
    }
  }, [navigate]);

  const toggleAuth = () => {
    setIsLogin((prevState) => !prevState);
  };

  if (loading) {
    return <div>Loading movie...</div>; // Display loading message while fetching
  }

  return (
    <>
      {movie?.backdrop_path ? (
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          className="back-image"
          alt="Trending Movie"
        />
      ) : (
        <div>No movie backdrop available</div>
      )}
      <div className="authContainer">
        <div className="center-contents">
          <div className="my-logo">Watchify</div>
          <div className="action_s">
            {isLogin ? <Login /> : <Signup />}
            <button onClick={toggleAuth} className="toggle-btn">
              {isLogin ? "Switch to Signup" : "Switch to Login"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Auth;
