import React, { useState, useEffect } from "react";
import { KeyboardDateTimePicker } from "@material-ui/pickers";
import Select, { OptionTypeBase } from "react-select";
import { useQuery } from "react-query";
import { useRouter } from "next/router";

import RegularInput from "../reusable/RegularInput";
import RegularTextArea from "../reusable/RegularTextArea";
import { CategoryType } from "../../types/CategoryType";
import SpinnerButton from "../reusable/SpinnerButton";

const CreateTaskContainer: React.FC = () => {
  const router = useRouter();
  const { uuid } = router.query;

  const [dueDate, setDueDate] = useState<Date>(null);
  const [category, setCategory] = useState<OptionTypeBase>(null);
  const [options, setOptions] = useState<{ value: string; label: string }[]>(null);
  const [notifiedTime, setNotifiedTime] = useState<OptionTypeBase>(null);
  const [success, setSuccess] = useState<boolean>(false);

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
        initOptions.push({ value: category.name, label: category.name });
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

  return (
    <React.Fragment>
      <form className="create-task-form">
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
        <div className="form-section">
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
          <div className="spinner-button">
            <SpinnerButton
              text={"Create Task"}
              buttonColor={"#0cc1e0"}
              buttonHoverColor={"#128da5"}
              isLoading={success}
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
        }
      `}</style>
    </React.Fragment>
  );
};

export default CreateTaskContainer;
