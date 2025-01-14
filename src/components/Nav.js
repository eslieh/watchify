import React from 'react';
import { useNavigate } from 'react-router-dom';

function Nav() {
    const navigate = useNavigate();  // Initialize the navigate function

    return (
        <div className='top-navigator'>
            <button 
                className='back-button' 
                onClick={() => navigate('/')}  // Navigate to the Home page
            >
            <i className="fa-solid fa-chevron-left"></i>
            </button>
        </div>
    );
}

export default Nav;
