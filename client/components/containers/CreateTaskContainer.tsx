import React, { useState, useEffect, useRef } from "react";
import { OptionTypeBase } from "react-select";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { subMilliseconds } from "date-fns";

import { CategoryType } from "../../types/CategoryType";
import { urlBase64ToUint8Array } from "../../utils/urlBase64ToUInt8Array";
import TaskLayout from "../layout/TaskLayout";
import { requestPermission } from "../../utils/requestPermission";

const CreateTaskContainer: React.FC = () => {
  const router = useRouter();
  const { uuid } = router.query;

  const errMsgRef = useRef<HTMLParagraphElement>(null);

  const [dueDate, setDueDate] = useState<Date>(null);
  const [category, setCategory] = useState<OptionTypeBase>(null);
  const [options, setOptions] = useState<{ value: string; label: string }[]>(null);
  const [notifiedTime, setNotifiedTime] = useState<OptionTypeBase>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasDueDate, setHasDueDate] = useState<boolean>(true);

  const fetchCategories = async () => {
    const res = await fetch(`/api/categories/${uuid}`);
    return await res.json();
  };

  const { isLoading, data } = useQuery<CategoryType[], Error>(
    ["projectCategories", uuid],
    () => fetchCategories(),
    {
      enabled: !!uuid,
    }
  );

  useEffect(() => {
    if (data !== undefined) {
      const initOptions: { value: string; label: string }[] = [];

      data.forEach((category) => {
        initOptions.push({ value: category.uuid, label: category.name });
      });

      setOptions(initOptions);
    }
  }, [data]);

  const createTask = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (!(category && notifiedTime && dueDate)) {
        if (!hasDueDate && !category) {
          errMsgRef.current.textContent = "Category field cannot be empty";
          setLoading(false);
          return;
        }

        if (!(category && notifiedTime && dueDate) && hasDueDate) {
          errMsgRef.current.textContent = "Due date, category or notified time fields cannot be empty";
          setLoading(false);
          return;
        }
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
      } else if (notifiedTime?.value !== 0 && notifiedTime !== null) {
        errMsgRef.current.textContent = "You have denied notifications. The notify me feature will not work";
        setLoading(false);
        return;
      }

      errMsgRef.current.textContent = "";

      const res = await fetch(`/api/tasks/${uuid}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: e.target.name.value,
          description: e.target.description.value,
          dueDate: hasDueDate ? dueDate : new Date(Date.now()),
          notifiedTime: hasDueDate ? subMilliseconds(dueDate, notifiedTime?.value) : new Date(Date.now()),
          adminOnly: e.target.adminOnly.checked,
          categoryUuid: category.value,
          subscription: permission && notifiedTime?.value !== 0 && hasDueDate ? subscription : null,
          noDueDate: !hasDueDate,
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
    <TaskLayout
      onSubmit={createTask}
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
      buttonText={"Create Task"}
      header={"Create new Task"}
      selectPlaceholder={"Notify me before"}
      hasDueDate={hasDueDate}
      setHasDueDate={setHasDueDate}
    />
  );
};

export default CreateTaskContainer;
