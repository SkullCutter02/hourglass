import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Props {
  text: string;
  buttonColor: string;
  buttonHoverColor: string;
  textColor: string;
  size: "large" | "medium" | "small";
  textSize: number;
  margin?: number;
  link?: string;
}

const Button: React.FC<Props> = ({
  text,
  buttonColor,
  textColor,
  size,
  textSize,
  buttonHoverColor,
  margin,
  link,
}) => {
  const [height, setHeight] = useState<number>();
  const [width, setWidth] = useState<number>();

  useEffect(() => {
    switch (size) {
      case "large":
        setHeight(40);
        setWidth(150);
        break;
      case "medium":
        setHeight(30);
        setWidth(120);
        break;
      case "small":
        setWidth(20);
        setWidth(90);
    }
  }, []);

  return (
    <React.Fragment>
      {link ? (
        <Link href={link}>
          <button>{text}</button>
        </Link>
      ) : (
        <button>{text}</button>
      )}

      <style jsx>{`
        button {
          cursor: pointer;
          padding: 5px 12px;
          border: none;
          border-radius: 5px;
          font-size: ${textSize}rem;
          background: ${buttonColor};
          color: ${textColor};
          height: ${height}px;
          width: ${width}px;
          transition: background 0.3s;
          margin: ${margin ? `${margin}` : 0};
        }

        button:hover {
          background: ${buttonHoverColor};
        }
      `}</style>
    </React.Fragment>
  );
};

export default Button;
