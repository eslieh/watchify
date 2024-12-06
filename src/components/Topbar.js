import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Search from './Search';

function Topbar() {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleProfileClick = () => {
    navigate('/account'); // Navigate to the account page
  };
  const homeNav = () => {
    navigate('/'); // Navigate to the account page
  };

  return (
    <div className='topbar'>
      <div className='my-logo' onClick={homeNav}>Watchify</div>
      <div className='right-stuffs'>
        <Search />
        <div className='user-details'>
          {/* Call handleProfileClick when the image is clicked */}
          <img
            className='userimge'
            src='https://lh3.googleusercontent.com/a/ACg8ocLqd8zB9T5PnAMDbUdKonY5ij7iEMmJQMZpPqn6Q4dDCflZMsqo=s288-c-no'
            alt='Profile'
            onClick={handleProfileClick}
            style={{ cursor: 'pointer' }} // Add cursor pointer to indicate it's clickable
          />
        </div>
      </div>
    </div>
  );
}

export default Topbar;
