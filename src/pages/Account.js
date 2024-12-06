import React from "react";
import Topbar from "../components/Topbar";
import Profile from "../components/Profile";

function Account(){
    return(
        <>
        <Topbar/>
        <div className="profile-cdjk">
        <Profile/>
        </div>
        </>
    )
}
export default Account