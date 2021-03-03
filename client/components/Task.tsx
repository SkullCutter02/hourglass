import React, { useEffect, useState } from "react";
import { format, formatDistanceToNow, isPast, parseISO } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import Link from "next/link";

import { TaskType } from "../types/TaskType";

interface Props {
  task: TaskType;
}

const Task: React.FC<Props> = ({ task }) => {
  const [expand, setExpand] = useState<boolean>(false);
  const [canEdit, setCanEdit] = useState<boolean>(false);

  const router = useRouter();
  const { uuid } = router.query;

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
          <p>{task.description}</p>
        </div>
        <div className="tasks-grid-item">
          <p style={{ color: isPast(parseISO(task.dueDate)) ? "#b10909" : "#000000" }}>
            {isPast(parseISO(task.dueDate))
              ? "Due already!"
              : `in ${formatDistanceToNow(parseISO(task.dueDate))}`}
            {canEdit && (
              <Link href={`/dashboard/project/${uuid}/edit/${task.uuid}`}>
                <FontAwesomeIcon
                  icon={faPencilAlt}
                  color={"grey"}
                  style={{ marginLeft: "20px", cursor: "pointer" }}
                />
              </Link>
            )}
          </p>
          <p className="hidden">{format(parseISO(task.dueDate), "MM/dd/yyyy h:mma").toLowerCase()}</p>
          <p className="hidden">Notify me before: {formatDistanceToNow(parseISO(task.notifiedTime))}</p>
          {task.adminOnly && <p className="hidden">Admin Only</p>}
        </div>
      </div>

      <style jsx>{`
        .expanded-tasks-grid p {
          white-space: initial;
          word-wrap: initial;
          overflow: initial;
          text-overflow: initial;
        }

        .hidden {
          margin-top: 10px;
          display: none;
          font-size: 0.9rem;
        }

        .expanded-tasks-grid .hidden {
          display: block;
        }
      `}</style>
    </React.Fragment>
  );
};

export default Task;
