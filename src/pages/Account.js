import React from "react";
import Topbar from "../components/Topbar";
import Profile from "../components/Profile";
import Subd from "../components/subd";
import Continue from "../components/Continue"
import AcountList from "../components/AcountList"
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
  const handleLogout = () => {
    // Show confirmation dialog before logging out
    const isConfirmed = window.confirm("Are you sure you want to log out?");
    if (isConfirmed) {
      // Clear user data from sessionStorage and localStorage
      sessionStorage.removeItem("user_id");
      sessionStorage.removeItem("profile");
      localStorage.removeItem("user_data");

      // Redirect to the login/auth page
      window.location.href = "/auth";
    }
  };
  return (
    <>
      <Topbar profile={userProfile}/>
      <div className="profile-cdjk">
        <Profile user={userObj} />
        <AcountList user_id={userId}/>
        <Subd user={userObj} />
        <button className="logoutbtn" onClick={handleLogout}><i class="fa-solid fa-right-from-bracket"></i> logout</button>
      </div>
    </>
  );
}
export default Account;
