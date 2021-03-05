import React, { useEffect, useState } from "react";
import { format, formatDistanceToNow, isPast, parseISO, formatDistance } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight, faPencilAlt, faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import Link from "next/link";
import { useQueryClient } from "react-query";
import linkifyHtml from "linkifyjs/html";
import DOMPurify from "dompurify";

import { TaskType } from "../types/TaskType";

interface Props {
  task: TaskType;
}

const Task: React.FC<Props> = ({ task }) => {
  const [expand, setExpand] = useState<boolean>(false);
  const [canEdit, setCanEdit] = useState<boolean>(false);

  const router = useRouter();
  const { uuid, categoryUuid } = router.query;

  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAccess = async (): Promise<boolean> => {
      const res = await fetch(`/api/users/admin/${uuid}`, {
        credentials: "include",
      });
      return await res.json();
    };

    if (task) {
      if (!task.adminOnly) {
        setCanEdit(true);
      } else {
        checkAccess().then((res) => setCanEdit(res));
      }
    }
  }, [task]);

  const deleteTask = async () => {
    try {
      const res = await fetch(`/api/tasks/${task.uuid}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        if (categoryUuid) {
          await queryClient.prefetchQuery(["category", categoryUuid]);
        } else {
          await queryClient.prefetchQuery(["project", uuid]);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <div className={`tasks-grid ${expand ? "expanded-tasks-grid" : ""}`}>
        <div className="tasks-grid-item">
          <p>
            <FontAwesomeIcon
              icon={faCaretRight}
              rotation={expand ? 90 : null}
              onClick={() => setExpand((prevState) => !prevState)}
              style={{ marginRight: "10px", transition: "transform 0.1s", cursor: "pointer" }}
            />
            {task.name}
          </p>
        </div>
        <div className="tasks-grid-item">
          <p
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                linkifyHtml(task.description, {
                  defaultProtocol: "https",
                  target: { url: "_blank" },
                }),
                { ADD_ATTR: ["target"] }
              ),
            }}
          />
        </div>
        <div className="tasks-grid-item">
          <div className="due-date">
            <p style={{ color: isPast(parseISO(task.dueDate)) ? "#b10909" : "#000000" }}>
              {isPast(parseISO(task.dueDate))
                ? "Due already!"
                : `in ${formatDistanceToNow(parseISO(task.dueDate))}`}
            </p>
            <div className="icons">
              {canEdit && (
                <Link href={`/dashboard/project/${uuid}/edit/${task.uuid}`}>
                  <span className="icon">
                    <FontAwesomeIcon icon={faPencilAlt} color={"grey"} />
                  </span>
                </Link>
              )}
              {canEdit && (
                <span className="icon">
                  <FontAwesomeIcon icon={faCheckDouble} color={"#56dd0f"} onClick={deleteTask} />
                </span>
              )}
            </div>
          </div>
          <p className="hidden">{format(parseISO(task.dueDate), "MM/dd/yyyy h:mma").toLowerCase()}</p>
          <p className="hidden">
            Notify me before:{" "}
            {task.dueDate !== task.notifiedTime
              ? formatDistance(parseISO(task.dueDate), parseISO(task.notifiedTime))
              : "None"}
          </p>
          {task.adminOnly && <p className="hidden">Admin Only</p>}
        </div>
      </div>

      <style jsx>{`
        .expanded-tasks-grid p {
          white-space: initial;
          word-wrap: initial;
          overflow: initial;
          text-overflow: initial;
          margin-right: 10px;
        }

        .hidden {
          margin-top: 10px;
          display: none;
          font-size: 0.9rem;
        }

        .expanded-tasks-grid .hidden {
          display: block;
        }

        .due-date {
          display: flex;
          justify-content: space-between;
          width: 100%;
        }

        .icons {
          margin-right: 10px;
          display: flex;
        }

        .icon {
          margin: 0 5px;
          cursor: pointer;
        }
      `}</style>
    </React.Fragment>
  );
};

export default Task;
