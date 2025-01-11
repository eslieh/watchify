import React, { useEffect } from "react";
import Topbar from "../components/Topbar";
import Barner from "../components/Barner";
import Trending from "../components/Movielists";
import Cookies from "js-cookie"; // Import js-cookie for cookie management
import Card from "../components/Moviecard";
import Continue from "../components/Continue";
import "./show.css"
function Index() {
  // Function to check if the user is logged in by checking sessionStorage or localStorage
  const userId =
    sessionStorage.getItem("user_id") || localStorage.getItem("user_id");
  const userProfile =
    sessionStorage.getItem("profile") || localStorage.getItem("profile");

  // If user data is not available, redirect to the auth page
  if (!userId || !userProfile) {
    window.location.href = "/auth"; // Redirect to the login/auth page
  }
  console.log(userProfile);

  return (
    <div className="home">
      <Topbar profile={userProfile}/>
      <Barner />
      <Continue />
      <Trending />
      {/* <Card/> */}
    </div>
  );
}
export default Index;
