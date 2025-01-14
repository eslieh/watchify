import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import './watch.css'
function Tv() {
  const { id } = useParams(); 
  const [series, setSeries] = useState(null);
  const [error, setError] = useState(null);
  const [isInMyList, setIsInMyList] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const navigate = useNavigate();

  const userId = sessionStorage.getItem("user_id") || localStorage.getItem("user_id");
  const userProfile = sessionStorage.getItem("profile") || localStorage.getItem("profile");

  useEffect(() => {
    if (!userId || !userProfile) {
      navigate("/auth");
    }
  }, [userId, userProfile, navigate]);

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

  const formatRuntime = (runtime) => {
    if (!runtime) return "Runtime not available";
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const link = `https://wa.me/?text=Watch this https://watchifyy.vercel.app/tv/${id}?s=1&e=1`;

  if (error) {
    return <div id="load">Error: {error}</div>;
  }

  if (!series) {
    return <div id="load">Loading...</div>;
  }

  return (
    <>
      <Nav />
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
            <div className="movie-ncjks">
              <div className="movie-name">{series.name}</div>
              <div className="movie-description">{series.overview}</div>
              <div className="action-details">
                <button className="watchNow">
                  Play <i className="fa-solid fa-play"></i>
                </button>
                <a href={link}>
                  <button className="watchNow" title={"Share"}>
                    <i className="fa-solid fa-arrow-up-from-bracket"></i> Share
                  </button>
                </a>
              </div>
              <div className="season-selector">
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
                    <div className="flex-details-conta">
                      <img
                        className="episode-thumbnail"
                        src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                        alt={episode.name}
                      />
                      <div className="episode-details">
                        <h4 className="episode-label">
                          {episode.episode_number}. {episode.name}
                        </h4>
                        <p className="episode_runtime">
                          {formatRuntime(episode.runtime)}
                        </p>
                      </div>
                    </div>
                    <p className="details-of-episode">{truncateText(episode.overview, 255)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Tv;
