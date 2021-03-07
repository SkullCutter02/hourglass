import React from "react";

import Spinner from "./Spinner";

interface Props {
  text: string;
  isLoading: boolean;
}

const AuthButton: React.FC<Props> = ({ text, isLoading }) => {
  return (
    <React.Fragment>
      <button type={"submit"}>
        {isLoading ? (
          <div>
            <Spinner size={10} />
          </div>
        ) : (
          <p>{text}</p>
        )}
      </button>

      <style jsx>{`
        button {
          margin-top: 20px;
          width: 20%;
          min-width: 100px;
          min-height: 30px;
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

        div {
          position: relative;
        }
      `}</style>
    </React.Fragment>
  );
};

export default AuthButton;
