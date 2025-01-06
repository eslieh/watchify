import React, { useState } from "react";

function Signup() {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (event) => {
    event.preventDefault();
    console.log("Password:", password); // Log password here
  
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
  
    try {
      const response = await fetch("https://fueldash.net/watchify/auth/signup.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }), // Send user data as JSON
      });
  
      const result = await response.json();
      if (result.status === "success") {
        setMessage("Reqistration successful!");
      
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
      }
      else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };
  

  return (
    <div className="signup">
      <h2 className="signup-title">Signup</h2>
      <form className="login-form" onSubmit={handleSignup}>
        <input
          type="text"
          id="signup-name"
          name="name"
          className="form-input"
          placeholder="Full Name"
          value={username}
          onChange={(e) => setName(e.target.value)} // Update name state
          required
        />
        <input
          type="email"
          id="signup-email"
          name="email"
          className="form-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update email state
          required
        />
        <input
          type="password"
          id="signup-password"
          name="password"
          className="form-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state
          required
        />
        <input
          type="password"
          id="signup-confirm-password"
          name="confirmPassword"
          className="form-input"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)} // Update confirmPassword state
          required
        />
        <button type="submit" className="form-button">Signup</button>
      </form>
      {message && <p className="signup-message">{message}</p>} {/* Display messages */}
    </div>
  );
}

export default Signup;
