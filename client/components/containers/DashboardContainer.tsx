import React from "react";

const DashboardContainer: React.FC = () => {
  return (
    <React.Fragment>
      <div className="dashboard-container">
        <h1>Welcome to your Dashboard!</h1>
      </div>

      <style jsx>{`
        .dashboard-container {
          padding: 30px 50px;
        }
      `}</style>
    </React.Fragment>
  );
};

export default DashboardContainer;
