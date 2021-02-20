import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { isPast, parseISO } from "date-fns";

import { ProjectType } from "../../types/ProjectType";
import { TasksType } from "../../types/TasksType";
import Spinner from "../reusable/Spinner";
import TasksTable from "../TasksTable";
import AddButton from "../reusable/AddButton";
import TasksTableHeader from "../TasksTableHeader";

const IndividualProjectContainer: React.FC = () => {
  const router = useRouter();
  const { uuid } = router.query;

  const fetchProject = async () => {
    if (uuid) {
      const res = await fetch(`/api/projects/${uuid}`);
      return await res.json();
    }
  };

  const { isLoading, isError, error, data } = useQuery<ProjectType, Error>(
    `project_${uuid}`,
    () => fetchProject(),
    {
      cacheTime: 0,
    }
  );

  const groupTasks = (data: ProjectType, calculatePast: boolean): TasksType[] => {
    const categoryTasks = data.categories.map((category) => category.tasks);
    const tasks = [];

    categoryTasks.forEach((categoryTask) => categoryTask.forEach((task) => tasks.push(task)));

    return tasks.filter((task) => {
      if (calculatePast) {
        return isPast(parseISO(task.dueDate));
      } else {
        return !isPast(parseISO(task.dueDate));
      }
    });
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <Spinner size={40} />
      ) : isError ? (
        <p>{error.message}</p>
      ) : data ? (
        <div className="projects-container">
          <div>
            <div className="create-buttons">
              <AddButton text={"Create New Category"} buttonColor={"#3fb820"} buttonHoverColor={"#207a11"} />
              <AddButton text={"Create New Task"} buttonColor={"#25b2c1"} buttonHoverColor={"#137c7c"} />
            </div>
            <TasksTableHeader tasks={groupTasks(data, true)} text={"These tasks are due: "} />
            <TasksTableHeader tasks={groupTasks(data, false)} text={"Your tasks: "} />
          </div>
        </div>
      ) : (
        <Spinner size={40} />
      )}

      <style jsx>{`
        .projects-container > div {
          margin: 30px 60px;
        }

        .create-buttons {
          margin-bottom: 15px;
          display: flex;
          justify-content: flex-end;
        }

        @media screen and (max-width: 600px) {
          .projects-container > div {
            margin: 30px 40px;
          }
        }

        @media screen and (max-width: 400px) {
          .projects-container > div {
            margin: 30px 20px;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default IndividualProjectContainer;
