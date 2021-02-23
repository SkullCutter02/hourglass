import React, { useRef } from "react";
import { useSetRecoilState } from "recoil";
import { useRouter } from "next/router";

import AnimatedInput from "../reusable/AnimatedInput";
import AuthButton from "../reusable/AuthButton";
import userState from "../../state/userState";

const SignUpPageContainer: React.FC = () => {
  const router = useRouter();
  const setUserState = useSetRecoilState(userState);

  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const errMsgRef = useRef<HTMLParagraphElement>(null);

  const signup = async (e) => {
    e.preventDefault();

    if (passwordRef.current.value === confirmPasswordRef.current.value) {
      errMsgRef.current.textContent = "";

      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username: usernameRef.current.value.toLowerCase(),
            email: emailRef.current.value.toLowerCase(),
            password: passwordRef.current.value,
          }),
        });
        const data = await res.json();

        if (!res.ok) {
          if (data.error) {
            throw new Error(data.error);
          } else if (data.msg) {
            throw new Error(data.msg);
          } else {
            throw new Error("Something went wrong");
          }
        }

        setUserState(data);
        await router.push("/dashboard");
      } catch (err) {
        errMsgRef.current.textContent = err;
      }
    } else {
      errMsgRef.current.textContent = "Password values do not match";
    }
  };

  return (
    <React.Fragment>
      <form className="signup-form-container" onSubmit={signup}>
        <h1 style={{ marginBottom: "20px" }}>Signup</h1>
        <AnimatedInput text={"username"} margin={7} inputRef={usernameRef} />
        <AnimatedInput text={"email address"} margin={7} inputType={"email"} inputRef={emailRef} />
        <AnimatedInput text={"password"} margin={7} inputType={"password"} inputRef={passwordRef} />
        <AnimatedInput
          text={"confirm password"}
          margin={7}
          inputType={"password"}
          inputRef={confirmPasswordRef}
        />
        <p className="err-msg" ref={errMsgRef} />
        <AuthButton text={"Sign Up"} />
      </form>

      <style jsx>{`
        .signup-form-container {
          height: 400px;
          width: 50vw;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -60%);
          padding: 2em;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .err-msg {
          margin-top: 10px;
          font-size: 0.85rem;
        }

        @media screen and (max-width: 800px) {
          .signup-form-container {
            width: 70vw;
          }
        }

        @media screen and (max-width: 500px) {
          .signup-form-container {
            width: 85vw;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default SignUpPageContainer;
