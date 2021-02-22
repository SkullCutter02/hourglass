import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";

import RegularInput from "../reusable/RegularInput";
import RegularTextArea from "../reusable/RegularTextArea";
import SpinnerButton from "../reusable/SpinnerButton";

const CreateProjectContainer: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const router = useRouter();

  const errMsgRef = useRef<HTMLParagraphElement>(null);

  const createProject = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const res = await fetch("/api/projects", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: e.target.name.value,
        description: e.target.description.value,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setIsLoading(false);
      errMsgRef.current.textContent = "Something went wrong";
    } else {
      await queryClient.prefetchQuery("userProjects");
      await router.push(`/dashboard/project/${data.project.uuid}`);
    }
  };

  return (
    <React.Fragment>
      <form className="create-project-form" onSubmit={createProject}>
        <RegularInput placeholder={"Project name: "} name={"name"} />
        <RegularTextArea
          name={"description"}
          placeholder={"Project description: (Optional)"}
          height={200}
          margin={20}
          required={false}
        />
        <div className="submit">
          <p className="err-msg" ref={errMsgRef} style={{ marginBottom: "15px" }} />
          <SpinnerButton
            text={"Create Project"}
            buttonColor={"#0cc1e0"}
            buttonHoverColor={"#128da5"}
            isLoading={isLoading}
            buttonType={"submit"}
          />
        </div>
      </form>

      <style jsx>{`
        .create-project-form {
          margin: 90px auto;
          width: 45%;
          height: 350px;
        }

        .submit {
          margin-top: 10px;
          float: right;
        }
      `}</style>
    </React.Fragment>
  );
};

export default CreateProjectContainer;
