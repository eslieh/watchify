import React, { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

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
