import React, { useState, useEffect, useRef } from "react";
import { KeyboardDateTimePicker } from "@material-ui/pickers";
import Select, { OptionTypeBase } from "react-select";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { subMilliseconds } from "date-fns";

import RegularInput from "../reusable/RegularInput";
import RegularTextArea from "../reusable/RegularTextArea";
import { CategoryType } from "../../types/CategoryType";
import SpinnerButton from "../reusable/SpinnerButton";
import { urlBase64ToUint8Array } from "../../utils/urlBase64ToUInt8Array";

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

  const notifyTimeOptions = [
    { value: 0, label: "None" },
    { value: 600_000, label: "10 mins" },
    { value: 1_800_000, label: "30 mins" },
    { value: 3_600_000, label: "1 hr" },
    { value: 7_200_000, label: "2 hrs" },
    { value: 21_600_000, label: "6 hrs" },
    { value: 43_200_000, label: "12 hrs" },
    { value: 86_400_000, label: "1 day" },
    { value: 259_200_000, label: "3 days" },
    { value: 604_800_000, label: "1 week" },
  ];

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
            description: e.target.description.value.replace("\r", "<br/>"),
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
    <React.Fragment>
      <form className="create-task-form" onSubmit={createTask}>
        <div className="form-section">
          <h1>Create new Task</h1>
          <RegularInput placeholder={"Task name: "} name={"name"} margin={20} />
          <RegularTextArea
            name={"description"}
            placeholder={"Task description: (Optional)"}
            height={200}
            required={false}
            margin={10}
          />
          <div className="date-picker">
            <KeyboardDateTimePicker
              value={dueDate}
              onChange={setDueDate}
              placeholder={"Due date for this task: "}
              fullWidth
              disablePast
            />
          </div>
        </div>
        <div className="form-section below-form-section">
          <div className="category-select">
            <Select
              defaultValue={category}
              onChange={setCategory}
              options={options}
              placeholder={"Category"}
              isLoading={isLoading}
              className={"task-select"}
            />
          </div>
          <div className="category-select">
            <Select
              defaultValue={notifiedTime}
              onChange={setNotifiedTime}
              options={notifyTimeOptions}
              placeholder={"Notify before"}
              className={"task-select"}
            />
          </div>
          <div className="admin-only">
            <p>Admin Only:</p>
            <input type="checkbox" name={"adminOnly"} />
          </div>
          <p className="err-msg" ref={errMsgRef} style={{ marginTop: "40px" }} />
          <div className="spinner-button">
            <SpinnerButton
              text={"Create Task"}
              buttonColor={"#0cc1e0"}
              buttonHoverColor={"#128da5"}
              isLoading={loading}
              buttonType={"submit"}
            />
          </div>
        </div>
      </form>

      <style jsx>{`
        .create-task-form {
          width: 80%;
          height: 480px;
          margin: 70px auto;
          display: flex;
        }

        .create-task-form h1 {
          font-size: 1.4rem;
        }

        .form-section {
          width: 50%;
          margin: 0 30px;
          height: 100%;
        }

        .date-picker {
          width: 90%;
          min-width: 150px;
          margin: 30px 0;
        }

        .category-select {
          margin: 50px 0;
        }

        .spinner-button {
          float: right;
          margin-top: 30px;
        }

        .admin-only {
          font-size: 0.9rem;
          display: flex;
          align-items: center;
        }

        .admin-only p {
          margin-right: 10px;
        }

        .admin-only input {
          width: 15px;
          height: 15px;
        }

        @media screen and (max-width: 850px) {
          .create-task-form {
            width: 95%;
          }

          .form-section {
            margin: 0 10px;
          }

          .date-picker {
            width: 100%;
          }
        }

        @media screen and (max-width: 580px) {
          .create-task-form {
            flex-direction: column;
          }

          .form-section {
            width: 85%;
            margin: 0 auto;
          }

          .spinner-button {
            margin-top: 40px;
            margin-bottom: 90px;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default CreateTaskContainer;
