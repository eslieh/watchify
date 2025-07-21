import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import "./watch.css"; // keep your styles (rename if you split movie vs series later)

function Series() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Parse ?s= & ?e= from query string; default to season 1, episode 1
  const urlParams = new URLSearchParams(location.search);
  const season = urlParams.get("s") || "1";
  const episode = urlParams.get("e") || "1";

  // Simple navigation helpers (no bounds checking; purely client-side)
  const goToEpisode = (s, e) => {
    navigate(`/series/${id}?s=${s}&e=${e}`);
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
    goToEpisode(season, currentE + 1);
    // Add season rollover logic later if desired.
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
      <Nav />
      <div className="watch-container">
        <iframe
          id="watchdiv"
          className="player"
          src={`https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`}
          title={`Series Player S${season}E${episode}`}
          allowFullScreen
        />
        <div className="navigation-buttons">
          <button
            className="navbtns"
            onClick={handlePrev}
            disabled={parseInt(episode, 10) <= 1}
          >
            <i className="fa-solid fa-chevron-left" />
          </button>
          <button className="navbtns" onClick={handleNext}>
            <i className="fa-solid fa-chevron-right" />
          </button>
        </div>
      </div>
    </>
  );
}

export default Series;
