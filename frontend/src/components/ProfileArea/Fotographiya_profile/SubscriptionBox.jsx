import React from "react";

const SubscriptionBox = () => {
  return (
    <div className="profile-subscription-box">
      <p>
        <strong>Subscription</strong>
      </p>
      <p>
        Free
        <br />
        Active - Monthly
      </p>
      <button
        style={{ marginTop: "10px" }}
        className="secondarySmallButton"
        type="button"
      >
        Upgrade
      </button>
    </div>
  );
};

export default SubscriptionBox;
