import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { isPast, parseISO } from "date-fns";

import { ProjectType } from "../../types/ProjectType";
import { TasksType } from "../../types/TasksType";
import Spinner from "../reusable/Spinner";
import AddButton from "../reusable/AddButton";
import TasksTableHeader from "../TasksTableHeader";
import ViewMembers from "../ViewMembers";

const IndividualProjectContainer: React.FC = () => {
  const router = useRouter();
  const { uuid } = router.query;

  const fetchProject = async () => {
    const res = await fetch(`/api/projects/${uuid}`);
    return await res.json();
  };

  const { isLoading, isError, error, data } = useQuery<ProjectType, Error>(
    ["project", uuid],
    () => fetchProject(),
    {
      enabled: !!uuid,
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

  async function createTask() {
    if (data.categories.length === 0) {
      alert("You need to create a category first in order to create a task");
    } else {
      await router.push(`/dashboard/project/${data.uuid}/create/task`);
    }
  }

  return (
    <React.Fragment>
      {isLoading ? (
        <Spinner size={40} />
      ) : isError ? (
        <p>{error.message}</p>
      ) : data ? (
        <div className="projects-container">
          <div>
            <div className="project-info">
              <h1>{data.name}</h1>
              <div>
                <ViewMembers project={data} />
                <AddButton
                  text={"Create New Category"}
                  buttonColor={"#3fb820"}
                  buttonHoverColor={"#207a11"}
                  link={`/dashboard/project/${data.uuid}/create/category`}
                />
                <AddButton
                  text={"Create New Task"}
                  buttonColor={"#25b2c1"}
                  buttonHoverColor={"#137c7c"}
                  onClick={() => createTask()}
                />
              </div>
            </div>
            {data.description && <p className="description">{data.description}</p>}
            <TasksTableHeader tasks={groupTasks(data, true)} text={"These tasks are due: "} />
            <TasksTableHeader tasks={groupTasks(data, false)} text={"Upcoming tasks: "} />
          </div>
        </div>
      ) : (
        <Spinner size={40} />
      )}

      <style jsx>{`
        .projects-container > div {
          padding: 30px 50px;
        }

        .description {
          margin-top: 5px;
          font-size: 0.9rem;
        }

        .project-info {
          margin-bottom: 15px;
          display: flex;
          justify-content: space-between;
        }

        .project-info > div {
          width: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }

        @media screen and (max-width: 900px) {
          .project-info {
            flex-direction: column;
          }

          .project-info > div {
            margin-top: 20px;
            justify-content: flex-start;
          }
        }

        @media screen and (max-width: 500px) {
          .projects-container > div {
            padding: 30px;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default IndividualProjectContainer;
