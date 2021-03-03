import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { OptionTypeBase } from "react-select";
import { parseISO } from "date-fns";

import TaskLayout from "../layout/TaskLayout";
import { TaskCategoryType } from "../../types/TaskCategoryType";
import { CategoryType } from "../../types/CategoryType";
import Spinner from "../reusable/Spinner";

const EditTaskContainer: React.FC = () => {
  const router = useRouter();
  const { uuid, taskUuid } = router.query;

  const errMsgRef = useRef<HTMLParagraphElement>(null);

  const [dueDate, setDueDate] = useState<Date>(null);
  const [category, setCategory] = useState<OptionTypeBase>();
  const [options, setOptions] = useState<{ value: string; label: string }[]>(null);
  const [notifiedTime, setNotifiedTime] = useState<OptionTypeBase>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async (): Promise<CategoryType[]> => {
      const res = await fetch(`/api/categories/${uuid}`);
      return await res.json();
    };

    if (uuid) {
      fetchCategories().then((categories) => {
        const initOptions: { value: string; label: string }[] = [];

        categories.forEach((category) => {
          initOptions.push({ value: category.uuid, label: category.name });
        });

        setOptions(initOptions);
      });
    }
  }, [uuid]);

  const fetchTask = async () => {
    const res = await fetch(`/api/tasks/${taskUuid}`);
    return await res.json();
  };

  const { isLoading, isError, error, data } = useQuery<TaskCategoryType, Error>(
    ["task", taskUuid],
    () => fetchTask(),
    {
      enabled: !!taskUuid,
    }
  );

  useEffect(() => {
    if (data) {
      setDueDate(parseISO(data.dueDate));
      setCategory({ value: data.category.uuid, label: data.category.name });
    }
  }, [data]);

  const editTask = (e) => {
    e.preventDefault();
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <Spinner size={40} />
      ) : isError ? (
        <p>{error.message}</p>
      ) : (
        data && (
          <TaskLayout
            onSubmit={editTask}
            dueDate={dueDate}
            setDueDate={setDueDate}
            category={category}
            setCategory={setCategory}
            isLoading={isLoading}
            notifiedTime={notifiedTime}
            setNotifiedTime={setNotifiedTime}
            errMsgRef={errMsgRef}
            loading={loading}
            options={options}
            buttonText={"Update Task"}
            defaultName={data.name}
            defaultDescription={data.description}
            header={"Update Task"}
          />
        )
      )}
    </React.Fragment>
  );
};

export default EditTaskContainer;
