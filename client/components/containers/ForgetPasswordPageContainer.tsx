import React, { useRef, useState } from "react";

import AnimatedInput from "../reusable/AnimatedInput";
import AuthButton from "../reusable/AuthButton";

const ForgetPasswordPageContainer: React.FC = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const errMsgRef = useRef<HTMLParagraphElement>(null);

  const [sentEmail, setSentEmail] = useState<boolean>(false);

  const sendEmail = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth/forgot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailRef.current.value,
      }),
    });
    const data = await res.json();

    if (res.ok) {
      setSentEmail(true);
    } else {
      if (data.msg) {
        errMsgRef.current.textContent = data.msg;
      } else {
        errMsgRef.current.textContent = "Something went wrong";
      }
    }
  };

  return (
    <React.Fragment>
      {sentEmail ? (
        <h1 className="success-msg">Email Sent! Please check your inbox</h1>
      ) : (
        <form className="forget-password-form" onSubmit={sendEmail}>
          <React.Fragment>
            <h1>Enter your email address:</h1>
            <AnimatedInput text={"Email Address"} inputType={"email"} inputRef={emailRef} />
            <p className="err-msg" ref={errMsgRef} />
            <AuthButton text={"Send"} />
          </React.Fragment>
        </form>
      )}

      <style jsx>{`
        .success-msg {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -200%);
        }

        .forget-password-form {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -70%);
          height: 200px;
          width: 50vw;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .forget-password-form h1 {
          margin-bottom: 25px;
        }

        .err-msg {
          margin-top: 20px;
          font-size: 0.9rem;
        }

        @media screen and (max-width: 800px) {
          .forget-password-form {
            width: 70vw;
          }
        }

        @media screen and (max-width: 650px) {
          width: 85vw;
        }
      `}</style>
    </React.Fragment>
  );
};

export default ForgetPasswordPageContainer;
