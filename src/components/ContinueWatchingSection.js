import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getContinueWatchingItems, removeWatchProgress } from "../utils/watchData";

// A dedicated continue watching section for the home page
// Shows a horizontal scrollable list of continue watching items
function ContinueWatchingSection({ maxItems = 10 }) {
  const navigate = useNavigate();
  const [continueItems, setContinueItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [thumbnails, setThumbnails] = useState({});

  // Function to fetch movie or series thumbnail from TMDb API
  const fetchMovieThumbnail = async (itemId, isSeries = false) => {
    const tmdbApiKey = "589f8d3ada4c0c32b6db7671025e3162";
    const tmdbApiUrl = `https://api.themoviedb.org/3/${isSeries ? "tv" : "movie"}/${itemId}?api_key=${tmdbApiKey}&language=en-US`;

    try {
      const response = await fetch(tmdbApiUrl);
      const data = await response.json();
      
      if (data.poster_path) {
        const thumbnailUrl = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
        setThumbnails((prevThumbnails) => ({
          ...prevThumbnails,
          [itemId]: thumbnailUrl,
        }));
      }
    } catch (error) {
      console.error(`Error fetching thumbnail for ${isSeries ? "series" : "movie"} with ID: ${itemId}`, error);
    }
  };

  // Load continue watching items from cookies
  useEffect(() => {
    try {
      const items = getContinueWatchingItems().slice(0, maxItems);
      setContinueItems(items);
      
      // Fetch thumbnails for items that don't have them
      items.forEach((item) => {
        if (!item.poster) {
          fetchMovieThumbnail(item.id, item.type === 'series');
        }
      });
      
      setLoading(false);
    } catch (error) {
      console.error("Error loading continue watching items:", error);
      setLoading(false);
    }
  }, [maxItems]);

  // Handle click on a continue watching item
  const handleItemClick = (item) => {
    if (item.type === 'series') {
      const seriesTitle = item.title ? encodeURIComponent(item.title) : '';
      const titleParam = seriesTitle ? `&title=${seriesTitle}` : '';
      navigate(`/series/${item.id}?s=${item.currentSeason}&e=${item.currentEpisode}${titleParam}`);
    } else {
      const movieTitle = item.title ? encodeURIComponent(item.title) : '';
      const titleParam = movieTitle ? `?title=${movieTitle}` : '';
      navigate(`/watch/${item.id}${titleParam}`);
    }
  };

  // Handle removing an item from continue watching
  const handleRemoveItem = (item, e) => {
    e.stopPropagation();
    removeWatchProgress(item.id, item.type);
    setContinueItems(prev => prev.filter(i => i.id !== item.id));
  };

  // If loading, show skeleton
  if (loading) {
    return (
      <div className="continue-watching-section">
        <h2 className="section-title">Continue Watching</h2>
        <div className="continue-items-container">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="continue-item-skeleton">
              <div className="skeleton-poster"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // If no items to continue watching, don't show the section
  if (continueItems.length === 0) {
    return null;
  }

  return (
    <div className="continue-watching-section">
      <h2 className="section-title">Continue Watching</h2>
      <div className="continue-items-container">
        {continueItems.map((item) => (
          <div
            key={`${item.type}-${item.id}`}
            className="continue-item"
            onClick={() => handleItemClick(item)}
          >
            <div className="continue-poster">
              <img
                src={
                  item.poster || thumbnails[item.id] || "/placeholder-poster.png"
                }
                alt={item.title || `${item.type} ${item.id}`}
                className="continue-poster-img"
              />
              <div className="continue-overlay">
                <button 
                  className="remove-btn"
                  onClick={(e) => handleRemoveItem(item, e)}
                  title="Remove from continue watching"
                >
                  <i className="fa-solid fa-times"></i>
                </button>
                <div className="play-btn">
                  <i className="fa-solid fa-play"></i>
                </div>
                {item.type === 'series' && (
                  <div className="episode-info">
                    S{item.currentSeason}E{item.currentEpisode}
                  </div>
                )}
              </div>
            </div>
            <div className="continue-info">
              <h3 className="continue-title">
                {item.title || `${item.type} ${item.id}`}
              </h3>
              {item.type === 'series' && (
                <p className="continue-episode">
                  Season {item.currentSeason}, Episode {item.currentEpisode}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContinueWatchingSection;
