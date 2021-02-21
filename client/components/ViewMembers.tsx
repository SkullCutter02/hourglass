import React, { useRef, useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useQueryClient } from "react-query";

import { ProjectType } from "../types/ProjectType";
import userState from "../state/userState";

interface Props {
  project: ProjectType;
}

const ViewMembers: React.FC<Props> = ({ project }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const popupRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const errMsgRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const user = useRecoilValue(userState);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (project && user) {
      setIsAdmin(
        project.projectMembers.some(
          (projectMember) => projectMember.user.uuid === user.uuid && projectMember.role === "admin"
        )
      );
    }
  }, [project]);

  const togglePopup = (blur: boolean) => {
    if (popupRef.current.style.display === "none" && !blur) {
      popupRef.current.style.display = "block";
    } else {
      popupRef.current.style.display = "none";
      formRef.current.style.display = "none";
    }
  };

  const toggleForm = () => {
    if (formRef.current.style.display === "none") {
      formRef.current.style.display = "block";
    } else {
      formRef.current.style.display = "none";
    }
  };

  const sendInvite = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/projects/members/invite/${inputRef.current.value}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectUuid: project.uuid,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.msg) {
          errMsgRef.current.textContent = data.msg;
        }
      } else {
        inputRef.current.value = "";
        errMsgRef.current.textContent = "";
        successRef.current.textContent = "Invite Sent!";

        setTimeout(() => {
          successRef.current.textContent = "";
        }, 2000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const kickMember = async (uuid: string) => {
    const confirm = window.confirm("Are you sure you want to kick this user out of this project?");

    if (confirm) {
      const res = await fetch(`/api/projects/members/kick/${uuid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectUuid: project.uuid,
        }),
      });

      if (res.ok) {
        await queryClient.prefetchQuery(`project_${project.uuid}`);
      }
    }
  };

  return (
    <React.Fragment>
      <div className="container">
        <button
          className="view-members-main-btn"
          onClick={() => togglePopup(false)}
          onBlur={() => togglePopup(true)}
          tabIndex={0}
        >
          Members
        </button>
        <div className="popup" style={{ display: "none" }} ref={popupRef}>
          {project.projectMembers.map((projectMember) => (
            <div className="project-user-info" key={projectMember.user.uuid}>
              <p>{projectMember.user.username}</p>
              <div className="project-user-actions">
                {projectMember.role === "admin" ? (
                  <p style={{ color: "#808080" }}>(admin)</p>
                ) : isAdmin ? (
                  <p className="kick" onClick={() => kickMember(projectMember.user.uuid)}>
                    kick
                  </p>
                ) : null}
              </div>
            </div>
          ))}
          <div className="project-user-info" style={{ display: isAdmin ? "flex" : "none" }}>
            <p className="invite" onClick={toggleForm}>
              Invite Member
            </p>
          </div>
          <form
            className="project-user-info send-invite-form"
            ref={formRef}
            style={{ display: "none" }}
            onSubmit={sendInvite}
          >
            <input
              type="text"
              className="user-input"
              placeholder="Username of the user: "
              ref={inputRef}
              required
            />
            <div className="err-msg" ref={errMsgRef} style={{ marginTop: "5px", fontSize: "0.7rem" }} />
            <div className="success" ref={successRef} />
            <button type={"submit"}>Send invite</button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .container {
          position: relative;
          max-width: fit-content;
        }

        .view-members-main-btn {
          border: none;
          border-radius: 20px;
          background: #8d8d8d;
          color: white;
          padding: 8px 12px;
          transition: background 0.3s ease;
        }

        .view-members-main-btn:hover {
          background: #6b6b6b;
        }

        .popup {
          width: calc(100% + 100px);
          position: absolute;
          top: 3em;
          left: 0;
          padding: 5px 15px;
          background: #fff;
          box-shadow: 0 0 4px #aeaeae;
          cursor: initial;
          max-height: 320px;
          overflow: scroll;
          opacity: 95%;
        }

        .popup p {
          font-size: 0.8rem;
        }

        .popup > .project-user-info > p {
          width: 50%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-wrap: break-word;
          color: #808080;
        }

        .project-user-info {
          display: flex;
          padding: 7px 5px;
          width: 100%;
          align-items: center;
        }

        .project-user-actions {
          width: 50%;
          margin-left: 10px;
        }

        .kick {
          cursor: pointer;
          text-decoration: underline;
          color: #c30808;
        }

        .invite {
          width: 100% !important;
          text-decoration: underline;
          cursor: pointer;
        }

        .invite:hover {
          color: #676767 !important;
        }

        .user-input {
          width: 100%;
        }

        .send-invite-form input {
          text-indent: 5px;
        }

        .send-invite-form button {
          border: none;
          padding: 3px 9px;
          background: #ffffff;
          color: #000000;
          border-radius: 10px;
          margin-top: 10px;
          box-shadow: 0 0 3px #8d8d8d;
        }
      `}</style>
    </React.Fragment>
  );
};

export default ViewMembers;
