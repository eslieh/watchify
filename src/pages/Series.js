import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Topbar from "../components/Topbar";
import "./watch.css";

function Series() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [series, setSeries] = useState(null);
  const [totalEpisodes, setTotalEpisodes] = useState(0);
  const [seasonData, setSeasonData] = useState(null);
  const [generalD, generalDetailes] = useState(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId =
    sessionStorage.getItem("user_id") || localStorage.getItem("user_id");
  const userProfile =
    sessionStorage.getItem("profile") || localStorage.getItem("profile");

  useEffect(() => {
    if (!userId || !userProfile) {
      window.location.href = "/auth"; // Redirect to login
      return;
    }

    // Fetch subscription details
    fetchSubscriptionData();

    // Parse query parameters for season and episode
    const urlParams = new URLSearchParams(location.search);
    const season = urlParams.get("s");
    const episode = urlParams.get("e");
    const fetchGeneralSeriesDetails = async () => {
      const API_KEY = "589f8d3ada4c0c32b6db7671025e3162";
      const URL = `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=en-US`;
  
      try {
        const response = await fetch(URL);
        if (!response.ok) {
          throw new Error(`TMDb API Error: ${response.statusText}`);
        }
        const data = await response.json();
        generalDetailes(data);
      } catch (error) {
        console.error("Error fetching general series details:", error);
      }
    };
    fetchGeneralSeriesDetails();

    const fetchSeriesDetails = async () => {
      const API_KEY = "589f8d3ada4c0c32b6db7671025e3162";
      const BASE_URL = `https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${API_KEY}&language=en-US`;

      try {
        const response = await fetch(BASE_URL);
        if (!response.ok) {
          throw new Error(`TMDb API Error: ${response.statusText}`);
        }
        const data = await response.json();
        setSeries(data);
        setSeasonData(data);
        postWatchData(data);
        setTotalEpisodes(data.episodes.length);
      } catch (error) {
        console.error("Error fetching series details:", error);
      }
    };

    fetchSeriesDetails();
  }, [id, userId, userProfile, location.search]);
  console.log(series)
  const fetchSubscriptionData = async () => {
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

  const postWatchData = async (seriesData) => {
    // Extract season and episode from query parameters
    const urlParams = new URLSearchParams(location.search);
    const season = urlParams.get("s");
    const episode = urlParams.get("e");
    const watchData = {
      user_id: userId,
      movie_id: seriesData.id,
      length: seriesData.episode_run_time?.[0] || 0,
      movie_thumb: `https://image.tmdb.org/t/p/w500${seriesData.poster_path}`,
      season_number: parseInt(season, 10),  // Ensure season number is an integer
      episode_number: parseInt(episode, 10), // Ensure episode number is an integer
    };
    
    console.log(watchData);
    
  
    try {
      const response = await fetch(
        `https://fueldash.net/watchify/userdata/streamdata.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(watchData),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to post watch data to backend");
      }
      console.log("Watch data posted successfully:", await response.json());
    } catch (error) {
      console.error("Error posting watch data:", error);
    }
  };
  

  const changeEpisode = (direction) => {
    const urlParams = new URLSearchParams(location.search);
    let season = parseInt(urlParams.get("s") || "1");
    let episode = parseInt(urlParams.get("e") || "1");

    if (direction === "next") {
      if (episode < totalEpisodes) {
        episode += 1;
      } else if (seasonData && season < seasonData.season_number) {
        season += 1;
        episode = 1;
      }
    } else if (direction === "prev" && episode > 1) {
      episode -= 1;
    }

    navigate(`/series/${id}?s=${season}&e=${episode}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Check if subscription is expired or needs renewal
  const currentDate = new Date();
  const nextBillingDate = new Date(subscriptionDetails?.next_billing_date);
  const isSubscriptionExpired = currentDate > nextBillingDate;

  if (isSubscriptionExpired) {
    return (
      <>
        <Topbar profile={userProfile} />
        <div className="subscription_prompt">
          <div className="subscription-prompt">
            <h2>Your subscription has expired</h2>
            <p>Subscribe to continue watching!</p>
            <div className="continue-watching"></div>
            <button onClick={() => navigate("/subscription")}>
              Subscribe Now
            </button>
          </div>
        </div>
        {series && (
          <>
            <img
              src = {`https://image.tmdb.org/t/p/original/${generalD.backdrop_path}`}
              alt={generalD.title }
              className="series-thumb"
            />
          </>
        )}
      </>
    );
  }

  if (!series) {
    return <div>Loading...</div>;
  }

  const urlParams = new URLSearchParams(location.search);
  const season = urlParams.get("s");
  const episode = urlParams.get("e");

  const hasNextEpisode =
    totalEpisodes > 0 &&
    (episode < totalEpisodes ||
      (seasonData && season < seasonData.season_number));
  const hideNextButton = !hasNextEpisode;

  return (
    <>
      <Topbar profile={userProfile} />
      <div className="watch-container">
        <iframe
          id="watchdiv"
          className="player"
          src={`https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`}
          title="Series Player"
          allowFullScreen
        ></iframe>
        <div className="navigation-buttons">
          <button
            className="navbtns"
            onClick={() => changeEpisode("prev")}
            disabled={episode <= 1}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          {!hideNextButton && (
            <button className="navbtns" onClick={() => changeEpisode("next")}>
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Series;
