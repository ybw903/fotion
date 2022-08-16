import React from "react";
import "./input.css";

interface InputProps {
  placeholder?: string;
  onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  autofocus?: boolean;
}

const Input = ({
  placeholder,
  onChange,
  value,
  autofocus = false,
}: InputProps) => {
  return (
    <input
      className="input"
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      autoFocus
    ></input>
  );
};

export default Input;
