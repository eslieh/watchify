import React, { useEffect } from 'react';
import Topbar from '../components/Topbar';
import Barner from '../components/Barner'
import Trending from '../components/Movielists';
import Cookies from 'js-cookie'; // Import js-cookie for cookie management
import Card from '../components/Moviecard';
function Index() {
//   useEffect(() => {
//     // Check if the "username" cookie is set
//     const username = Cookies.get('username'); // You can replace 'username' with the actual cookie name you are using
//     console.log(username);
//     if (!username) {
//       // If no cookie is set, redirect to the /auth page
//       window.location.href = "/auth";
//     }
//   }, []); // Empty dependency array ensures this runs only once after the component mounts

  return (
    <div className='home'>
        <Topbar/>
        <Barner/>
        <Trending/>
        {/* <Card/> */}
    </div>
  );
}
export default Index;