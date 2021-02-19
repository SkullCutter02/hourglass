import React, { useState, useRef } from "react";
import Link from "next/link";

import AnimatedInput from "../reusable/AnimatedInput";
import AuthButton from "../reusable/AuthButton";
import ArrowButton from "../reusable/ArrowButton";

interface Props {
  uuid: string | string[];
}

const ResetPasswordPageContainer: React.FC<Props> = ({ uuid }) => {
  const [success, setSuccess] = useState<boolean>(false);

  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const errMsgRef = useRef<HTMLParagraphElement>(null);

  const resetPassword = async (e) => {
    e.preventDefault();

    try {
      if (passwordRef.current.value === confirmPasswordRef.current.value) {
        errMsgRef.current.textContent = "";

        const res = await fetch("/api/auth/reset", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uuid: uuid,
            password: passwordRef.current.value,
          }),
        });
        const data = await res.json();

        if (res.ok) {
          setSuccess(true);
        } else {
          if (data.error) {
            errMsgRef.current.textContent = data.error;
          } else if (data.msg) {
            errMsgRef.current.textContent = data.msg;
          } else {
            errMsgRef.current.textContent = "Something went wrong";
          }
        }
      } else {
        errMsgRef.current.textContent = "Password values do not match";
      }
    } catch (err) {
      console.log(err);
      errMsgRef.current.textContent = "Something went wrong";
    }
  };

  return (
    <React.Fragment>
      {success ? (
        <div className="after-success">
          <h1>Password changed successfully!</h1>
          <Link href={"/auth/login"}>
            <div>
              <ArrowButton
                text={"Login"}
                buttonColor={"#1dca00"}
                buttonHoverColor={"#1e8000"}
                textColor={"#fff"}
                textSize={12}
              />
            </div>
          </Link>
        </div>
      ) : (
        <form onSubmit={resetPassword}>
          <h1>Reset your password</h1>
          <AnimatedInput text={"Password"} inputType={"password"} margin={30} inputRef={passwordRef} />
          <AnimatedInput
            text={"Confirm Password"}
            inputType={"password"}
            margin={5}
            inputRef={confirmPasswordRef}
          />
          <p className="err-msg" ref={errMsgRef} />
          <AuthButton text={"Reset"} />
        </form>
      )}

      <style jsx>{`
        form {
          height: 300px;
          width: 50vw;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -65%);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .err-msg {
          margin-top: 20px;
        }

        .after-success {
          height: 300px;
          width: 50vw;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .after-success h1 {
          margin-bottom: 30px;
        }

        @media screen and (max-width: 800px) {
          form,
          .after-success {
            width: 70vw;
          }
        }

        @media screen and (max-width: 500px) {
          form,
          .after-success {
            width: 85vw;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default ResetPasswordPageContainer;
