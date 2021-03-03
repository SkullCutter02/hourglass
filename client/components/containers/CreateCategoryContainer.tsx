import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import { ColorResult, SketchPicker } from "react-color";
import { useQueryClient } from "react-query";

import RegularInput from "../reusable/RegularInput";
import SpinnerButton from "../reusable/SpinnerButton";

const CreateCategoryContainer: React.FC = () => {
  const router = useRouter();
  const { uuid } = router.query;

  const queryClient = useQueryClient();

  const [color, setColor] = useState<string>("#ff0000");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const errMsgRef = useRef<HTMLParagraphElement>(null);

  const handleColorChange = (color: ColorResult) => {
    setColor(color.hex);
  };

  const createCategory = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const res = await fetch(`/api/categories/${uuid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: e.target.name.value.trim(),
        color: color,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setIsLoading(false);

      if (data.msg) {
        errMsgRef.current.textContent = data.msg;
      } else {
        errMsgRef.current.textContent = "Something went wrong";
      }
    } else {
      await queryClient.prefetchQuery("userProjects");
      await router.push(`/dashboard/project/${uuid}/category/${data.uuid}`);
    }
  };

  return (
    <React.Fragment>
      <form className="create-category-container" onSubmit={createCategory}>
        <h1>Create Category</h1>
        <RegularInput placeholder={"Category name: "} name={"name"} margin={20} />
        <h4>Category Color: </h4>
        <SketchPicker color={color} onChange={handleColorChange} />
        <p className="err-msg" ref={errMsgRef} style={{ marginTop: "20px" }} />
        <div className="submit">
          <SpinnerButton
            text={"Create Category"}
            buttonColor={"#0cc1e0"}
            buttonHoverColor={"#128da5"}
            isLoading={isLoading}
            buttonType={"submit"}
          />
        </div>
      </form>

      <style jsx>{`
        h1 {
          margin-bottom: 10px;
        }

        .create-category-container {
          width: 45%;
          margin: 50px auto;
          position: relative;
          min-width: 500px;
        }

        h4 {
          color: #4f4f4f;
          margin-bottom: 10px;
        }

        .submit {
          position: absolute;
          right: 15px;
          top: 160px;
        }

        @media screen and (max-width: 800px) {
          .create-category-container {
            width: 75%;
            min-width: 0;
          }

          .submit {
            right: 0;
            top: 500px;
            left: 0;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default CreateCategoryContainer;
