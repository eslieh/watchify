import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Topbar from "../components/Topbar";
import "./watch.css";

function Watch() {
  const { id } = useParams(); // Get the movie ID from the URL parameter
  const [movie, setMovie] = useState(null);
  const userId =
    sessionStorage.getItem("user_id") || localStorage.getItem("user_id");
  const userProfile =
    sessionStorage.getItem("profile") || localStorage.getItem("profile");

  useEffect(() => {
    // If user data is not available, redirect to the auth page
    if (!userId || !userProfile) {
      window.location.href = "/auth"; // Redirect to the login/auth page
      return;
    }

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

        // Post watch data to backend
        postWatchData(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [id, userId, userProfile]);

  const postWatchData = async (movieData) => {
    const watchData = {
      user_id: userId,
      movie_id: movieData.id,
      length: movieData.runtime || 0, // Assume runtime is in minutes
      movie_thumb: `https://image.tmdb.org/t/p/w500${movieData.poster_path}`, // TMDb poster URL
    };

    try {
      const response = await fetch(`https://fueldash.net/userdata/streamdata.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(watchData),
      });

      if (!response.ok) {
        throw new Error("Failed to post watch data to backend");
      }

      console.log("Watch data posted successfully:", await response.json());
    } catch (error) {
      console.error("Error posting watch data:", error);
    }
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const url = args[0];
      if (url.includes("adserver") || url.includes("ads")) {
        console.log("Blocked ad request:", url);
        return Promise.resolve(new Response(null, { status: 403 }));
      }
      return originalFetch(...args);
    };

    // Cleanup fetch override when component unmounts
    return () => {
      window.fetch = originalFetch;
    };
  };

  if (!movie) {
    return <div>Loading...</div>; // Show loading state while movie details are fetched
  }

  return (
    <>
      <Topbar profile={userProfile} />
      <div className="watch-container">
        <iframe
          className="player"
          src={`https://www.2embed.cc/embed/${movie.id}`} // Embed player
          title="Movie Trailer"
          // sandbox="allow-scripts allow-same-origin" // Restrict iframe behavior
          allowFullScreen
        ></iframe>
      </div>
    </>
  );
}

export default Watch;
