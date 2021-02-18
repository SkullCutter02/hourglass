import React, { useRef } from "react";
import { useSetRecoilState } from "recoil";

import AnimatedInput from "../reusable/AnimatedInput";
import AuthButton from "../reusable/AuthButton";
import userState from "../../state/userState";

const LogInPageContainer: React.FC = () => {
  const setUserState = useSetRecoilState(userState);

  const credentialsRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const errMsgRef = useRef<HTMLParagraphElement>(null);

  const login = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          credentials: credentialsRef.current.value,
          password: passwordRef.current.value,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg);
      }

      setUserState(data);
    } catch (err) {
      errMsgRef.current.textContent = err;
    }
  };

  return (
    <React.Fragment>
      <form className="login-form-container" onSubmit={login}>
        <h1>Login</h1>
        <AnimatedInput text={"username or email address"} margin={30} inputRef={credentialsRef} />
        <AnimatedInput text={"password"} inputType={"password"} margin={5} inputRef={passwordRef} />
        <p className="err-msg" ref={errMsgRef} />
        <AuthButton text={"Login"} />
      </form>

      <style jsx>{`
        .login-form-container {
          height: 300px;
          width: 50vw;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -65%);
          padding: 2em;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .err-msg {
          margin-top: 20px;
          font-size: 0.85rem;
        }

        @media screen and (max-width: 800px) {
          .login-form-container {
            width: 70vw;
          }
        }

        @media screen and (max-width: 500px) {
          .login-form-container {
            width: 85vw;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default LogInPageContainer;
