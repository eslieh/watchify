import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Seriescard({ id }) {
  const [series, setSeries] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // --- Fetch base series info ---
  useEffect(() => {
    if (!id) return;

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

        // Default to first available season that has episodes (skip specials if you want—see note below)
        if (data.seasons && data.seasons.length > 0) {
          const firstRegularSeason =
            data.seasons.find((s) => s.season_number > 0 && s.episode_count > 0) ||
            data.seasons[0];
          setSelectedSeason(firstRegularSeason.season_number);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching series details:", err);
      }
    };

    fetchSeriesDetails();
  }, [id]);

  // --- Fetch episodes for currently selected season ---
  useEffect(() => {
    if (!id || selectedSeason == null) return;

    const fetchSeasonEpisodes = async () => {
      const API_KEY = "589f8d3ada4c0c32b6db7671025e3162";
      const SEASON_URL = `https://api.themoviedb.org/3/tv/${id}/season/${selectedSeason}?api_key=${API_KEY}&language=en-US`;

      try {
        const response = await fetch(SEASON_URL);
        if (!response.ok) {
          throw new Error(`TMDb API Error: ${response.statusText}`);
        }
        const data = await response.json();
        setEpisodes(data.episodes || []);
      } catch (err) {
        console.error("Error fetching season episodes:", err);
      }
    };

    fetchSeasonEpisodes();
  }, [id, selectedSeason]);

  // --- UI Handlers ---
  const handleCancelClick = () => {
    setSeries(null); // hides card; caller can also unmount
  };

  const handleWatchEpisodeClick = (episodeNumber) => {
    navigate(`/series/${id}?s=${selectedSeason}&e=${episodeNumber}`);
  };

  const handlePlayClick = () => {
    // Play first episode of currently selected season
    const firstEpisode =
      episodes && episodes.length > 0 ? episodes[0].episode_number : 1;
    handleWatchEpisodeClick(firstEpisode);
  };

  const handleSeasonChange = (seasonNumberStr) => {
    const seasonNumber = parseInt(seasonNumberStr, 10);
    setSelectedSeason(seasonNumber);
    setEpisodes([]);
  };

  // --- Helpers ---
  const truncateText = (text = "", maxLength = 255) =>
    text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  const formatRuntime = (runtime) => {
    if (!runtime && runtime !== 0) return "";
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  if (error) return <div id="load">Error: {error}</div>;
  if (!series) return <div id="load">Loading...</div>;

  // Choose a share link; using /series/ to match navigation
  const shareLink = `https://wa.me/?text=Watch this https://watchifyy.vercel.app/series/${id}?s=1&e=1`;

  return (
    <div className="movie-card-pop">
      <div className="movie-data-details">
        <div className="card-image">
          <img
            className="cardim"
            src={
              series.poster_path
                ? `https://image.tmdb.org/t/p/w500${series.poster_path}`
                : "/placeholder-poster.png"
            }
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

            <div className="action-details">
              <button className="watchNow" onClick={handlePlayClick}>
                Play <i className="fa-solid fa-play"></i>
              </button>
              <a href={shareLink} target="_blank" rel="noopener noreferrer">
                <button className="watchNow" title="Share">
                  <i className="fa-solid fa-arrow-up-from-bracket"></i> Share
                </button>
              </a>
            </div>

            {series.seasons?.length > 0 && (
              <div className="season-selector">
                <select
                  id="season"
                  value={selectedSeason ?? ""}
                  onChange={(e) => handleSeasonChange(e.target.value)}
                >
                  {series.seasons.map((season) => (
                    <option key={season.id} value={season.season_number}>
                      {season.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

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
                      src={
                        episode.still_path
                          ? `https://image.tmdb.org/t/p/w500${episode.still_path}`
                          : "/placeholder-still.png"
                      }
                      alt={episode.name}
                    />
                    <div className="episode-details">
                      <h4 className="episode-label">
                        {episode.episode_number}. {episode.name}
                      </h4>
                      {episode.runtime ? (
                        <p className="episode_runtime">
                          {formatRuntime(episode.runtime)}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <p className="details-of-episode">
                    {truncateText(episode.overview, 255)}
                  </p>
                </div>
              ))}
              {episodes.length === 0 && (
                <p className="no-episodes">No episodes found for this season.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Seriescard;
