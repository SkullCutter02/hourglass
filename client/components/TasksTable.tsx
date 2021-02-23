import React, { useState, useEffect } from "react";

import { TasksType } from "../types/TasksType";
import Task from "./Task";

type FilterType = "A-Z" | "Z-A" | "nearest due date" | "furthest due date" | undefined;

interface Props {
  tasks: TasksType[];
  filterType: FilterType;
}

const TasksTable: React.FC<Props> = ({ tasks, filterType }) => {
  const [currentFilter, setCurrentFilter] = useState<FilterType>(filterType);

  useEffect(() => {
    setCurrentFilter(filterType);
  }, [filterType]);

  const filterItems = (tasks: TasksType[]): TasksType[] => {
    if (!currentFilter) {
      return tasks;
    } else if (currentFilter === "A-Z") {
      return tasks.sort((a, b) => a.name.localeCompare(b.name));
    } else if (currentFilter === "Z-A") {
      return tasks.sort((a, b) => b.name.localeCompare(a.name));
    } else if (currentFilter === "nearest due date") {
      return tasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    } else if (currentFilter === "furthest due date") {
      return tasks.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
    }
  };

  return (
    <React.Fragment>
      <div className="tasks-container">
        <div className="tasks-grid topbar">
          <div className="tasks-grid-item">
            <p>Name</p>
          </div>
          <div className="tasks-grid-item">
            <p>Description</p>
          </div>
          <div className="tasks-grid-item">
            <p>Due</p>
          </div>
        </div>
        {filterItems(tasks).map((task) => (
          <Task task={task} key={task.uuid} />
        ))}
      </div>

      <style jsx>{`
        .tasks-container {
          width: 100%;
          overflow: scroll;
          box-shadow: 0 0 3px #808080;
        }

        .topbar {
          background: #d0d0d0;
        }
      `}</style>
    </React.Fragment>
  );
};

export default TasksTable;
