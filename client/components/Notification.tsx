import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { useQuery } from "react-query";

import { InviteType } from "../types/InviteType";
import Spinner from "./reusable/Spinner";

const Notification: React.FC = () => {
  const popupRef = useRef<HTMLDivElement>(null);

  const fetchUserInvites = async () => {
    const res = await fetch(`/api/projects/members/invite`);
    return await res.json();
  };

  const { isLoading, isError, error, data } = useQuery<InviteType, Error>(
    "userInvites",
    () => fetchUserInvites(),
    {
      cacheTime: 0,
    }
  );

  const togglePopup = (blur: boolean) => {
    if (popupRef.current.style.display === "none" && !blur) {
      popupRef.current.style.display = "block";
    } else {
      popupRef.current.style.display = "none";
    }
  };

  return (
    <React.Fragment>
      <div
        className="bell-container"
        onClick={() => togglePopup(false)}
        onBlur={() => togglePopup(true)}
        tabIndex={0}
      >
        <FontAwesomeIcon icon={faBell} color={"grey"} height={"40px"} />
        {isLoading ? null : isError ? (
          <p>{error.message}</p>
        ) : data?.projectRequests.length > 0 ? (
          <div className="icon" />
        ) : null}
        <div className="popup" ref={popupRef} style={{ display: "none" }}>
          {isLoading ? (
            <Spinner size={10} />
          ) : isError ? (
            <p>{error.message}</p>
          ) : (
            <React.Fragment>
              {data?.projectRequests.map((projectRequest) => (
                <div className="request-container" key={projectRequest.uuid}>
                  <p>You are invited to join the project: {projectRequest.project.name}</p>
                  <span>
                    <p>Accept</p>
                    <p>Decline</p>
                  </span>
                </div>
              ))}
            </React.Fragment>
          )}
        </div>
      </div>

      <style jsx>{`
        .bell-container {
          position: relative;
          cursor: pointer;
        }

        .icon {
          position: absolute;
          width: 10px;
          height: 10px;
          background: #ff0000;
          border-radius: 50%;
          top: 0;
          right: -2px;
        }

        .popup {
          position: absolute;
          top: 2em;
          left: 0;
          background: #fff;
          box-shadow: 0 0 4px #aeaeae;
          max-height: 230px;
          overflow: scroll;
          width: calc(100% + 120px);
          padding: 10px 15px;
          cursor: initial;
          min-height: 50px;
        }

        .popup p {
          font-size: 0.7rem;
          word-wrap: break-word;
        }

        .request-container {
          padding: 5px 0;
        }

        .request-container > span {
          display: flex;
          justify-content: space-between;
          margin-top: 5px;
        }

        .request-container > span > p {
          text-decoration: underline;
          cursor: pointer;
        }

        .request-container > span > p:nth-child(1) {
          color: #07ac07;
        }

        .request-container > span > p:nth-child(1):hover {
          color: #098d09;
        }

        .request-container > span > p:nth-child(2) {
          color: #c8180a;
        }

        .request-container > span > p:nth-child(2):hover {
          color: #770808;
        }
      `}</style>
    </React.Fragment>
  );
};

export default Notification;
