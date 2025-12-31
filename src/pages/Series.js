import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import WatchTracker from "../components/WatchTracker";
import "./watch.css"; // keep your styles (rename if you split movie vs series later)

function Series() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [seriesData, setSeriesData] = useState(null);
  const [currentSeasonEpisodes, setCurrentSeasonEpisodes] = useState([]);
  const [nextSeries, setNextSeries] = useState(null);
  const [isLastEpisode, setIsLastEpisode] = useState(false);
  
  console.log(seriesData);
  // Parse ?s= & ?e= & ?title= from query string; default to season 1, episode 1
  const urlParams = new URLSearchParams(location.search);
  const season = urlParams.get("s") || "1";
  const episode = urlParams.get("e") || "1";
  const seriesTitle = urlParams.get("title") || "";

  // Fetch series details and related data
  useEffect(() => {
    if (!id) return;

    const fetchSeriesDetails = async () => {
      const API_KEY = "589f8d3ada4c0c32b6db7671025e3162";
      const BASE_URL = `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=en-US`;

      try {
        const response = await fetch(BASE_URL);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setSeriesData({
            id: data.id,
            title: data.name,
            poster: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : null,
            overview: data.overview,
            seasons: data.seasons || []
          });
        }
      } catch (error) {
        console.error("Error fetching series details:", error);
      }
    };

    fetchSeriesDetails();
  }, [id]);

  // Fetch current season episodes
  useEffect(() => {
    if (!id || !season) return;

    const fetchCurrentSeasonEpisodes = async () => {
      const API_KEY = "589f8d3ada4c0c32b6db7671025e3162";
      const SEASON_URL = `https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${API_KEY}&language=en-US`;

      try {
        const response = await fetch(SEASON_URL);
        if (response.ok) {
          const data = await response.json();
          setCurrentSeasonEpisodes(data.episodes || []);
        }
      } catch (error) {
        console.error("Error fetching season episodes:", error);
      }
    };

    fetchCurrentSeasonEpisodes();
  }, [id, season]);

  // Fetch similar series for next series recommendation
  useEffect(() => {
    if (!id) return;

    const fetchSimilarSeries = async () => {
      const API_KEY = "589f8d3ada4c0c32b6db7671025e3162";
      const SIMILAR_URL = `https://api.themoviedb.org/3/tv/${id}/similar?api_key=${API_KEY}&language=en-US&page=1`;

      try {
        const response = await fetch(SIMILAR_URL);
        if (response.ok) {
          const data = await response.json();
          // Get the first similar series that has episodes
          const availableSeries = data.results?.find(series => 
            series.vote_count > 0 && series.poster_path
          );
          if (availableSeries) {
            setNextSeries({
              id: availableSeries.id,
              title: availableSeries.name,
              poster: availableSeries.poster_path ? `https://image.tmdb.org/t/p/w500${availableSeries.poster_path}` : null,
              overview: availableSeries.overview
            });
          }
        }
      } catch (error) {
        console.error("Error fetching similar series:", error);
      }
    };

    fetchSimilarSeries();
  }, [id]);

  // Check if current episode is the last episode of the entire series
  useEffect(() => {
    if (currentSeasonEpisodes.length > 0 && seriesData?.seasons) {
      const currentEpisodeNum = parseInt(episode, 10);
      const currentSeasonNum = parseInt(season, 10);
      const lastEpisodeNum = currentSeasonEpisodes.length;
      
      // Check if we're at the last episode of the last season
      const isLastEpisodeOfSeason = currentEpisodeNum >= lastEpisodeNum;
      const isLastSeason = currentSeasonNum >= seriesData.seasons.length;
      
      setIsLastEpisode(isLastEpisodeOfSeason && isLastSeason);
    }
  }, [currentSeasonEpisodes, episode, season, seriesData]);

  // Simple navigation helpers (no bounds checking; purely client-side)
  const goToEpisode = (s, e) => {
    const titleParam = seriesTitle ? `&title=${seriesTitle}` : '';
    navigate(`/series/${id}?s=${s}&e=${e}${titleParam}`);
  };

  const handlePrev = () => {
    const currentE = parseInt(episode, 10);
    if (currentE > 1) {
      goToEpisode(season, currentE - 1);
    }
    // If you want to roll back to previous season when ep===1, add logic here.
  };

  const handleNext = () => {
    const currentE = parseInt(episode, 10);
    const currentS = parseInt(season, 10);
    
    // Check if we're at the last episode of the current season
    if (currentSeasonEpisodes.length > 0 && currentE >= currentSeasonEpisodes.length) {
      // Check if there's a next season available
      if (seriesData?.seasons && currentS < seriesData.seasons.length) {
        // Go to first episode of next season
        goToEpisode(currentS + 1, 1);
      } else {
        // No more episodes/seasons, do nothing (next series button will handle this)
        return;
      }
    } else {
      // Go to next episode in current season
      goToEpisode(season, currentE + 1);
    }
  };

  const goBack = () => {
    navigate("/");
  };

  const handleNextSeries = () => {
    if (nextSeries) {
      const seriesTitle = encodeURIComponent(nextSeries.title);
      navigate(`/series/${nextSeries.id}?s=1&e=1&title=${seriesTitle}`);
    }
  };

  if (!id) {
    return (
      <>
        <Nav />
        <div className="watch-container">No series ID provided.</div>
      </>
    );
  }

  return (
    <>
      {/* <Nav /> */}
      <div className="watch-container">
        <iframe
          id="watchdiv"
          className="player"
          src={`https://multiembed.mov/?video_id=${id}&tmdb=1&s=${season}&e=${episode}`}
          title={`Series Player S${season}E${episode}`}
          allowFullScreen
        />
        <div className="navigation-buttons">
          <div className="navigation-buttons-inner">
            <button className="navbtns" onClick={() => goBack()}><i className="fa-solid fa-arrow-left"></i></button>
          </div>
          <div className="navigation-buttons-inner">
            <button
              className="navbtns"
              onClick={handlePrev}
              disabled={parseInt(episode, 10) <= 1}
            >
              <i className="fa-solid fa-chevron-left" />
            </button>
            <span className="movie_data_details">
              <span className="movie_data_details_title">
                {seriesTitle ? decodeURIComponent(seriesTitle) : seriesData?.title || "Series"}
              </span> - s{season}, e {episode}
            </span>
            <button className="navbtns" onClick={handleNext}>
              <i className="fa-solid fa-chevron-right" />
            </button>
          </div>
          {/* Next Series Button - only show if it's the last episode and next series is available */}
          {isLastEpisode && nextSeries && (
            <div className="navigation-buttons-inner">
              <button 
                className="navbtns next-series-btn" 
                onClick={handleNextSeries}
                title={`Next: ${nextSeries.title}`}
              >
                <i className="fa-solid fa-forward"></i>
                <span className="next-series-text">Next: {nextSeries.title.length > 15 ? nextSeries.title.substring(0, 15) + '...' : nextSeries.title}</span>
              </button>
            </div>
          )}
        </div>
        {/* Watch tracker for series */}
        {seriesData && (
          <WatchTracker
            id={seriesData.id}
            type="series"
            season={parseInt(season)}
            episode={parseInt(episode)}
            title={seriesData.title}
            poster={seriesData.poster}
            overview={seriesData.overview}
          />
        )}
      </div>
    </>
  );
}

export default Series;
