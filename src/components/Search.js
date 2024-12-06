import React, { useState } from "react";
import List from "./List";

function Search() {
  // State to control visibility and store the search term
  const [showResults, setShowResults] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Handle the input change
  const handleSearch = (event) => {
    const input = event.target.value;
    setSearchTerm(input); // Update the search term
    setShowResults(input.length > 0); // Show results if input is not empty
  };

  return (
    <>
      <div className="search-cint">
        <button className="searchbtn">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
        <input
          type="text"
          name="search"
          onChange={handleSearch}
          placeholder="What do you wanna watch?"
        />
      </div>

      {/* Show the search term and results only when there's input */}
      {showResults && (
        <div className="search-wrapper-info">
          <p className="result-texte">Results for "{searchTerm}"</p>
          <List />
        </div>
      )}
    </>
  );
}

export default Search;
