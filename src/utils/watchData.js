// Utility functions for managing watch data in cookies
// This keeps the app serverless by storing all watch progress locally

// Cookie utility functions
const setCookie = (name, value, days = 365 * 10) => { // 10 years default
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      try {
        return JSON.parse(decodeURIComponent(c.substring(nameEQ.length, c.length)));
      } catch (e) {
        return null;
      }
    }
  }
  return null;
};

// Watch data management
export const WATCH_DATA_KEY = 'watchify_watch_data';

// Get all watch data
export const getWatchData = () => {
  return getCookie(WATCH_DATA_KEY) || {
    movies: {},
    series: {}
  };
};

// Save watch data
export const saveWatchData = (data) => {
  setCookie(WATCH_DATA_KEY, data);
};

// Add or update movie watch progress
export const updateMovieProgress = (movieId, progress) => {
  const watchData = getWatchData();
  watchData.movies[movieId] = {
    ...watchData.movies[movieId],
    ...progress,
    lastWatched: new Date().toISOString(),
    type: 'movie'
  };
  saveWatchData(watchData);
  return watchData.movies[movieId];
};

// Add or update series watch progress
export const updateSeriesProgress = (seriesId, season, episode, progress = {}) => {
  const watchData = getWatchData();
  const seriesKey = `${seriesId}`;
  
  if (!watchData.series[seriesKey]) {
    watchData.series[seriesKey] = {
      id: seriesId,
      type: 'series',
      seasons: {},
      lastWatched: new Date().toISOString()
    };
  }
  
  watchData.series[seriesKey].seasons[season] = {
    ...watchData.series[seriesKey].seasons[season],
    currentEpisode: episode,
    lastWatched: new Date().toISOString()
  };
  
  watchData.series[seriesKey].lastWatched = new Date().toISOString();
  saveWatchData(watchData);
  return watchData.series[seriesKey];
};

// Get movie progress
export const getMovieProgress = (movieId) => {
  const watchData = getWatchData();
  return watchData.movies[movieId] || null;
};

// Get series progress
export const getSeriesProgress = (seriesId) => {
  const watchData = getWatchData();
  return watchData.series[seriesId] || null;
};

// Get continue watching items (both movies and series)
export const getContinueWatchingItems = () => {
  const watchData = getWatchData();
  const items = [];
  
  // Add movies
  Object.values(watchData.movies).forEach(movie => {
    if (movie.lastWatched) {
      items.push({
        ...movie,
        id: Object.keys(watchData.movies).find(key => watchData.movies[key] === movie)
      });
    }
  });
  
  // Add series
  Object.values(watchData.series).forEach(series => {
    if (series.lastWatched) {
      // Find the most recent season/episode
      const seasons = Object.entries(series.seasons);
      if (seasons.length > 0) {
        const latestSeason = seasons.reduce((latest, [season, data]) => {
          return new Date(data.lastWatched) > new Date(latest.lastWatched) 
            ? { season: parseInt(season), ...data } 
            : latest;
        }, { season: 0, lastWatched: '1970-01-01' });
        
        items.push({
          ...series,
          currentSeason: latestSeason.season,
          currentEpisode: latestSeason.currentEpisode
        });
      }
    }
  });
  
  // Sort by last watched date (most recent first)
  return items.sort((a, b) => new Date(b.lastWatched) - new Date(a.lastWatched));
};

// Remove watch progress
export const removeWatchProgress = (id, type) => {
  const watchData = getWatchData();
  if (type === 'movie') {
    delete watchData.movies[id];
  } else if (type === 'series') {
    delete watchData.series[id];
  }
  saveWatchData(watchData);
};

// Clear all watch data
export const clearAllWatchData = () => {
  setCookie(WATCH_DATA_KEY, { movies: {}, series: {} });
};

// Get watch statistics
export const getWatchStats = () => {
  const watchData = getWatchData();
  const movieCount = Object.keys(watchData.movies).length;
  const seriesCount = Object.keys(watchData.series).length;
  
  return {
    totalMovies: movieCount,
    totalSeries: seriesCount,
    totalItems: movieCount + seriesCount
  };
};
