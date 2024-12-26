import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Search from './Search';
import Navbar from './Navbar';

function Topbar({ profile }) {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleProfileClick = () => {
    navigate('/account'); // Navigate to the account page
  };
  const homeNav = () => {
    navigate('/'); // Navigate to the account page
  };
  const profileUrl = profile;

  return (
    <div className='topbar'>
      <div className='my-logo' onClick={homeNav}>Watchify</div>
      <div className='right-stuffs'>
        <Search />
        <div className='user-details'>
          {/* Call handleProfileClick when the image is clicked */}
          <img
            className='userimge'
            src={profileUrl}
            alt='Profile'
            onClick={handleProfileClick}
            style={{ cursor: 'pointer' }} // Add cursor pointer to indicate it's clickable
          />
        </div>
      </div>
      <Navbar/>
    </div>
  );
}

export default Topbar;
