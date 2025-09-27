import { useEffect, useState } from 'react';
import { updateMovieProgress, updateSeriesProgress } from '../utils/watchData';

// WatchTracker component that automatically tracks watch progress
// This component should be included in Watch.js and Series.js pages

const WatchTracker = ({ 
  id, 
  type = 'movie', // 'movie' or 'series'
  season = null, 
  episode = null,
  title = null,
  poster = null,
  overview = null
}) => {
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    if (!id) return;

    // Start tracking when component mounts
    const startTracking = () => {
      setIsTracking(true);
      
      // Record the start of watching
      const watchStartTime = new Date().toISOString();
      
      if (type === 'movie') {
        updateMovieProgress(id, {
          id,
          title,
          poster,
          overview,
          watchStartTime,
          status: 'watching'
        });
      } else if (type === 'series' && season && episode) {
        updateSeriesProgress(id, season, episode, {
          id,
          title,
          poster,
          overview,
          watchStartTime,
          status: 'watching'
        });
      }
    };

    // Track periodic updates (every 5 minutes)
    const trackingInterval = setInterval(() => {
      if (isTracking) {
        const currentTime = new Date().toISOString();
        
        if (type === 'movie') {
          updateMovieProgress(id, {
            lastWatched: currentTime,
            status: 'watching'
          });
        } else if (type === 'series' && season && episode) {
          updateSeriesProgress(id, season, episode, {
            lastWatched: currentTime,
            status: 'watching'
          });
        }
      }
    }, 5 * 60 * 1000); // 5 minutes

    startTracking();

    // Cleanup on unmount
    return () => {
      clearInterval(trackingInterval);
      
      // Mark as completed when user leaves
      const endTime = new Date().toISOString();
      
      if (type === 'movie') {
        updateMovieProgress(id, {
          lastWatched: endTime,
          status: 'completed'
        });
      } else if (type === 'series' && season && episode) {
        updateSeriesProgress(id, season, episode, {
          lastWatched: endTime,
          status: 'completed'
        });
      }
    };
  }, [id, type, season, episode, title, poster, overview, isTracking]);

  // This component doesn't render anything visible
  return null;
};

export default WatchTracker;
