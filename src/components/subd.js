import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Subd({ user }) {
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = user.userId;
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    fetch(`https://fueldash.net/watchify/userdata/subscription_data.php?user_id=${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setSubscriptionDetails(data[0]); // Assuming the user has one subscription
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching subscription details:", error);
        setLoading(false);
      });
  }, [userId]);

  const handleUpgradeClick = () => {
    // Navigate to the subscription upgrade page
    navigate("/subscription");
  };

  const handleCancelClick = () => {
    // Show confirmation dialog
    const confirmCancel = window.confirm("Are you sure you want to cancel your subscription?");
    if (confirmCancel) {
      // Send POST request to cancel the subscription
      fetch("https://fueldash.net/watchify/userdata/cancel_subscription.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert("Your subscription has been canceled.");
            // You can redirect the user or update the state here
          } else {
            alert("Failed to cancel the subscription.");
          }
        })
        .catch((error) => {
          console.error("Error canceling subscription:", error);
          alert("An error occurred. Please try again.");
        });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!subscriptionDetails) {
    return <div>No subscription details found.</div>;
  }

  const { plan_name, pricing, billing_date, next_billing_date } = subscriptionDetails;

  return (
    <div className="subdete">
      <div className="subscription-section">
        <h2>Subscription Details</h2>
        <div className="detailsjnk">
          <span className="sjbhbcdsk">Your Plan</span>
          <p className="jejkjsnk">
            <span className="cndhnchjks">{plan_name}</span> ({pricing})
          </p>
          <p className="dnejknk">Next Billing Date: {next_billing_date}</p>
          <button className="btn cdnjk" onClick={handleUpgradeClick}>
            Upgrade Plan
          </button>
          <button className="btn cd" onClick={handleCancelClick}>
            Cancel Subscription
          </button>
        </div>
      </div>
      <div className="myapp-info">
        <div className="coptuibv">© 2024</div>
        <div className="victor-esli">A Victor Eslieh Production</div>
        <div className="mysocials">
          <a href="https://instagram.com/_eslieh">
            <div className="containerchjdkbk">
              <i className="fa-brands fa-instagram"></i>
            </div>
          </a>
          <a href="https://wa.me/+254780271048">
            <div className="containerchjdkbk">
              <i className="fa-brands fa-whatsapp"></i>
            </div>
          </a>
          <a href="https://twitter.com/_eslieh">
            <div className="containerchjdkbk">
              <i className="fa-brands fa-x-twitter"></i>
            </div>
          </a>
          <a href="https://ke.linkedin.com/in/eslieh-victor-873604319">
            <div className="containerchjdkbk">
              <i className="fa-brands fa-linkedin"></i>
            </div>
          </a>
          <a href="https://snapchat.com/t/UvaVjdoa">
            <div className="containerchjdkbk">
              <i className="fa-brands fa-snapchat"></i>
            </div>
          </a>
        </div>
        <div className="madeviw">
          Made With Love <i className="fa-solid fa-heart"></i>
        </div>
      </div>
    </div>
  );
}

export default Subd;
