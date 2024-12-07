import React, { useState } from "react";

function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState(null); // Track the selected plan
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal state

  const plans = [
    { name: "Mini", price: "$5/month", features: ["Feature 1", "Feature 2"] },
    { name: "Basic", price: "$10/month", features: ["Feature 1", "Feature 2", "Feature 3"] },
    { name: "Standard", price: "$10/month", features: ["Feature 1", "Feature 2", "Feature 3"] },
    { name: "Premium", price: "$15/month", features: ["All Features"] },
  ];

  const openModal = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPlan(null);
    setIsModalOpen(false);
  };

  const handleCheckout = () => {
    // Add checkout logic here
    alert(`Checking out for ${selectedPlan.name} plan!`);
    closeModal();
  };

  return (
    <div className="authContainer">
      <div className="flex-subscription">
        <div className="my-logo">Watchify</div>
        <div className="plans-container">
          {plans.map((plan) => (
            <div key={plan.name} className="plan-card">
              <h3 className="plan-name">{plan.name}</h3>
              <p className="plan-price">{plan.price}</p>
              <ul className="plan-features">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <button onClick={() => openModal(plan)} className="select-plan-btn">
                Select Plan
              </button>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Checkout</h3>
            <p>You have selected the <strong>{selectedPlan.name}</strong> plan.</p>
            <p>Price: {selectedPlan.price}</p>
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
