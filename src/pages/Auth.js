import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login";
import Signup from "../components/Signup";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for user authentication data in localStorage
    const userData = localStorage.getItem("user_data");

    if (userData) {
      const parsedData = JSON.parse(userData);

      // Check if the data has expired
      if (parsedData.expiry > Date.now()) {
        sessionStorage.setItem("user_id", parsedData.user_id);
        sessionStorage.setItem("profile", parsedData.profile);
        // Redirect to homepage if valid
        navigate("/");
      } else {
        // Remove expired data
        localStorage.removeItem("user_data");
      }
    }
  }, [navigate]);

  const toggleAuth = () => {
    setIsLogin((prevState) => !prevState);
  };

  return (
    <div className="authContainer">
      <div className="center-contents">
        <div className="my-logo">Watchify</div>
        <div className="action_s">
          {isLogin ? <Login /> : <Signup />}
          <button onClick={toggleAuth} className="toggle-btn">
            {isLogin ? "Switch to Signup" : "Switch to Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
