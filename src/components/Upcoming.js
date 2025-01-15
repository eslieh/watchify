import React, { useEffect, useState ,useRef  } from "react";

const TMDB_API_KEY = "589f8d3ada4c0c32b6db7671025e3162"; // Replace with your TMDb API Key
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const UpcomingMedia = () => {
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [genres, setGenres] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const movieGenresResponse = await fetch(
          `${BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`
        );
        const movieGenresData = await movieGenresResponse.json();
        const tvGenresResponse = await fetch(
          `${BASE_URL}/genre/tv/list?api_key=${TMDB_API_KEY}&language=en-US`
        );
        const tvGenresData = await tvGenresResponse.json();

        const genreMap = {};
        [...movieGenresData.genres, ...tvGenresData.genres].forEach((genre) => {
          genreMap[genre.id] = genre.name;
        });
        setGenres(genreMap);
      } catch (err) {
        setError("Failed to fetch genres.");
        console.error("Error fetching genres:", err);
      }
    };

    const fetchUpcoming = async () => {
      try {
        await fetchGenres();
        const movieResponse = await fetch(
          `${BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=en-US`
        );
        const movieData = await movieResponse.json();

        const tvResponse = await fetch(
          `${BASE_URL}/tv/on_the_air?api_key=${TMDB_API_KEY}&language=en-US`
        );
        const tvData = await tvResponse.json();

        // Sort movies by release date
        const sortedMovies = movieData.results.sort(
          (a, b) => new Date(a.release_date) - new Date(b.release_date)
        );

        // Sort TV shows by first air date
        const sortedTvShows = tvData.results.sort(
          (a, b) => new Date(a.first_air_date) - new Date(b.first_air_date)
        );

        setMovies(sortedMovies);
        setTvShows(sortedTvShows);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch upcoming movies and shows.");
        setLoading(false);
        console.error("Error fetching upcoming content:", err);
      }
    };

    fetchUpcoming();
  }, []);

  const getGenres = (genreIds) => genreIds.map((id) => genres[id]).join(" • ");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "short", day: "numeric" }; // Using 'short' for abbreviated month
    return date.toLocaleDateString("en-US", options).split(" ");
  };  
  const tvDivRef = useRef(null);

  const navigateToDiv = () => {
    console.log("clicked");

    // Ensure the target div is available and scroll to its position
    if (tvDivRef.current) {
      window.scrollTo({
        top: tvDivRef.current.offsetTop,
        behavior: 'smooth'
      });
    }
  };
  if (loading) return <p>Loading upcoming content...</p>;
  if (error) return <p>{error}</p>;
  if (movies.length === 0 && tvShows.length === 0)
    return <p>No upcoming movies or TV shows available.</p>;
  return (
    <div className="upcoming-media">
      <div className="naviou"><h2 className="section-title active">🍿 Upcoming Movies</h2><h2 className="section-title" onClick={navigateToDiv}>📺 Upcoming TV Shows</h2></div>
      <div className="media-list">
        {movies.map((movie) => {
          const [month, day] = formatDate(movie.release_date);
          return (
            <div key={movie.id} className="media-item">
              <div className="media-release ">
                <span className="release-day">{day}</span>
                <span className="release-month">{month}</span>
              </div>
              <div className="contents">
                <img
                  src={IMAGE_BASE_URL + movie.backdrop_path}
                  alt={movie.title}
                  className="media-poster"
                />
                <p className="media-title ">{movie.title}</p>
                <p className="media-genres ">
                    {getGenres(movie.genre_ids)}
                </p>
                <p className="media-overview ">{movie.overview}</p>
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="section-title" >📺 Upcoming TV Shows</h2>
      <div className="media-list" ref={tvDivRef} id="tv">
        {tvShows.map((show) => {
          const [month, day] = formatDate(show.first_air_date);
          return (
            <div key={show.id} className="media-item ">
              <div className="media-release ">
                <span className="release-day">{day}</span>
                <span className="release-month">{month}</span>
              </div>
              <div className="contents">
                <img
                  src={IMAGE_BASE_URL + show.backdrop_path}
                  alt={show.name}
                  className="media-poster tvshow-poster"
                />
                <p className="media-title ">{show.name}</p>
                <p className="media-genres ">{getGenres(show.genre_ids)}
                </p>
                <p className="media-overview ">{show.overview}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingMedia;
