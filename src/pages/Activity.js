import React, { useEffect } from "react";
import Topbar from "../components/Topbar";
import MyList from "../components/Mylist";
function Activity() {
  const userId =
    sessionStorage.getItem("user_id") || localStorage.getItem("user_id");
  const userProfile =
    sessionStorage.getItem("profile") || localStorage.getItem("profile");

  useEffect(() => {
    if (!userId || !userProfile) {
      window.location.href = "/auth";
      return;
    }
  }, [userId, userProfile]);

  return (
    <>
      <Topbar profile={userProfile} />
      <MyList user_id={userId} />
    </>
  );
}
export default Activity;
