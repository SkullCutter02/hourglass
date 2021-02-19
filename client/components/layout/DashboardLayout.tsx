import React from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { useRecoilValue } from "recoil";

import userState from "../../state/userState";
import ArrowButton from "../reusable/ArrowButton";
import logout from "../../utils/logout";

const DashboardLayout: React.FC = ({ children }) => {
  const router = useRouter();
  const user = useRecoilValue(userState);

  const logoutFn = async () => {
    await logout(router);
  };

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
          <div className="main-above">
            <div className="user-info">
              <FontAwesomeIcon icon={faUser} color={"grey"} height={"25px"} />
              <p>{user && user.username}</p>
              <ArrowButton
                text={"Logout"}
                buttonColor={"#8d8d8d"}
                buttonHoverColor={"#696969"}
                textColor={"#fff"}
                textSize={7}
                onClick={logoutFn}
              />
            </div>
          </div>
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

        .user-info {
          float: right;
          height: 100%;
          margin-right: 70px;
          width: 25%;
          min-width: 240px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-info > div {
          display: flex;
          cursor: pointer;
          border: 1px solid red;
        }

        .user-info p {
          margin: 0 10px;
          color: #808080;
          cursor: pointer;
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
