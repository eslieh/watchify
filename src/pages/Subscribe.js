import React, { useEffect, useState } from "react";

function Subscribe() {
  const [isLoading, setIsLoading] = useState(true); // To show loading indicator
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // For showing success message
  useEffect(() => {
    // Get the query parameters from the URL
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const planId = params.get("plan_id");
    const userId = params.get("user_id");

    if (status === "200") {
      // Call the API to process the subscription
      fetch("https://fueldash.net/watchify/userdata/subscribe.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "user_id": userId,"plan_id": planId }),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.success) {
            // Show success popup to user
            setShowSuccessPopup(true);
            // Redirect after 5 seconds
            setTimeout(() => {
              window.location.href="./account"; // Redirect to /account after success
            }, 5000);
          } else {
            console.error("Subscription failed:", result.error);
            setIsLoading(false); // Stop loading in case of failure
          }
        })
        .catch((error) => {
          console.error("Error processing subscription:", error);
          setIsLoading(false); // Stop loading in case of error
        });
    } else {
      // If status is not 200, something went wrong, stop loading
      setIsLoading(false);
    }
  }, []); // Empty dependency array to run once on page load

  return (
    <div className="authContainer">
      <div className="flex-subscription">
        <div className="my-logo">Watchify</div>

        {isLoading ? (
          <div className="progress-container">
            <p>Handling subscription, please wait...</p>
            {/* You can replace this with a more sophisticated progress bar or spinner */}
            <div className="progress-bar">
              <div className="progress"></div>
            </div>
          </div>
        ) : (
          // If loading is false and subscription is handled, show success popup
          showSuccessPopup && (
            <div className="success-popup">
              <p>You've successfully subscribed to the selected package!</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Subscribe;
