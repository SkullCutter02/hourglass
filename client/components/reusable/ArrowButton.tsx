import React from "react";
import Link from "next/link";

interface Props {
  text: string;
  buttonColor: string;
  buttonHoverColor: string;
  textColor: string;
  textSize: number;
  link?: string;
}

const ArrowButton: React.FC<Props> = ({ text, buttonColor, textColor, textSize, buttonHoverColor, link }) => {
  return (
    <React.Fragment>
      {link ? (
        <Link href={link}>
          <button className="arrow-button">
            {text}
            <span className="arrow" />
          </button>
        </Link>
      ) : (
        <button className="arrow-button">
          {text}
          <span className="arrow" />
        </button>
      )}

      <style jsx>{`
        .arrow-button {
          display: flex;
          color: ${textColor};
          background-color: ${buttonColor};
          padding: 10px 16px;
          border-radius: 20px;
          transition: all 0.3s ease;
          font-weight: bold;
          cursor: pointer;
          align-items: center;
          font-size: ${textSize}px;
          margin: 10px;
          border: none;
        }

        .arrow-button > .arrow {
          width: 6px;
          height: 6px;
          border-right: 2px solid #ffffff;
          border-bottom: 2px solid #fafafa;
          position: relative;
          transform: rotate(-45deg);
          margin: 0 6px;
          transition: all 0.3s ease;
        }

        .arrow-button > .arrow::before {
          display: block;
          background-color: currentColor;
          width: 3px;
          transform-origin: bottom right;
          height: 2px;
          position: absolute;
          opacity: 0;
          bottom: calc(-2px / 2);
          transform: rotate(45deg);
          transition: all 0.3s ease;
          content: "";
          right: 0;
        }

        .arrow-button:hover > .arrow {
          transform: rotate(-45deg) translate(4px, 4px);
          border-color: #fff;
        }

        .arrow-button:hover > .arrow::before {
          opacity: 1;
          width: 8px;
        }

        .arrow-button:hover {
          background-color: ${buttonHoverColor};
          color: #fff;
        }
      `}</style>
    </React.Fragment>
  );
};

export default ArrowButton;
