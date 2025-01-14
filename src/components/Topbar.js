import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Search from "./Search";
import Navbar from "./Navbar";

function Topbar({ profile }) {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleProfileClick = () => {
    navigate("/account");
  };

  const homeNav = () => {
    navigate("/");
  };
  const [showSearch, setShowSearch] = useState(false);

  const handleShow = () => {
    setShowSearch(true);
  };
  const handleHide = () => {
    setShowSearch(false);
  };
  const profileUrl = profile;

  return (
    <>
      <div className={`topbar ${isScrolled ? "scrolled" : ""}`}>
        <div className="my-logo" onClick={homeNav}>
          Watchify
        </div>
        <div className="right-stuffs">
          <div className="top-icons">
            <i className="fa-solid fa-house" onClick={homeNav}></i>
            <i className="fa-solid fa-newspaper" onClick={homeNav}></i>
          </div>
          <div className="hidden search">
            <Search />
          </div>
          <div className="user-details">
            <img
              className="userimge"
              src={profileUrl}
              alt="Profile"
              onClick={handleProfileClick}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div className="search-button" onClick={handleShow}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
        </div>
      </div>
      {showSearch && (
        <div className="hidden-search" style={{ display: "flex" }}>
          <div className="my-logo" onClick={homeNav}>
            Search
          </div>
          <div className="search-button" onClick={handleHide}>
          <i class="fa-solid fa-x"></i>
          </div>
          <Search />
        </div>
      )}
      <Navbar profileUrl={profileUrl} />
    </>
  );
}

export default Topbar;

/* Add this to your CSS file */
/* Default topbar styling */
