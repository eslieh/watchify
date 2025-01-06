import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Topbar from "../components/Topbar";
import "./watch.css";

function Watch() {
  const { id } = useParams(); // Get the movie ID from the URL parameter
  const [movie, setMovie] = useState(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionExpired, setSubscriptionExpired] = useState(false);
  const userId =
    sessionStorage.getItem("user_id") || localStorage.getItem("user_id");
  const userProfile =
    sessionStorage.getItem("profile") || localStorage.getItem("profile");
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // If user data is not available, redirect to the auth page
    if (!userId || !userProfile) {
      window.location.href = "/auth"; // Redirect to the login/auth page
      return;
    }

    // Fetch subscription details
    const fetchSubscriptionDetails = async () => {
      try {
        const response = await fetch(
          `https://fueldash.net/watchify/userdata/subscription_data.php?user_id=${userId}`
        );
        const data = await response.json();
        setSubscriptionDetails(data[0]); // Assuming the user has one subscription
        setLoading(false);
      } catch (error) {
        console.error("Error fetching subscription details:", error);
        setLoading(false);
      }
    };

    fetchSubscriptionDetails();
  }, [userId, userProfile]);

  useEffect(() => {
    if (subscriptionDetails) {
      const currentDate = new Date();
      const nextBillingDate = new Date(subscriptionDetails.next_billing_date);
      if (currentDate > nextBillingDate) {
        setSubscriptionExpired(true); // Mark the subscription as expired
      }
    }
  }, [subscriptionDetails]);

  useEffect(() => {
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
        postWatchData(data); // Post watch data to backend
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
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state while fetching data
  }

  if (!movie) {
    return <div>Loading movie...</div>; // Show loading state while movie details are fetched
  }
  console.log(movie)
  if (subscriptionExpired) {
    return (
      <>
        <Topbar profile={userProfile} />
        <div className="subscription_prompt">
          <div className="subscription-prompt">
            <h2>Your subscription has expired</h2>
            <p>Subscribe to continue watching {movie.title}!</p>
            <div className="continue-watching"></div>
            <button onClick={() => navigate("/subscription")}>Subscribe Now</button>
          </div>
        </div>
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} // Movie poster
            alt={movie.title} // Movie title for the alt text
            className="series-thumb" // Add appropriate styling
          />
      </>
    );
  }

  return (
    <>
      <Topbar profile={userProfile} />
      <div className="watch-container">
        <iframe
          id="watchdiv"
          className="player"
          src={`https://www.2embed.cc/embed/${movie.id}`} // Embed player
          title="Movie Trailer"
          allowFullScreen
        ></iframe>
      </div>
    </>
  );
}

export default Watch;
