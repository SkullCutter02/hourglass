import React from "react";
import { formatDistanceToNow, parseISO, isPast } from "date-fns";

import { TasksType } from "../types/TasksType";

interface Props {
  tasks: TasksType[];
}

const TasksTable: React.FC<Props> = ({ tasks }) => {
  return (
    <React.Fragment>
      <div className="tasks-container">
        <div className="tasks-grid">
          <div className="tasks-grid-item topbar">
            <p>Name</p>
          </div>
          <div className="tasks-grid-item topbar">
            <p>Description</p>
          </div>
          <div className="tasks-grid-item topbar">
            <p>Due</p>
          </div>
        </div>
        {tasks.map((task) => (
          <div className="tasks-grid" key={task.uuid}>
            <div className="tasks-grid-item name">
              <p>{task.name}</p>
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
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .tasks-container {
          width: 100%;
          overflow: scroll;
          box-shadow: 0 0 3px #808080;
        }

        .tasks-grid {
          height: 40px;
          display: grid;
          grid-template-columns: 2fr 4fr 2fr;
          border-bottom: 0.1px solid #d6d6d6;
        }

        .topbar {
          background: #d0d0d0;
        }

        .name {
          cursor: pointer;
        }

        .tasks-grid-item {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          min-width: 160px;
        }

        .tasks-grid-item > p {
          margin-left: 20px;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          word-wrap: break-word;
          text-overflow: ellipsis;
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

export default TasksTable;
