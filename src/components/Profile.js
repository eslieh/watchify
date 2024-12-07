import React, { useState, useEffect } from "react";

function Profile({ user }) {
  const [username, setUsername] = useState("");
  const userId = user.userId; // Correct the typo from useId to userId
  const profile = user.profile;

  // Fetch the username when the component mounts
  useEffect(() => {
    fetch(`http://localhost/watchify/userdata/username.php?user_id=${userId}`, {
      method: "GET", // Assuming the API is a GET request
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setUsername(data.username); // Assuming the API returns the username in data.username
        } else {
          setUsername("Unknown User"); // Fallback if username is not available
        }
      })
      .catch((error) => {
        console.error("Error fetching username:", error);
        setUsername("Error fetching username");
      });
  }, [userId]); // Run the effect when userId changes

  return (
    <div className="profile_container">
      <div className="flex-info">
        <div className="profile-pic">
          <img src={profile} alt="Profile" className="profilecd" />
        </div>
        <div className="flex-user-data">
          <span className="usernamejk">{username}</span> {/* Display the fetched username */}
        </div>
      </div>
    </div>
  );
}

export default Profile;
