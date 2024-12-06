import React from "react";

function Barner() {
  return (
    <div className="barners">
      <img
        className="barner-imamge"
        src="https://images.pexels.com/photos/3767825/pexels-photo-3767825.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      ></img>
      <div className="movie-details">
        <div className="movie-data">
            <div className="movie-name">Stranger Things</div>
            <div className="movie-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
            <div className="action-btns">
                <button className="watchBtn" id='watch'>Watch Movie</button>
                <button className="Morein" id='watch'>More Info <i class="fa-solid fa-arrow-right"></i></button>
            </div>
        </div>
      </div>
    </div>
  );
}
export default Barner;
