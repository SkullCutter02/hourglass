import React from "react";

interface Props {
  width?: number;
  inputColor?: string;
  labelColor?: string;
  height?: number;
  text: string;
  fontSize?: number;
  transitionFontSize?: number;
  inputType?: string;
  margin?: number;
  required?: boolean;
  inputRef?: React.MutableRefObject<HTMLInputElement>;
}

const AnimatedInput: React.FC<Props> = ({
  width = 100,
  inputColor = "#74869d",
  labelColor = "#fff",
  height = 40,
  text,
  fontSize = 13,
  transitionFontSize = 10,
  inputType = "text",
  margin = 0,
  required = true,
  inputRef,
}) => {
  return (
    <React.Fragment>
      <div className="input">
        <input className="input__input" placeholder=" " type={inputType} required={required} ref={inputRef} />
        <label className="input__label">{text}</label>
      </div>

      <style jsx>{`
        .input {
          position: relative;
          font-size: ${fontSize}px;
          background: ${inputColor};
          border-radius: 5px;
          height: ${height}px;
          margin: ${margin}px 0;
        }

        .input__input {
          padding: 25px 10px 15px 10px;
          color: #fff;
          background-color: transparent;
          position: relative;
          z-index: 3;
          width: ${width}%;
          text-indent: 5px;
          height: 100%;
          border: none;
        }

        .input__label {
          display: flex;
          padding-left: 1.5rem;
          color: ${labelColor};
          width: 100%;
          left: 0;
          height: 100%;
          position: absolute;
          margin-bottom: 3px;
          text-transform: uppercase;
          top: 0;
          transition: 0.3s;
          font-weight: 600;
          align-items: center;
          letter-spacing: 1px;
          z-index: 2;
          font-size: inherit;
        }

        .input__input:focus + .input__label,
        .input__input:not(:placeholder-shown) + .input__label {
          transform: translateY(-26%);
          padding-left: 1rem;
          font-size: ${transitionFontSize}px;
          color: #fff;
        }
      `}</style>
    </React.Fragment>
  );
};

export default AnimatedInput;
