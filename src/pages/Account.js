import React from "react";
import Topbar from "../components/Topbar";
import Profile from "../components/Profile";
import Subd from "../components/subd";
function Account() {
  const userId =
    sessionStorage.getItem("user_id") || localStorage.getItem("user_id");
  const userProfile =
    sessionStorage.getItem("profile") || localStorage.getItem("profile");

  // If user data is not available, redirect to the auth page
  if (!userId || !userProfile) {
    window.location.href = "/auth"; // Redirect to the login/auth page
  }
  const userObj = {
    "userId": userId,
    "profile": userProfile 
  }
  return (
    <>
      <Topbar profile={userProfile}/>
      <div className="profile-cdjk">
        <Profile user={userObj} />
        <Subd user={userObj} />
      </div>
    </>
  );
}
export default Account;
