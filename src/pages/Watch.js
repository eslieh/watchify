import React from "react";
import { useParams } from "react-router-dom";
import Nav from "../components/Nav";
import "./watch.css";

function Watch() {
  const { id } = useParams(); // movie ID from route

  if (!id) {
    return (
      <>
        <Nav />
        <div className="watch-container">No video ID provided.</div>
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
          src={`https://www.2embed.cc/embed/${id}`}
          title="Video Stream"
          allowFullScreen
        />
      </div>
    </>
  );
}

export default Watch;
