import React, { useEffect } from "react";
import Topbar from "../components/Topbar";
import Barner from "../components/Barner";
import Trending from "../components/Movielists";
function Index() {
  // Function to check if the user is logged in by checking sessionStorage or localStorage


  return (
    <div className="home">  
      <Topbar/>
      <Barner />
      <Trending />
      {/* <Card/> */}
    </div>
  );
}
export default Index;
