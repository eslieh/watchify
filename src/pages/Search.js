import React, { useState, useEffect }  from "react";
import Topbar from "../components/Topbar";
import Upcoming from "../components/Upcoming";
function Search(){
    const userId =
    sessionStorage.getItem("user_id") || localStorage.getItem("user_id");
  const userProfile =
    sessionStorage.getItem("profile") || localStorage.getItem("profile");

  useEffect(() => {
    // If user data is not available, redirect to the auth page
    if (!userId || !userProfile) {
      window.location.href = "/auth"; // Redirect to the login/auth page
      return;
    }})
    return(
      <>
        <Topbar profile={userProfile} />
        <Upcoming/>
      </>
    )
}
export default Search;