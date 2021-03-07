import React from "react";

interface Props {
  inputType?: string;
  placeholder: string;
  name: string;
  width?: number;
  height?: number;
  margin?: number;
  required?: boolean;
  defaultValue?: string;
  maxLength?: number;
}

const RegularInput: React.FC<Props> = ({
  inputType = "text",
  placeholder,
  name,
  width = 100,
  height = 40,
  margin = 0,
  required = true,
  defaultValue = "",
  maxLength = 4000,
}) => {
  return (
    <React.Fragment>
      <input
        type={inputType}
        placeholder={placeholder}
        name={name}
        required={required}
        defaultValue={defaultValue}
        maxLength={maxLength}
      />

      <style jsx>{`
        input {
          width: ${width}%;
          height: ${height}px;
          font-size: 0.8rem;
          text-indent: 15px;
          color: #2b2b2b;
          background: #d7d7d7;
          border: 2px solid #6e6e6e;
          margin: ${margin}px 0;
        }
      `}</style>
    </React.Fragment>
  );
};

export default RegularInput;
