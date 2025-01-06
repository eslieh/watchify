import React, { useEffect } from "react";

const AutoSignIn = () => {
  useEffect(() => {
    const storedUser = localStorage.getItem("user_id");

    if (storedUser) {
      // Copy data from localStorage to sessionStorage
      sessionStorage.setItem("user_id", storedUser);
      sessionStorage.setItem("profile", localStorage.getItem("profile"));

      // Redirect to home or desired route
      window.location.href = "/";
    }
  }, []);

  return null; // No UI needed
};

export default AutoSignIn;
