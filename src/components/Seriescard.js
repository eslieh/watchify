import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Seriescard({ id }) {
  const [series, setSeries] = useState(null);
  const [error, setError] = useState(null);
  const [isInMyList, setIsInMyList] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const navigate = useNavigate();

  const userId =
    sessionStorage.getItem("user_id") || localStorage.getItem("user_id");
  const userProfile =
    sessionStorage.getItem("profile") || localStorage.getItem("profile");

  if (!userId || !userProfile) {
    window.location.href = "/auth";
  }

  useEffect(() => {
    const fetchSeriesDetails = async () => {
      const API_KEY = "589f8d3ada4c0c32b6db7671025e3162";
      const BASE_URL = `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=en-US`;

      try {
        const response = await fetch(BASE_URL);
        if (!response.ok) {
          throw new Error(`TMDb API Error: ${response.statusText}`);
        }
        const data = await response.json();
        setSeries(data);
        if (data.seasons && data.seasons.length > 0) {
          setSelectedSeason(data.seasons[0].season_number);
        }
      } catch (error) {
        setError(error.message);
        console.error("Error fetching series details:", error);
      }
    };

    if (id) {
      fetchSeriesDetails();
    }
  }, [id]);

  useEffect(() => {
    const fetchSeasonEpisodes = async () => {
      if (!selectedSeason || !series) return;

      const API_KEY = "589f8d3ada4c0c32b6db7671025e3162";
      const SEASON_URL = `https://api.themoviedb.org/3/tv/${id}/season/${selectedSeason}?api_key=${API_KEY}&language=en-US`;

      try {
        const response = await fetch(SEASON_URL);
        if (!response.ok) {
          throw new Error(`TMDb API Error: ${response.statusText}`);
        }
        const data = await response.json();
        setEpisodes(data.episodes || []);
      } catch (error) {
        console.error("Error fetching season episodes:", error);
      }
    };

    fetchSeasonEpisodes();
  }, [selectedSeason, series, id]);

  const handleCancelClick = () => {
    setSeries(null);
  };

  const handleWatchEpisodeClick = (episodeNumber) => {
    navigate(`/series/${id}?s=${selectedSeason}&e=${episodeNumber}`);
  };

  const handleSeasonChange = (seasonNumber) => {
    setSelectedSeason(seasonNumber);
    setEpisodes([]);
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  if (error) {
    return <div id="load">Error: {error}</div>;
  }

  if (!series) {
    return <div id="load">Loading...</div>;
  }

  return (
    <div className="movie-card-pop">
      <div className="movie-data-details">
        <div className="card-image">
          <img
            className="cardim"
            src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
            alt={series.name}
          />
        </div>
        <div className="movie-info">
          <div className="cancelbt">
            <button className="cancel" onClick={handleCancelClick}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="movie-ncjks">
            <div className="movie-name">{series.name}</div>
            <div className="movie-description">{series.overview}</div>
            <div className="season-selector">
              <label htmlFor="season">Select Season:</label>
              <select
                id="season"
                value={selectedSeason || ""}
                onChange={(e) => handleSeasonChange(e.target.value)}
              >
                {series.seasons.map((season) => (
                  <option key={season.id} value={season.season_number}>
                    {season.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="episode-list">
              <h3>Episodes</h3>
              {episodes.map((episode) => (
                <div
                  key={episode.id}
                  className="episode-item"
                  onClick={() => handleWatchEpisodeClick(episode.episode_number)}
                >
                  <img
                    className="episode-thumbnail"
                    src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                    alt={episode.name}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150"; // Fallback image
                    }}
                  />
                  <div className="episode-details">
                    <h4>
                      {episode.episode_number}. {episode.name}
                    </h4>
                    <p>{truncateText(episode.overview, 255)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="action-details">
              <button
                className="watchNow"
                onClick={() => console.log("Add/Remove to My List")}
              >
                <i
                  className={`fa-solid ${isInMyList ? "fa-check" : "fa-plus"}`}
                ></i> 
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Seriescard;
