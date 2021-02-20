import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

interface Props {
  link?: string;
  text: string;
  buttonColor: string;
  buttonHoverColor: string;
  textColor?: string;
  textSize?: number;
  iconSize?: number;
}

const AddButton: React.FC<Props> = ({
  link,
  text,
  buttonColor,
  buttonHoverColor,
  textColor = "#fff",
  textSize = 10,
  iconSize = 10,
}) => {
  return (
    <React.Fragment>
      {link ? (
        <Link href={link}>
          <button>
            <FontAwesomeIcon icon={faPlus} height={iconSize} /> {text}
          </button>
        </Link>
      ) : (
        <button>
          <FontAwesomeIcon icon={faPlus} height={iconSize} /> {text}
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
          margin-left: 20px;
        }

        button:hover {
          background: ${buttonHoverColor};
        }
      `}</style>
    </React.Fragment>
  );
};

export default AddButton;
