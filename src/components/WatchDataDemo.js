import React, { useState, useEffect } from 'react';
import { 
  getWatchData, 
  clearAllWatchData, 
  getWatchStats,
  updateMovieProgress,
  updateSeriesProgress 
} from '../utils/watchData';

// Demo component to show and manage watch data
// This can be used for testing and debugging the watch data system
function WatchDataDemo() {
  const [watchData, setWatchData] = useState(null);
  const [stats, setStats] = useState(null);

  const loadData = () => {
    const data = getWatchData();
    const watchStats = getWatchStats();
    setWatchData(data);
    setStats(watchStats);
  };

  useEffect(() => {
    loadData();
  }, []);

  const addSampleData = () => {
    // Add sample movie data
    updateMovieProgress(550, {
      title: "Fight Club",
      poster: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      overview: "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
      status: "watching"
    });

    // Add sample series data
    updateSeriesProgress(1399, 1, 3, {
      title: "Breaking Bad",
      poster: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
      overview: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
      status: "watching"
    });

    loadData();
  };

  const clearData = () => {
    clearAllWatchData();
    loadData();
  };

  if (!watchData || !stats) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px', color: 'white', background: '#1f1e1d', minHeight: '100vh' }}>
      <h2>Watch Data Demo</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Statistics</h3>
        <p>Total Movies: {stats.totalMovies}</p>
        <p>Total Series: {stats.totalSeries}</p>
        <p>Total Items: {stats.totalItems}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={addSampleData}
          style={{ 
            padding: '10px 20px', 
            marginRight: '10px', 
            background: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add Sample Data
        </button>
        <button 
          onClick={clearData}
          style={{ 
            padding: '10px 20px', 
            background: '#dc3545', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear All Data
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Movies Data</h3>
        {Object.keys(watchData.movies).length === 0 ? (
          <p>No movies in watch data</p>
        ) : (
          <div>
            {Object.entries(watchData.movies).map(([id, movie]) => (
              <div key={id} style={{ 
                border: '1px solid #333', 
                padding: '10px', 
                margin: '10px 0', 
                borderRadius: '4px',
                background: '#2a2a2a'
              }}>
                <h4>{movie.title}</h4>
                <p>Status: {movie.status}</p>
                <p>Last Watched: {new Date(movie.lastWatched).toLocaleString()}</p>
                {movie.poster && (
                  <img 
                    src={movie.poster} 
                    alt={movie.title}
                    style={{ width: '100px', height: '150px', objectFit: 'cover' }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3>Series Data</h3>
        {Object.keys(watchData.series).length === 0 ? (
          <p>No series in watch data</p>
        ) : (
          <div>
            {Object.entries(watchData.series).map(([id, series]) => (
              <div key={id} style={{ 
                border: '1px solid #333', 
                padding: '10px', 
                margin: '10px 0', 
                borderRadius: '4px',
                background: '#2a2a2a'
              }}>
                <h4>{series.title}</h4>
                <p>Last Watched: {new Date(series.lastWatched).toLocaleString()}</p>
                {series.poster && (
                  <img 
                    src={series.poster} 
                    alt={series.title}
                    style={{ width: '100px', height: '150px', objectFit: 'cover' }}
                  />
                )}
                <div>
                  <h5>Seasons:</h5>
                  {Object.entries(series.seasons).map(([season, data]) => (
                    <div key={season} style={{ marginLeft: '20px' }}>
                      <p>Season {season}: Episode {data.currentEpisode}</p>
                      <p>Last Watched: {new Date(data.lastWatched).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Raw Data (JSON)</h3>
        <pre style={{ 
          background: '#333', 
          padding: '10px', 
          borderRadius: '4px', 
          overflow: 'auto',
          fontSize: '12px'
        }}>
          {JSON.stringify(watchData, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default WatchDataDemo;
