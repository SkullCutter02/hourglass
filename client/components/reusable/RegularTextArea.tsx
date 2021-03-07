import React from "react";

interface Props {
  name: string;
  placeholder: string;
  height: number;
  required?: boolean;
  margin?: number;
  defaultValue?: string;
  maxLength?: number;
}

const RegularTextArea: React.FC<Props> = ({
  name,
  placeholder,
  height,
  required = true,
  margin = 0,
  defaultValue = "",
  maxLength = 4000,
}) => {
  return (
    <React.Fragment>
      <textarea
        placeholder={placeholder}
        name={name}
        required={required}
        defaultValue={defaultValue}
        maxLength={maxLength}
      />

      <style jsx>{`
        textarea {
          resize: none;
          width: 100%;
          height: ${height}px;
          color: #2b2b2b;
          background: #d7d7d7;
          border: 2px solid #6e6e6e;
          font-size: 0.8rem;
          padding: 15px;
          margin: ${margin}px 0;
        }
      `}</style>
    </React.Fragment>
  );
};

export default RegularTextArea;
