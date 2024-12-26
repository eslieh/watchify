import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="nav_bar">
      <div className="links jkd">
        <Link to="/" className="icon-home">
          <i className="fa-solid fa-house"></i>
        </Link>
        <Link to="/search" className="icon-home">
          <i className="fa-solid fa-magnifying-glass"></i>
        </Link>
        <Link to="/Activity" className="icon-home">
          <i className="fa-solid fa-chart-simple"></i>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
