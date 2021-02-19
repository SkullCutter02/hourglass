import React from "react";

const DashboardLayout: React.FC = ({ children }) => {
  return (
    <React.Fragment>
      <div className="dashboard">
        <aside className="dashboard-aside">
          <div className="aside-above">
            <h2>Hourglass</h2>
          </div>
          <div className="aside-below"></div>
        </aside>
        <main className="dashboard-main">
          <div className="main-above"></div>
          <div className="main-below">{children}</div>
        </main>
      </div>

      <style jsx>{`
        .dashboard {
          display: flex;
          width: 100vw;
          min-height: 100vh;
        }

        .dashboard-main {
          width: 80%;
        }

        .main-above {
          height: 60px;
          box-shadow: 0 5px 5px #acacac;
        }

        .dashboard-aside {
          width: 20%;
          min-width: 180px;
          background: #19202d;
        }

        .aside-above {
          height: 60px;
          background: #1a6ae3;
          position: relative;
          box-shadow: 0 5px 5px #000000;
        }

        .aside-above h2 {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #ececec;
        }
      `}</style>
    </React.Fragment>
  );
};

export default DashboardLayout;
