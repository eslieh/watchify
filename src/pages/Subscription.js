import React, { useEffect, useState } from "react";

function Subscription() {
  const [plans, setPlans] = useState([]); // Store the fetched plans
  const [selectedPlan, setSelectedPlan] = useState(null); // Track the selected plan
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal state
  // If user data is not available, redirect to the auth page
  const userId =
    sessionStorage.getItem("user_id") || localStorage.getItem("user_id");
  // Fetch plans from the PHP API
  useEffect(() => {
    if (!userId) {
      window.location.href = "/auth"; // Redirect to the login/auth page
      return;
    }
    fetch("https://fueldash.net/watchify/userdata/plans.php") // Replace with your actual API endpoint
      .then((response) => response.json())
      .then((data) => {
        setPlans(data); // Store the fetched plans
      })
      .catch((error) => {
        console.error("Error fetching plans:", error);
      });
  }, []);

  const openModal = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPlan(null);
    setIsModalOpen(false);
  };

  const handleCheckout = () => {
    if (!selectedPlan) return;
  
    // Get user details from sessionStorage/localStorage
    const userId = sessionStorage.getItem("user_id") || localStorage.getItem("user_id");
    const userName = sessionStorage.getItem("user_name") || localStorage.getItem("user_name");
  
    // Prepare the real data for the API request
    const data = {
      merchant_name: "Watchify", // Use your real merchant name
      merchant_id: "12345", // Use your real merchant ID
      callback_url: "https://watchifyy.vercel.app/subscribe", // Replace with your callback URL
      plan_name: selectedPlan.name, // Dynamic plan name from selectedPlan
      user_id: userId, // Dynamic user ID
      user_name: userName, // Dynamic user name
      amount: selectedPlan.price, // Dynamic price from selectedPlan
      duration: selectedPlan.duration, // Dynamic duration from selectedPlan
    };
  
    fetch("https://fueldash.net/checkouter/api/setup.php", {
      method: "POST", // Define the HTTP method (POST in this case)
      headers: {
        "Content-Type": "application/json", // Tell the server the data is in JSON format
        Authorization: "Bearer your_token_here", // Optionally, add an authorization header if needed
      },
      body: JSON.stringify(data), // Convert the data object to a JSON string and include it in the request body
    })
      .then((response) => response.json()) // Parse the JSON response
      .then((result) => {
        if (result.success) {
          console.log("Record created successfully. Redirecting to:", result.redirect);
          // Optionally, you can redirect to the URL returned from the API
          window.location.href = result.redirect;
        } else {
          console.error("Error:", result.error);
        }
      })
      .catch((error) => {
        console.error("Request failed", error);
      });
  };
  

  // Handle the payment success or failure
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const paymentDetails = {
      planId: params.get("planId"),
      amount: params.get("amount"),
      status: status,
    };

    if (status === "success") {
      console.log("success");
    } else if (status === "failed") {
      // Payment failure: Redirect user to the failure page
      console.log("success");
    }
  });

  return (
    <div className="authContainer">
      <div className="flex-subscription">
        <div className="my-logo">Watchify</div>
        <div className="plans-container">
          {plans.length === 0 ? (
            <p>Loading plans...</p>
          ) : (
            plans.map((plan) => (
              <div key={plan.id} className="plan-card">
                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-price">KES {plan.price}</p>
                <ul className="plan-features">
                  <li>Duration: {plan.duration} days</li>
                </ul>
                <p className="plan-description">{plan.description}</p>
                <button
                  onClick={() => openModal(plan)}
                  className="select-plan-btn"
                >
                  Select Plan
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {isModalOpen && selectedPlan && (
        <div className="modal">
          <div className="modal-content">
            <h3>Checkout</h3>
            <p>
              You have selected the <strong>{selectedPlan.name}</strong> plan.
            </p>
            <p>Price: KES {selectedPlan.price}</p>
            <p>Duration: {selectedPlan.duration} days</p>
            <p>Description: {selectedPlan.description}</p>
            <div className="modal-actions">
              <button onClick={handleCheckout} className="checkout-btn">
                Proceed to Checkout
              </button>
              <button onClick={closeModal} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Subscription;
