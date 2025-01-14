import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import "./watch.css";
import "./hider.css";
function Watch() {
  const { id } = useParams(); // Get the movie ID from the URL parameter
  const [movie, setMovie] = useState(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionExpired, setSubscriptionExpired] = useState(false);
  const [lastWatchTime, setLastWatchTime] = useState(0); // Track the last watch time
  const userId =
    sessionStorage.getItem("user_id") || localStorage.getItem("user_id");
  const userProfile =
    sessionStorage.getItem("profile") || localStorage.getItem("profile");
  const navigate = useNavigate(); // Hook for navigation
  useEffect(() => {
    // Dynamically load hider.css only when the page is loaded
    const hiderCss = document.createElement("link");
    hiderCss.rel = "stylesheet";
    hiderCss.href = "./hider.css"; // Path to your hider.css file
    document.head.appendChild(hiderCss);

    // Clean up by removing the stylesheet when the page is closed or the component is unmounted
    return () => {
      document.head.removeChild(hiderCss);
    };
  }, []);
  useEffect(() => {
    if (!userId || !userProfile) {
      window.location.href = "/auth"; // Redirect to the login/auth page
      return;
    }

    const fetchSubscriptionDetails = async () => {
      try {
        const response = await fetch(
          `https://fueldash.net/watchify/userdata/subscription_data.php?user_id=${userId}`
        );
        const data = await response.json();
        setSubscriptionDetails(data[0]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching subscription details:", error);
        setLoading(false);
      }
    };

    fetchSubscriptionDetails();
  }, [userId, id]);

  useEffect(() => {
    if (subscriptionDetails) {
      const currentDate = new Date();
      const nextBillingDate = new Date(subscriptionDetails.next_billing_date);
      if (currentDate > nextBillingDate) {
        setSubscriptionExpired(true);
      }
    }
  }, [subscriptionDetails]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const API_KEY = "589f8d3ada4c0c32b6db7671025e3162";
      const BASE_URL = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`;

      try {
        const response = await fetch(BASE_URL);
        if (!response.ok) {
          throw new Error(`TMDb API Error: ${response.statusText}`);
        }
        const data = await response.json();
        setMovie(data);
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
      length: movieData.runtime || 0,
      movie_thumb: `https://image.tmdb.org/t/p/w500${movieData.poster_path}`, // Adding the movie thumbnail
    };

    console.log(watchData);

    try {
      const response = await fetch(
        `https://fueldash.net/watchify/userdata/streamdata.php  `,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(watchData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save watch data");
      }
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (subscriptionExpired) {
    return (
      <>
        <Nav profile={userProfile} />
        <div className="subscription_prompt">
          <h2>Your subscription has expired</h2>
          <p>Subscribe to continue watching {movie.title}!</p>
          <button onClick={() => navigate("/subscription")}>
            Subscribe Now
          </button>
        </div>
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
          src={`https://www.2embed.cc/embed/${movie.id}?start=${lastWatchTime}`} // Start from last watch time
          title="Movie Trailer"
          allowFullScreen
        ></iframe>
      </div>
    </>
  );
}

export default Watch;
