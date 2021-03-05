import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { OptionTypeBase } from "react-select";
import { parseISO } from "date-fns";
import { subMilliseconds } from "date-fns";

import TaskLayout from "../layout/TaskLayout";
import { TaskType } from "../../types/TaskType";
import { CategoryType } from "../../types/CategoryType";
import Spinner from "../reusable/Spinner";
import { requestPermission } from "../../utils/requestPermission";
import { urlBase64ToUint8Array } from "../../utils/urlBase64ToUInt8Array";

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

  const { isLoading, isError, error, data } = useQuery<TaskType, Error>(
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

  const editTask = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (!dueDate) {
        errMsgRef.current.textContent = "Due date field cannot be empty";
        setLoading(false);
        return;
      }

      if (!("Notification" in window) && notifiedTime?.value !== 0) {
        errMsgRef.current.textContent =
          "Notifications are not supported in your browser. The notify me feature will not work";
        setLoading(false);
        return;
      }

      if (!("serviceWorker" in navigator) && notifiedTime?.value !== 0) {
        errMsgRef.current.textContent =
          "Service workers are not supported in your browser. The notify me feature will not work";
        setLoading(false);
        return;
      }

      const permission = notifiedTime?.value !== 0 ? await requestPermission() : false;

      let register: ServiceWorkerRegistration;
      let subscription: PushSubscription;

      if (permission) {
        register = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        subscription = await register.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_KEY),
        });
      } else if (notifiedTime?.value !== 0) {
        errMsgRef.current.textContent = "You have denied notifications. The notify me feature will not work";
        setLoading(false);
        return;
      }

      errMsgRef.current.textContent = "";

      const res = await fetch(`/api/tasks/${taskUuid}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: e.target.name.value,
          description: e.target.description.value,
          dueDate: dueDate,
          notifiedTime: notifiedTime !== null ? subMilliseconds(dueDate, notifiedTime.value) : null,
          adminOnly: e.target.adminOnly.checked,
          categoryUuid: category.value,
          subscription: permission && notifiedTime?.value !== 0 ? subscription : null,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.msg) {
          errMsgRef.current.textContent = data.msg;
        } else {
          errMsgRef.current.textContent = "Something went wrong. Please try again or reload the page";
        }

        setLoading(false);
      } else {
        await router.push(`/dashboard/project/${uuid}`);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      errMsgRef.current.textContent = "Something went wrong. Please try again or reload the page";
      setLoading(false);
    }
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
            selectPlaceholder={"Reschedule notification"}
          />
        )
      )}
    </React.Fragment>
  );
};

export default EditTaskContainer;
