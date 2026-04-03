import React from "react";
import Topbar from "../components/Topbar";
import Barner from "../components/Barner";
import Trending from "../components/Movielists";
function Index() {
  return (
    <div className="home">
      <Topbar />
      <Barner />
      <Trending />
      {/* <Card/> */}
    </div>
  );
}
export default Index;
