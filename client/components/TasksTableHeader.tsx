import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import { OptionTypeBase } from "react-select";

import { TaskType } from "../types/TaskType";
import TasksTable from "./TasksTable";
import Filter from "./reusable/Filter";
import { useOutsideClick } from "../utils/hooks/useOutsideClick";

interface Props {
  tasks: TaskType[];
  text: string;
  color?: string;
  editable?: boolean;
}

const TasksTableHeader: React.FC<Props> = ({ tasks, text, color, editable = false }) => {
  const [selectedOption, setSelectedOption] = useState<OptionTypeBase | null>(null);
  const [editNameMode, setEditNameMode] = useState<boolean>(true);

  const router = useRouter();
  const { uuid, categoryUuid } = router.query;

  const queryClient = useQueryClient();

  const changeNameRef = useRef<HTMLHeadingElement>(null);

  useOutsideClick(async () => {
    if (editNameMode && changeNameRef.current && editable) {
      if (/\S/.test(changeNameRef.current.textContent) && changeNameRef.current.textContent.trim() !== text) {
        try {
          const res = await fetch(`/api/categories/${categoryUuid}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: changeNameRef.current.textContent.trim().toLowerCase(),
              projectUuid: uuid,
            }),
          });

          if (res.ok) {
            await queryClient.prefetchQuery(["category", categoryUuid]);
            await queryClient.prefetchQuery("userProjects");
          }
        } catch (err) {
          console.log(err);
        }
      }
    }

    setEditNameMode(false);
  }, changeNameRef);

  return (
    <React.Fragment>
      <div className="container">
        <span>
          {color && <div className="color" />}
          {!editNameMode ? (
            <h2
              onClick={() => {
                if (!editNameMode) {
                  setEditNameMode(true);
                }
              }}
            >
              {text}
            </h2>
          ) : (
            <h2 ref={changeNameRef} contentEditable={editable} suppressContentEditableWarning>
              {text}
            </h2>
          )}
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
