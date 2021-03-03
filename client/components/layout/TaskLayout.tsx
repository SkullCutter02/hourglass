import React from "react";
import Select, { OptionTypeBase } from "react-select";
import { KeyboardDateTimePicker } from "@material-ui/pickers";

import RegularInput from "../reusable/RegularInput";
import RegularTextArea from "../reusable/RegularTextArea";
import SpinnerButton from "../reusable/SpinnerButton";

interface Props {
  onSubmit: (e: any) => any;
  dueDate: Date;
  setDueDate: React.Dispatch<React.SetStateAction<Date>>;
  category: OptionTypeBase;
  setCategory: React.Dispatch<React.SetStateAction<OptionTypeBase>>;
  isLoading: boolean;
  notifiedTime: OptionTypeBase;
  setNotifiedTime: React.Dispatch<React.SetStateAction<OptionTypeBase>>;
  errMsgRef: React.MutableRefObject<HTMLParagraphElement>;
  loading: boolean;
  options: { value: string; label: string }[];
  buttonText: string;
  defaultName?: string;
  defaultDescription?: string;
  header: string;
  selectPlaceholder: string;
}

const TaskLayout: React.FC<Props> = ({
  onSubmit,
  dueDate,
  setDueDate,
  category,
  setCategory,
  isLoading,
  notifiedTime,
  setNotifiedTime,
  errMsgRef,
  loading,
  options,
  buttonText,
  defaultName,
  defaultDescription,
  header,
  selectPlaceholder,
}) => {
  const notifyTimeOptions = [
    { value: 0, label: "No Notification" },
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
      <form className="create-task-form" onSubmit={onSubmit}>
        <div className="form-section">
          <h1>{header}</h1>
          <RegularInput placeholder={"Task name: "} name={"name"} margin={20} defaultValue={defaultName} />
          <RegularTextArea
            name={"description"}
            placeholder={"Task description: (Optional)"}
            height={200}
            required={false}
            margin={10}
            defaultValue={defaultDescription}
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
              value={category}
              onChange={setCategory}
              options={options}
              placeholder={"Category"}
              isLoading={isLoading}
              className={"task-select"}
              isSearchable={false}
            />
          </div>
          <div className="category-select">
            <Select
              value={notifiedTime}
              onChange={setNotifiedTime}
              options={notifyTimeOptions}
              placeholder={selectPlaceholder}
              className={"task-select"}
              isSearchable={false}
            />
          </div>
          <div className="admin-only">
            <p>Admin Only:</p>
            <input type="checkbox" name={"adminOnly"} />
          </div>
          <p className="err-msg" ref={errMsgRef} style={{ marginTop: "40px" }} />
          <div className="spinner-button">
            <SpinnerButton
              text={buttonText}
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
          width: 90%;
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

export default TaskLayout;
