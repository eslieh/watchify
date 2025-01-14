import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  // Handle login
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "https://fueldash.net/watchify/auth/login.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const result = await response.json();
      console.log(result);

      if (result.status === "success") {
        setMessage("Login successful!");

        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 1);

        const userData = {
          user_id: result.user_id,
          profile: result.profile,
          expiry: expiryDate.getTime(),
        };

        localStorage.setItem("user_data", JSON.stringify(userData));
        sessionStorage.setItem("user_id", result.user_id);
        sessionStorage.setItem("profile", result.profile);

        window.location.href = "./";
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      console.error("Error:", error);
    }
  };

  // Handle forgot password
  const handleForgotPassword = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "https://fueldash.net/watchify/auth/forgot-password.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: resetEmail }),
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        setResetMessage("Password reset link sent! Check your email.");
      } else {
        setResetMessage(result.message);
      }
    } catch (error) {
      setResetMessage("An error occurred. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="login">
      <h2 className="login-title">Login</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="email"
          id="login-email"
          name="email"
          className="form-input"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          id="login-password"
          name="password"
          className="form-input"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="form-button">
          Login
        </button>
      </form>

      {message && <p className="login-message">{message}</p>}

      <p className="forgot-password" onClick={() => setShowForgotPassword(true)}>
        Forgot Password?
      </p>

      {showForgotPassword && (
       <div className="forgert-modl">
         <div className="forgot-password-modal">
          <h3>Reset Password</h3>
          <form onSubmit={handleForgotPassword}>
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              className="form-input"
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
            <button type="submit" className="form-button">Send Reset Link</button>
            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="cancel-button"
            >
              Cancel
            </button>
          </form>
          {resetMessage && <p>{resetMessage}</p>}
        </div>
       </div>
      )}
    </div>
  );
}

export default Login;
