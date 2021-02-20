import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { isPast, parseISO } from "date-fns";

import { ProjectType } from "../../types/ProjectType";
import { TasksType } from "../../types/TasksType";
import Spinner from "../reusable/Spinner";
import TasksTable from "../TasksTable";

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
            <h2>These tasks are due: </h2>
            <TasksTable tasks={groupTasks(data, true)} />
            <h2 className="your-tasks">Your tasks: </h2>
            <TasksTable tasks={groupTasks(data, false)} />
          </div>
        </div>
      ) : (
        <Spinner size={40} />
      )}

      <style jsx>{`
        .projects-container > div {
          margin: 30px 60px;
        }

        h2 {
          font-size: 1.2rem;
          color: #454545;
          margin-top: 10px;
          margin-bottom: 20px;
        }

        .your-tasks {
          margin-top: 40px;
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
