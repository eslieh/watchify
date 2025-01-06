import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    try {
      const response = await fetch(
        "https://fueldash.net/watchify/auth/login.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }), // Send email and password as JSON
        }
      );

      const result = await response.json();
      console.log(result); // Parse the response as JSON
      if (result.status === "success") {
        setMessage("Login successful!");

        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 1); // Set expiry to one month

        const userData = {
          user_id: result.user_id,
          profile: result.profile,
          expiry: expiryDate.getTime(),
        };

        // Save to both storages
        localStorage.setItem("user_data", JSON.stringify(userData));
        sessionStorage.setItem("user_id", result.user_id);
        sessionStorage.setItem("profile", result.profile);

        // Redirect to homepage
        window.location.href = "./";
      } else {
        setMessage(result.message); // Display the error message
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
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
          onChange={(e) => setEmail(e.target.value)} // Update email state
          required
        />
        <input
          type="password"
          id="login-password"
          name="password"
          className="form-input"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state
          required
        />
        <button type="submit" className="form-button">
          Login
        </button>
      </form>
      {message && <p className="login-message">{message}</p>}{" "}
      {/* Display messages */}
    </div>
  );
}

export default Login;
