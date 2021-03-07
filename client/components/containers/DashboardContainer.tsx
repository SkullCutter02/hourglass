import React from "react";

import ArrowButton from "../reusable/ArrowButton";

const DashboardContainer: React.FC = () => {
  return (
    <React.Fragment>
      <div className="dashboard-container">
        <h1>Welcome to your Dashboard!</h1>
        <div className="arrow-btn-container">
          <ArrowButton
            text={"New Project"}
            buttonColor={"#658aa2"}
            buttonHoverColor={"#526c7c"}
            textColor={"#fff"}
            textSize={11}
            link={"/dashboard/project/create"}
          />
        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
          padding: 40px 50px;
        }

        h1 {
          cursor: initial;
        }

        .arrow-btn-container {
          margin: 40px 0;
        }
      `}</style>
    </React.Fragment>
  );
};

export default DashboardContainer;
