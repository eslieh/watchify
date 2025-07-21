import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="nav_barss">
      <div className="linkss jkd">
        <Link to="/" className="icons-home">
          <i className="fa-solid fa-house"></i>
          <span className="navigator">Home</span>
        </Link>
        <Link to="/search" className="icons-home">
          <i className="fa-solid fa-newspaper"></i>
          <span className="navigator">Upcoming</span>
        </Link>
        {/* <Link to="/Account" className="icons-home">
          <img className="downimg" src={profileUrl} />
          <span className="navigator">Me</span>
        </Link> */}
      </div>
    </div>
  );
}

export default Navbar;
