import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { useQuery, useQueryClient } from "react-query";

import { InviteType } from "../types/InviteType";
import Spinner from "./reusable/Spinner";

const Notification: React.FC = () => {
  const popupRef = useRef<HTMLDivElement>(null);
  const errMsgRef = useRef<HTMLParagraphElement>(null);

  const queryClient = useQueryClient();

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

  const accept = async (uuid: string) => {
    const res = await fetch(`/api/projects/members/accept/${uuid}`, {
      method: "POST",
    });
    const data = await res.json();

    if (!res.ok) {
      if (data.msg) {
        errMsgRef.current.textContent = data.msg;
      } else {
        errMsgRef.current.textContent = "Something went wrong";
      }
    } else {
      errMsgRef.current.textContent = "";
      await queryClient.prefetchQuery("userInvites");
      await queryClient.prefetchQuery("userProjects");
    }
  };

  const decline = (uuid: string) => {};

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
                    <p onClick={() => accept(projectRequest.uuid)}>Accept</p>
                    <p onClick={() => decline(projectRequest.uuid)}>Decline</p>
                  </span>
                  <p className="err-msg" ref={errMsgRef} style={{ marginTop: "5px" }} />
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
          opacity: 95%;
        }

        .popup p {
          font-size: 0.7rem;
          word-wrap: break-word;
          line-height: 1.3em;
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
