import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

import { CategoryType } from "../../types/CategoryType";
import Spinner from "../reusable/Spinner";
import TasksTableHeader from "../TasksTableHeader";

const IndividualCategoryContainer: React.FC = () => {
  const router = useRouter();
  const { categoryUuid } = router.query;

  const fetchTasks = async () => {
    if (categoryUuid) {
      const res = await fetch(`/api/tasks/category/${categoryUuid}`);
      return await res.json();
    }
  };

  const { isLoading, isError, error, data } = useQuery<CategoryType, Error>(
    `category_${categoryUuid}`,
    () => fetchTasks(),
    {
      cacheTime: 0,
    }
  );

  return (
    <React.Fragment>
      {isLoading ? (
        <Spinner size={40} />
      ) : isError ? (
        <div>{error.message}</div>
      ) : data ? (
        <div className="category-container">
          <TasksTableHeader tasks={data.tasks} text={data.name.toUpperCase()} />
        </div>
      ) : (
        <Spinner size={40} />
      )}

      <style jsx>{`
        .category-container {
          margin: 30px 60px;
        }

        @media screen and (max-width: 600px) {
          .category-container {
            margin: 30px 40px;
          }
        }

        @media screen and (max-width: 400px) {
          .category-container {
            margin: 30px 20px;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default IndividualCategoryContainer;
