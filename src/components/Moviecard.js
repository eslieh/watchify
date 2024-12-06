import React from "react";

function Card() {
  return (
    <div className="movie-card-pop">
      <div className="movie-data-details">
        <div className="card-image">
          <img
            className="cardim"
            src="https://i.pinimg.com/736x/7d/56/05/7d5605459b5152079e4dab8a948f1197.jpg"
          />
        </div>
        <div className="movie-info">
            <div className="cancelbt">
                <button className="cancel"><i class="fa-solid fa-xmark"></i></button>
            </div>
          <div className="moviencjks">
            <div className="movie-nasme">Hijack</div>
            <div className="moviedata">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>
            <div className="action-details">
              <button className="watchNow">
                Play <i class="fa-solid fa-play"></i>
              </button>
              <button className="watchNow">
                My List <i class="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Card;
