import React from "react";

import Spinner from "./Spinner";

interface Props {
  text: string;
  spinnerSize?: number;
  textSize?: number;
  buttonColor: string;
  buttonHoverColor: string;
  buttonType?: "button" | "submit" | "reset";
  isLoading: boolean;
}

const SpinnerButton: React.FC<Props> = ({
  text,
  spinnerSize = 10,
  textSize = 12,
  buttonColor,
  buttonHoverColor,
  buttonType = "button",
  isLoading,
}) => {
  return (
    <React.Fragment>
      <button type={buttonType}>
        {isLoading ? (
          <div>
            <Spinner size={spinnerSize} />
          </div>
        ) : (
          <p>{text}</p>
        )}
      </button>

      <style jsx>{`
        button {
          font-size: ${textSize}px;
          width: 120px;
          height: 30px;
          border-radius: 20px;
          font-weight: bold;
          background: ${buttonColor};
          transition: background 0.3s ease;
          border: none;
          color: #fff;
        }

        button:hover {
          background: ${buttonHoverColor};
        }

        div {
          position: relative;
        }
      `}</style>
    </React.Fragment>
  );
};

export default SpinnerButton;
