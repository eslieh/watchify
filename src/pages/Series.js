import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Topbar from "../components/Topbar";
import "./watch.css";

function Series() {
  const { id } = useParams(); // Get the series ID from the URL parameter
  const location = useLocation(); // Use the useLocation hook to access the location object
  const navigate = useNavigate(); // Use navigate for URL updates
  const [series, setSeries] = useState(null);
  const [totalEpisodes, setTotalEpisodes] = useState(0); // Store the total episodes in the current season
  const [seasonData, setSeasonData] = useState(null); // Store the fetched season data
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

    // Parse query parameters for season and episode
    const urlParams = new URLSearchParams(location.search);
    const season = urlParams.get("s");
    const episode = urlParams.get("e");

    const fetchSeriesDetails = async () => {
      const API_KEY = "589f8d3ada4c0c32b6db7671025e3162"; // Replace with your actual API key
      const BASE_URL = `https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${API_KEY}&language=en-US`;

      try {
        const response = await fetch(BASE_URL);
        if (!response.ok) {
          throw new Error(`TMDb API Error: ${response.statusText}`);
        }
        const data = await response.json();
        setSeries(data); // Store series details
        setSeasonData(data); // Store season details
        setTotalEpisodes(data.episodes.length); // Set total number of episodes for the season

        // Post watch data to backend
        postWatchData(data);
      } catch (error) {
        console.error("Error fetching series details:", error);
      }
    };

    fetchSeriesDetails();
  }, [id, userId, userProfile, location.search]); // Depend on `location.search` to handle changes in query params

  const postWatchData = async (seriesData) => {
    const watchData = {
      user_id: userId,
      series_id: seriesData.id,
      length: seriesData.episode_run_time?.[0] || 0, // Assume episode_run_time is in minutes
      series_thumb: `https://image.tmdb.org/t/p/w500${seriesData.poster_path}`, // TMDb poster URL
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

  const changeEpisode = (direction) => {
    const urlParams = new URLSearchParams(location.search);
    let season = parseInt(urlParams.get("s") || "1"); // Default to season 1 if not specified
    let episode = parseInt(urlParams.get("e") || "1"); // Default to episode 1 if not specified

    // Adjust episode and season based on direction
    if (direction === "next") {
      if (episode < totalEpisodes) {
        episode += 1; // Move to the next episode if not the last one
      } else if (seasonData && season < seasonData.season_number) {
        season += 1; // Move to the next season if available
        episode = 1; // Start from the first episode of the next season
      }
    } else if (direction === "prev" && episode > 1) {
      episode -= 1; // Move to the previous episode if not at the first one
    }

    // Update URL with the new season and episode
    navigate(`/series/${id}?s=${season}&e=${episode}`);
  };

  if (!series) {
    return <div>Loading...</div>; // Show loading state while series details are fetched
  }

  // Extract season and episode from URL
  const urlParams = new URLSearchParams(location.search); // Use location.search here
  const season = urlParams.get("s");
  const episode = urlParams.get("e");

  // Check if next season/episode exists
  const hasNextEpisode = totalEpisodes > 0 && (episode < totalEpisodes || (seasonData && season < seasonData.season_number));
  const hideNextButton = !hasNextEpisode; // Hide "Next" button if there's no next episode or season

  return (
    <>
      <Topbar profile={userProfile} />
      <div className="watch-container">
        <iframe
          id="watchdiv"
          className="player"
          src={`https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`} // Embed player for series with specific season & episode
          title="Series Player"
          allowFullScreen
        ></iframe>
        <div className="navigation-buttons">
          <button
            className="navbtns"
            onClick={() => changeEpisode("prev")}
            disabled={episode <= 1} // Disable "Previous" if on the first episode
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          {!hideNextButton && (
            <button
              className="navbtns"
              onClick={() => changeEpisode("next")}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Series;
