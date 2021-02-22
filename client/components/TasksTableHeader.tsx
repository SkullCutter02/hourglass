import React, { useState } from "react";

import { TasksType } from "../types/TasksType";
import TasksTable from "./TasksTable";
import Filter from "./reusable/Filter";
import { OptionTypeBase } from "react-select";

interface Props {
  tasks: TasksType[];
  text: string;
  color?: string;
}

const TasksTableHeader: React.FC<Props> = ({ tasks, text, color }) => {
  const [selectedOption, setSelectedOption] = useState<OptionTypeBase | null>(null);

  return (
    <React.Fragment>
      <div className="container">
        <span>
          {color && <div className="color" />}
          <h2>{text}</h2>
        </span>
        <Filter selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
      </div>
      <TasksTable tasks={tasks} filterType={selectedOption?.value} />

      <style jsx>{`
        .container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 30px;
          margin-bottom: 20px;
        }

        h2 {
          font-size: 1.2rem;
          color: #454545;
        }

        .color {
          height: 13px;
          width: 13px;
          background: ${color};
          margin-right: 10px;
          border: 1px solid #000;
        }

        span {
          display: flex;
          align-items: center;
        }
      `}</style>
    </React.Fragment>
  );
};

export default TasksTableHeader;
