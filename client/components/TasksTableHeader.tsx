import React, { useState } from "react";

import { TasksType } from "../types/TasksType";
import TasksTable from "./TasksTable";
import Filter from "./reusable/Filter";
import { OptionTypeBase } from "react-select";

interface Props {
  tasks: TasksType[];
  text: string;
}

const TasksTableHeader: React.FC<Props> = ({ tasks, text }) => {
  const [selectedOption, setSelectedOption] = useState<OptionTypeBase | OptionTypeBase[] | null>(null);

  return (
    <React.Fragment>
      <div>
        <h2>{text}</h2>
        <Filter selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
      </div>
      <TasksTable tasks={tasks} />

      <style jsx>{`
        div {
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
      `}</style>
    </React.Fragment>
  );
};

export default TasksTableHeader;
