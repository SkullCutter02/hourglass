import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { useQuery } from "react-query";
import Link from "next/link";

import userState from "../../state/userState";
import Spinner from "../reusable/Spinner";
import ArrowButton from "../reusable/ArrowButton";
import AsideProject from "../AsideProject";
import logout from "../../utils/logout";
import Notification from "../Notification";
import { UserProjectsType } from "../../types/UserProjectsType";

const DashboardLayout: React.FC = ({ children }) => {
  const router = useRouter();
  const user = useRecoilValue(userState);

  const [openHamburger, setOpenHamburger] = useState(true);

  const hamburgerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const fetchUserProjects = async () => {
    const res = await fetch("/api/users/projects", {
      credentials: "include",
    });
    return await res.json();
  };

  const { isLoading, isError, error, data } = useQuery<UserProjectsType, Error>(
    "userProjects",
    () => fetchUserProjects(),
    {
      cacheTime: 0,
    }
  );

  const logoutFn = async () => {
    await logout(router);
  };

  const toggleHamburger = () => {
    setOpenHamburger((prevState) => !prevState);
    console.log(openHamburger);

    if (openHamburger) {
      hamburgerRef.current.classList.add("active-hamburger");
      sidebarRef.current.style.transform = "scaleX(1)";
    } else {
      hamburgerRef.current.classList.remove("active-hamburger");
      sidebarRef.current.style.transform = "scaleX(0)";
    }
  };

  return (
    <React.Fragment>
      <div className="dashboard">
        <div className="hamburger" onClick={toggleHamburger} ref={hamburgerRef}>
          <span />
          <span />
          <span />
        </div>
        <aside className="dashboard-aside" ref={sidebarRef}>
          <div className="aside-above">
            <Link href={"/"}>
              <h2>Hourglass</h2>
            </Link>
          </div>
          <div className="aside-below">
            {isLoading ? (
              <Spinner size={20} />
            ) : isError ? (
              <p>Error: {error.message}</p>
            ) : user ? (
              <div className="projects">
                <div style={{ marginBottom: "30px" }}>
                  <ArrowButton
                    text={"Create new Project"}
                    buttonColor={"#658aa2"}
                    buttonHoverColor={"#526c7c"}
                    textColor={"#fff"}
                    textSize={8}
                  />
                </div>
                <Link href={"/dashboard"}>
                  <h2 style={{ cursor: "pointer", marginBottom: "20px" }}>DASHBOARD</h2>
                </Link>
                <h2>PROJECTS: </h2>
                <ul>
                  {data.projectMembers.map((projectMember) => (
                    <AsideProject projectMember={projectMember} key={projectMember.uuid} />
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </aside>
        <main className="dashboard-main">
          <div className="main-above">
            <div className="user-info">
              <Notification />
              <p>{user?.username}</p>
              <ArrowButton
                text={"Logout"}
                buttonColor={"#8d8d8d"}
                buttonHoverColor={"#696969"}
                textColor={"#fff"}
                textSize={8}
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
          width: 85%;
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

        .user-info p {
          margin: 0 10px;
          color: #808080;
          cursor: pointer;
        }

        .dashboard-aside {
          width: 15%;
          min-width: 210px;
          background: #19202d;
        }

        .aside-above {
          height: 60px;
          background: #1a6ae3;
          position: relative;
          box-shadow: -5px 5px 5px #000000;
        }

        .aside-above h2 {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #ececec;
          cursor: pointer;
        }

        .aside-below {
          position: relative;
          height: calc(100% - 60px);
        }

        .projects {
          height: 100%;
          padding: 25px;
        }

        .projects h2 {
          color: #686f86;
          font-size: 0.9rem;
        }

        .projects > ul {
          margin: 10px 5px;
        }

        .hamburger {
          cursor: pointer;
          z-index: 100;
          position: absolute;
          top: 17px;
          left: 10px;
          display: none;
        }

        .hamburger span {
          display: block;
          margin: 4px;
          height: 3px;
          width: 22px;
          background: #000000;
          border-radius: 9px;
        }

        .active-hamburger span:nth-child(1) {
          transform: translate(0, 7px) rotate(135deg);
        }

        .active-hamburger span:nth-child(2) {
          opacity: 0;
        }

        .active-hamburger span:nth-child(3) {
          transform: translate(0, -7px) rotate(-135deg);
        }

        @media screen and (max-width: 800px) {
          .dashboard-main {
            width: 100%;
          }

          .dashboard-aside {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            height: 100vh;
            overflow: scroll;
            transform: scaleX(0);
            transform-origin: 0 50%;
            transition: all 0.2s;
          }

          .hamburger {
            display: block;
          }
        }

        @media screen and (max-width: 450px) {
          .user-info {
            margin-right: 10px;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default DashboardLayout;
