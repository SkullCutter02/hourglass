import React, { useState } from "react";
import { formatDistanceToNow, isPast, parseISO, format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";

import { TasksType } from "../types/TasksType";

interface Props {
  task: TasksType;
}

const Task: React.FC<Props> = ({ task }) => {
  const [expand, setExpand] = useState<boolean>(false);

  return (
    <React.Fragment>
      <div
        className={`tasks-grid tasks-grid-data ${expand ? "expanded-tasks-grid" : ""}`}
        onClick={() => setExpand((prevState) => !prevState)}
      >
        <div className="tasks-grid-item">
          <p>
            <FontAwesomeIcon
              icon={faCaretRight}
              style={{ marginRight: "10px", transition: "transform 0.1s" }}
              rotation={expand ? 90 : null}
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
          </p>
          <p className="actual-date">{format(parseISO(task.dueDate), "MM/dd/yyyy h:mma").toLowerCase()}</p>
        </div>
      </div>

      <style jsx>{`
        .expanded-tasks-grid p {
          white-space: initial;
          word-wrap: initial;
          overflow: initial;
          text-overflow: initial;
        }

        .actual-date {
          margin-top: 10px;
          display: none;
        }

        .expanded-tasks-grid .actual-date {
          display: block;
        }

        @media screen and (max-width: 800px) {
          .tasks-grid-item {
            min-width: 220px;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default Task;
