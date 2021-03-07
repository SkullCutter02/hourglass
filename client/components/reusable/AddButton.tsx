import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

interface Props {
  text: string;
  buttonColor: string;
  buttonHoverColor: string;
  textColor?: string;
  textSize?: number;
  iconSize?: number;
  onClick?: () => void;
  link?: string;
  marginLeft?: number;
}

const AddButton: React.FC<Props> = ({
  text,
  buttonColor,
  buttonHoverColor,
  textColor = "#fff",
  textSize = 10,
  iconSize = 10,
  onClick,
  link,
  marginLeft = 20,
}) => {
  return (
    <React.Fragment>
      {link ? (
        <Link href={link}>
          <button onClick={onClick}>
            <FontAwesomeIcon icon={faPlus} height={iconSize} style={{ marginRight: "5px" }} /> <p>{text}</p>
          </button>
        </Link>
      ) : (
        <button onClick={onClick}>
          <FontAwesomeIcon icon={faPlus} height={iconSize} style={{ marginRight: "5px" }} /> <p>{text}</p>
        </button>
      )}

      <style jsx>{`
        button {
          background: ${buttonColor};
          border: none;
          border-radius: 20px;
          padding: 8px 12px;
          cursor: pointer;
          color: ${textColor};
          transition: background 0.3s ease;
          font-size: ${textSize}px;
          margin-left: ${marginLeft}px;
          display: flex;
          align-items: center;
        }

        button:hover {
          background: ${buttonHoverColor};
        }
      `}</style>
    </React.Fragment>
  );
};

export default AddButton;
