import React, { useState, useEffect, useRef } from "react";
import { OptionTypeBase } from "react-select";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { subMilliseconds } from "date-fns";

import { CategoryType } from "../../types/CategoryType";
import { urlBase64ToUint8Array } from "../../utils/urlBase64ToUInt8Array";
import TaskLayout from "../layout/TaskLayout";

const CreateTaskContainer: React.FC = () => {
  const router = useRouter();
  const { uuid } = router.query;

  const errMsgRef = useRef<HTMLParagraphElement>(null);

  const [dueDate, setDueDate] = useState<Date>(null);
  const [category, setCategory] = useState<OptionTypeBase>(null);
  const [options, setOptions] = useState<{ value: string; label: string }[]>(null);
  const [notifiedTime, setNotifiedTime] = useState<OptionTypeBase>(null);
  const [loading, setLoading] = useState<boolean>(false);

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
      await Notification.requestPermission();
      setLoading(true);

      let register: ServiceWorkerRegistration;
      let subscription: PushSubscription;

      if ("serviceWorker" in navigator && Notification.permission === "granted") {
        register = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        subscription = await register.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_KEY),
        });
      } else {
        if (notifiedTime.value !== 0) {
          alert("Notification permission is not granted. Notify me feature will not work");
        }
      }

      if (category && notifiedTime && dueDate) {
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
            dueDate: dueDate,
            notifiedTime: subMilliseconds(dueDate, notifiedTime.value),
            adminOnly: e.target.adminOnly.checked,
            categoryUuid: category.value,
            subscription:
              "serviceWorker" in navigator && Notification.permission === "granted" ? subscription : null,
          }),
        });
        const data = await res.json();

        if (!res.ok) {
          if (data.msg) {
            errMsgRef.current.textContent = data.msg;
          } else {
            errMsgRef.current.textContent = "Something went wrong";
          }

          setLoading(false);
        } else {
          await router.push(`/dashboard/project/${uuid}`);
        }
      } else {
        errMsgRef.current.textContent = "Due date, category or notified time fields cannot be empty";
      }
    } catch (err) {
      console.log(err);
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
    />
  );
};

export default CreateTaskContainer;
