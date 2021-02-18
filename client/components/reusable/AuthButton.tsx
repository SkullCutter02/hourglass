import React from "react";

interface Props {
  text: string;
}

const AuthButton: React.FC<Props> = ({ text }) => {
  return (
    <React.Fragment>
      <button type={"submit"}>{text}</button>

      <style jsx>{`
        button {
          margin-top: 20px;
          width: 20%;
          min-width: 100px;
          height: 30px;
          padding: 5px 10px;
          border: none;
          border-radius: 4px;
          align-self: flex-end;
          background: #2ecd71;
          color: #fff;
          transition: background 0.5s;
        }

        button:hover {
          background: #1d8147;
        }
      `}</style>
    </React.Fragment>
  );
};

export default AuthButton;
