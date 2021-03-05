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
  isSourceCategory?: boolean;
}

const TasksTableHeader: React.FC<Props> = ({
  tasks,
  text,
  color,
  editable = false,
  isSourceCategory = false,
}) => {
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

  const removeCategory = async () => {
    const confirm = window.confirm("Are you sure you want to delete this category?");

    if (confirm) {
      try {
        const res = await fetch(`/api/categories/${categoryUuid}`, {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectUuid: uuid,
          }),
        });

        if (res.ok) {
          await queryClient.prefetchQuery("userProjects");
          await router.push(`/dashboard/project/${uuid}`);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

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
        <span>
          <Filter selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
          {isSourceCategory && (
            <button className="remove-category-btn" onClick={removeCategory}>
              Remove Category
            </button>
          )}
        </span>
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

        .remove-category-btn {
          border: none;
          border-radius: 20px;
          background: #949494;
          color: #ffffff;
          padding: 8px 12px;
          transition: background 0.3s ease;
          margin-left: 40px;
        }

        .remove-category-btn:hover {
          background: #7a7a7a;
        }

        @media screen and (max-width: 600px) {
          .container {
            flex-direction: column;
            align-items: flex-start;
          }

          span {
            margin-top: 20px;
            width: 100%;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default TasksTableHeader;
